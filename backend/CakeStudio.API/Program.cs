
using CakeStudio.API.DbContexts.models;
using CakeStudio.API.Extensions;
using CakeStudio.Infrastructure;
using CakeStudio.Infrastructure.BackgroundServices;

using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using Serilog;
using Stripe;

using System.Text;
using System.Threading.RateLimiting;

// =========================================================
// SERILOG CONFIGURATION
// =========================================================

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day)
    .CreateLogger();


var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

// =====================================================
// STRIPE CONFIGURATION
// =====================================================

var stripeSecretKey =
    builder.Configuration["StripeSettings:SecretKey"];

if (string.IsNullOrWhiteSpace(stripeSecretKey))
{
    throw new InvalidOperationException(
        "Stripe SecretKey is not configured.");
}

StripeConfiguration.ApiKey = stripeSecretKey;

// =====================================================
// SQL SERVER / ENTITY FRAMEWORK CORE
// =====================================================

builder.Services.AddDbContext<CakeStudioDbContext>(
    options =>
    {
        options.UseSqlServer(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"));
    });

// =====================================================
// HANGFIRE
// =====================================================

builder.Services.AddHangfire(configuration =>
{
    configuration.UseSqlServerStorage(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"));
});

builder.Services.AddHangfireServer();

// =====================================================
// BACKGROUND SERVICES
// =====================================================

builder.Services.AddHostedService<
    RefreshTokenCleanupService>();

// =====================================================
// CORS
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =====================================================
// CONTROLLERS + GLOBAL CSRF VALIDATION
// =====================================================

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(
        new AutoValidateAntiforgeryTokenAttribute());
});

builder.Services.AddInfrastructure();

builder.Services.AddHttpContextAccessor();

// =====================================================
// CSRF / ANTIFORGERY CONFIGURATION
// =====================================================

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";

    options.Cookie.Name = "XSRF-TOKEN-COOKIE";

    options.Cookie.HttpOnly = true;

    options.Cookie.SecurePolicy =
        CookieSecurePolicy.Always;

    options.Cookie.SameSite =
        SameSiteMode.None;
});

// =====================================================
// SLIDING WINDOW RATE LIMITING
// =====================================================

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;


    options.AddPolicy("auth", context =>
    {
        var clientIp =
            context.Connection.RemoteIpAddress?
                .ToString() ?? "unknown";

        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 5,

                Window = TimeSpan.FromMinutes(1),

                SegmentsPerWindow = 6,

                QueueLimit = 0,

                AutoReplenishment = true
            });
    });


    options.AddPolicy("api", context =>
    {
        var clientIp =
            context.Connection.RemoteIpAddress?
                .ToString() ?? "unknown";

        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 100,

                Window = TimeSpan.FromMinutes(1),

                SegmentsPerWindow = 6,

                QueueLimit = 0,

                AutoReplenishment = true
            });
    });


    options.OnRejected = async (
        context,
        cancellationToken) =>
    {
        var response = context.HttpContext.Response;

        response.StatusCode =
            StatusCodes.Status429TooManyRequests;

        response.ContentType = "application/json";

        // Use the limiter's retry estimate when available.
        if (context.Lease.TryGetMetadata(
            MetadataName.RetryAfter,
            out TimeSpan retryAfter))
        {
            response.Headers.RetryAfter =
                Math.Max(
                    1,
                    (int)Math.Ceiling(
                        retryAfter.TotalSeconds))
                .ToString();
        }

        await response.WriteAsJsonAsync(
            new
            {
                status = 429,
                message =
                    "Too many requests. Please try again later."
            },
            cancellationToken);
    };
});

// =====================================================
// SWAGGER
// =====================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
        });
});

// =====================================================
// JWT AUTHENTICATION
// =====================================================

var jwtSettings =
    builder.Configuration.GetSection("JwtSettings");

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings["Key"]!))
            };

        // ---------------------------------------------
        // READ JWT FROM HTTPONLY COOKIE
        // ---------------------------------------------

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue(
                    "access_token",
                    out var accessToken))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

// =====================================================
// BUILD APPLICATION
// =====================================================

var app = builder.Build();

// =====================================================
// MIDDLEWARE PIPELINE
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "CakeStudio API v1");
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("ReactPolicy");

app.UseGlobalExceptionMiddleware();

app.UseAuthentication();

// Must execute after routing.
app.UseRateLimiter();

app.UseAuthorization();

app.UseHangfireDashboard("/hangfire");

app.MapControllers();

app.Run();



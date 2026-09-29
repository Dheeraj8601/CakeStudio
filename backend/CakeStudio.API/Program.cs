using CakeStudio.API.DbContexts.models;
using CakeStudio.API.Extensions;
using CakeStudio.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Serilog;
using Stripe;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

var stripeSecretKey =
    builder.Configuration["StripeSettings:SecretKey"];

if (string.IsNullOrWhiteSpace(stripeSecretKey))
{
    throw new InvalidOperationException(
        "Stripe SecretKey is not configured."
    );
}

StripeConfiguration.ApiKey = stripeSecretKey;

builder.Host.UseSerilog();

builder.Services.AddDbContext<CakeStudioDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services
builder.Services.AddControllers();
builder.Services.AddInfrastructure();
builder.Services.AddHttpContextAccessor();

// Remove or comment out the following line, as there is no AddInfrastructure method defined or imported:
// builder.Services.AddInfrastructure();
builder.Services.AddEndpointsApiExplorer();

//Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header
        });

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference =
                        new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type =
                                Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        });
});

//JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                    Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CakeStudio API v1"));
}
app.UseHttpsRedirection();
app.UseCors("ReactPolicy");
app.UseStaticFiles();
app.UseGlobalExceptionMiddleware();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
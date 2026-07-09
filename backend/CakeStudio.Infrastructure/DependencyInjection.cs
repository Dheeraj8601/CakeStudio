using CakeStudio.Application.Interfaces;
using CakeStudio.Application.Services;
using CakeStudio.Infrastructure.Repositories;
using CakeStudio.Infrastructure.Security;
using CakeStudio.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services)
        {
            services.AddScoped<IUserRepository,UserRepository>();
            services.AddScoped<IRefreshTokenRepository,RefreshTokenRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPasswordService,PasswordService>();
            services.AddScoped<IJwtService,JwtService>();
            services.AddScoped<IRefreshTokenService,RefreshTokenService>();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContext, UserContext>();
            services.AddScoped<ICakeRepository, CakeRepository>();
            services.AddScoped<ICakeService, CakeService>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IOrderRepository,OrderRepository>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IEmailService,EmailService>();
            services.AddScoped<IReviewRepository,ReviewRepository>();
            services.AddScoped<IReviewService,ReviewService>();
            services.AddScoped<IAddressRepository,AddressRepository>();
            services.AddScoped<IAddressService,AddressService>();
            services.AddScoped<IWishlistRepository,WishlistRepository>();
            services.AddScoped<IWishlistService,WishlistService>();
            services.AddScoped<IAuditService,AuditService>();
            services.AddScoped<IInventoryRepository,InventoryRepository>();
            services.AddScoped<IInventoryService,InventoryService>();
            services.AddScoped<IFileUpload, FileUploadService>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IContactService, ContactService>();

            return services;
        }
    }
}

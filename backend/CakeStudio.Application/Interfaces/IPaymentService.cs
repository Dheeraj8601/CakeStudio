using CakeStudio.Application.DTOs.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentSessionResponseDto> CreateSessionAsync(int orderId);
        Task PaymentSuccessAsync(string stripeEventId,string sessionId);
        Task PaymentFailedAsync(string stripeEventId,string paymentIntentId,string? failureReason);
        Task CheckoutExpiredAsync(string stripeEventId,string sessionId);
        Task ProcessRefundWebhookAsync(string stripeEventId,string stripeRefundId,string status);
        Task<PaymentDetailsResponseDto?> GetPaymentByOrderAsync(int orderId,int userId,bool isAdmin);
        Task RefundAsync(int orderId,decimal? amount,int adminUserId,string? reason);
        Task<VerifyPaymentResponseDto> VerifyPaymentAsync(int orderId,string sessionId);
    }
}

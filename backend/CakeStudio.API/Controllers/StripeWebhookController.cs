using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/webhooks/stripe")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<StripeWebhookController> _logger;

        public StripeWebhookController(
            IPaymentService paymentService,
            IConfiguration configuration,
            ILogger<StripeWebhookController> logger)
        {
            _paymentService = paymentService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Webhook()
        {
            var json =
                await new StreamReader(
                    Request.Body)
                    .ReadToEndAsync();

            Event stripeEvent;

            try
            {
                var webhookSecret =
                    _configuration[
                        "StripeSettings:WebhookSecret"];

                stripeEvent =
                    EventUtility.ConstructEvent(
                        json,
                        Request.Headers[
                            "Stripe-Signature"],
                        webhookSecret);
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Invalid Stripe webhook signature.");

                return BadRequest();
            }

            try
            {
                switch (stripeEvent.Type)
                {
                    case EventTypes.CheckoutSessionCompleted:
                        {
                            var session = stripeEvent.Data.Object as Session;

                            if (session != null && session.PaymentStatus == "paid")
                            {
                                await _paymentService.PaymentSuccessAsync(stripeEvent.Id,session.Id);
                            }

                            break;
                        }

                    case EventTypes.PaymentIntentPaymentFailed:
                        {
                            var intent = stripeEvent.Data.Object as PaymentIntent;

                            if (intent != null)
                            {
                                await _paymentService.PaymentFailedAsync(stripeEvent.Id, intent.Id, intent.LastPaymentError?.Message);
                            }

                            break;
                        }

                    case EventTypes.CheckoutSessionExpired:
                        {
                            var session =
                                stripeEvent.Data.Object
                                    as Session;

                            if (session != null)
                            {
                                await _paymentService
                                    .CheckoutExpiredAsync(
                                        stripeEvent.Id,
                                        session.Id);
                            }

                            break;
                        }

                    case EventTypes.RefundUpdated:
                        {
                            var refund =
                                stripeEvent.Data.Object
                                    as Refund;

                            if (refund != null)
                            {
                                await _paymentService
                                    .ProcessRefundWebhookAsync(
                                        stripeEvent.Id,
                                        refund.Id,
                                        refund.Status);
                            }

                            break;
                        }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Stripe webhook processing failed. Event {EventId}",
                    stripeEvent.Id);

                Console.WriteLine("=================================");
                Console.WriteLine("STRIPE WEBHOOK ERROR");
                Console.WriteLine(ex.ToString());
                Console.WriteLine("=================================");

                return StatusCode(500);
            }
        }
    }
}
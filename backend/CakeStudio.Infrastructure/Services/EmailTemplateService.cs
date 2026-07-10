using CakeStudio.Persistence.Entities;
//using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public static class EmailTemplateService
    {
        public static string PaymentSuccessTemplate(string customerName, int orderId, decimal amount, string paymentId, string paymentMethod, string paymentDate)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>

<style>

body {{
    margin:0;
    padding:20px;
    background:#f7f7f7;
    font-family: Arial, Helvetica, sans-serif;
    color:#333333;
}}

.email-container {{
    max-width:700px;
    margin:0 auto;
    background:#ffffff;
    border:1px solid #e5e5e5;
    border-radius:12px;
    overflow:hidden;
}}

.header {{
    text-align:center;
    padding:25px 20px 15px;
}}

.logo {{
    font-size:42px;
}}

.brand {{
    font-size:42px;
    font-weight:bold;
    margin-top:5px;
}}

.brand-cake {{
    color:#ff5c7a;
}}

.brand-studio {{
    color:#2d2d2d;
}}

.tagline {{
    color:#7d7d7d;
    font-size:16px;
    margin-top:8px;
}}

.divider {{
    height:2px;
    background:#ff7a92;
}}

.content {{
    padding:30px;
}}

.greeting {{
    font-size:28px;
    font-weight:bold;
    margin-bottom:20px;
}}

.message {{
    font-size:16px;
    line-height:1.8;
    color:#555555;
}}

.status-badge {{
    display:inline-block;
    background:#32c766;
    color:white;
    padding:8px 18px;
    border-radius:25px;
    font-size:14px;
    font-weight:bold;
}}

.card {{
    margin-top:30px;
    border:1px solid #f1dede;
    border-radius:12px;
    padding:25px;
    background:#fffdfd;
}}

.card-title {{
    color:#ff5c7a;
    font-size:20px;
    font-weight:bold;
    margin-bottom:20px;
}}

.detail-row {{
    width:100%;
    margin-bottom:14px;
}}

.label {{
    display:inline-block;
    width:180px;
    color:#666666;
    font-weight:600;
}}

.value {{
    color:#333333;
}}

.paid-badge {{
    background:#dff5e5;
    color:#2f9d57;
    padding:5px 12px;
    border-radius:5px;
    font-size:13px;
    font-weight:bold;
}}

.next-section {{
    margin-top:25px;
    background:#eefbf2;
    border:1px solid #d8efdf;
    border-radius:12px;
    padding:20px;
}}

.next-title {{
    color:#2fa856;
    font-size:18px;
    font-weight:bold;
    margin-bottom:10px;
}}

.track-link {{
    color:#ff5c7a;
    font-weight:bold;
    text-decoration:none;
}}

.thank-you {{
    text-align:center;
    margin-top:30px;
    color:#666666;
    font-size:15px;
}}

.footer {{
    border-top:1px solid #ececec;
    margin-top:30px;
    padding:25px;
    text-align:center;
}}

.social {{
    margin-bottom:15px;
}}

.social-icon {{
    display:inline-block;
    width:38px;
    height:38px;
    line-height:38px;
    text-align:center;
    background:#ff6b88;
    color:white;
    border-radius:50%;
    margin:0 5px;
    text-decoration:none;
    font-size:18px;
}}

.copyright {{
    color:#999999;
    font-size:13px;
}}

</style>
</head>

<body>

<div class='email-container'>

    <div class='header'>

        <div class='brand'>
            <span class='brand-cake'>Cake</span><span class='brand-studio'>Studio</span>
        </div>

        <div class='tagline'>
            Bake Moments, Deliver Happiness
        </div>

    </div>

    <div class='divider'></div>

    <div class='content'>

        <div class='greeting'>
            Hi {customerName},
        </div>

        <div class='message'>

            We are happy to inform you that your payment was

            <span class='status-badge'>
                ✓ Successful
            </span>

            <br/><br/>

            Your order is confirmed and we are preparing it with care.

        </div>

        <div class='card'>

            <div class='card-title'>
                💳 Payment Details
            </div>

            <div class='detail-row'>
                <span class='label'>Order ID</span>
                <span class='value'>ORD-{orderId}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Payment ID</span>
                <span class='value'>{paymentId}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Payment Method</span>
                <span class='value'>{paymentMethod}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Amount Paid</span>
                <span class='value'>₹{amount}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Payment Date</span>
                <span class='value'>{paymentDate}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Payment Status</span>
                <span class='paid-badge'>Paid</span>
            </div>

        </div>

        <div class='next-section'>

            <div class='next-title'>
                📄 What's Next?
            </div>

            <div>
                We will send you another email once your order is shipped.
                <br/>
                You can
                <a href='#' class='track-link'>
                    track your order
                </a>
                anytime from your account.
            </div>

        </div>

        <div class='thank-you'>
            Thank you for choosing CakeStudio.
            We appreciate your trust in us!
        </div>

        <div class='footer'>

            <div class='social'>

                <a href='#' class='social-icon'>f</a>

                <a href='#' class='social-icon'>📷</a>

                <a href='#' class='social-icon'>✉</a>

            </div>

            <div class='copyright'>
                © {DateTime.Now.Year} CakeStudio. All rights reserved.
            </div>

        </div>

    </div>

</div>

</body>
</html>";
        }


        public static string WelcomeTemplate(string customerName, string email, string phoneNumber)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>

<style>

body {{
    margin:0;
    padding:20px;
    background:#f7f7f7;
    font-family:Arial, Helvetica, sans-serif;
    color:#333333;
}}

.email-container {{
    max-width:700px;
    margin:0 auto;
    background:#ffffff;
    border:1px solid #e5e5e5;
    border-radius:12px;
    overflow:hidden;
}}

.header {{
    text-align:center;
    padding:25px 20px 15px;
}}

.brand {{
    font-size:42px;
    font-weight:bold;
}}

.brand-cake {{
    color:#ff5c7a;
}}

.brand-studio {{
    color:#2d2d2d;
}}

.tagline {{
    color:#777777;
    margin-top:8px;
}}

.divider {{
    height:2px;
    background:#ff6b88;
}}

.content {{
    padding:30px;
}}

.title {{
    font-size:32px;
    font-weight:bold;
    margin-bottom:20px;
}}

.customer-name {{
    color:#ff5c7a;
    font-size:22px;
    font-weight:bold;
    margin-bottom:15px;
}}

.description {{
    color:#666666;
    line-height:1.8;
    font-size:15px;
}}

.account-card {{
    margin-top:30px;
    border:1px solid #f1dede;
    border-radius:12px;
    background:#fffdfd;
    padding:25px;
}}

.account-title {{
    color:#ff5c7a;
    font-size:20px;
    font-weight:bold;
    margin-bottom:20px;
}}

.detail-row {{
    margin-bottom:12px;
}}

.label {{
    display:inline-block;
    width:120px;
    color:#666666;
    font-weight:600;
}}

.value {{
    color:#333333;
}}

.features-title {{
    text-align:center;
    margin-top:35px;
    margin-bottom:25px;
    font-size:24px;
    font-weight:bold;
}}

.feature-grid {{
    width:100%;
    text-align:center;
}}

.feature-card {{
    display:inline-block;
    width:140px;
    vertical-align:top;
    border:1px solid #f2e7e7;
    border-radius:10px;
    padding:15px;
    margin:5px;
    min-height:170px;
}}

.feature-icon {{
    font-size:30px;
    margin-bottom:10px;
}}

.feature-heading {{
    color:#ff5c7a;
    font-weight:bold;
    margin-bottom:10px;
    font-size:14px;
}}

.feature-text {{
    color:#666666;
    font-size:13px;
    line-height:1.5;
}}

.cta-section {{
    text-align:center;
    margin-top:30px;
}}

.cta-button {{
    display:inline-block;
    background:#ff5c7a;
    color:white !important;
    text-decoration:none;
    padding:14px 30px;
    border-radius:6px;
    font-weight:bold;
}}

.cta-text {{
    margin-top:15px;
    color:#666666;
}}

.footer {{
    border-top:1px solid #ececec;
    margin-top:30px;
    padding:25px;
    text-align:center;
}}

.footer-message {{
    color:#666666;
}}

.footer-highlight {{
    color:#ff5c7a;
    font-weight:bold;
    margin-top:10px;
}}

.social {{
    margin-top:20px;
}}

.social-icon {{
    display:inline-block;
    width:38px;
    height:38px;
    line-height:38px;
    text-align:center;
    background:#ff6b88;
    color:white;
    border-radius:50%;
    margin:0 5px;
    text-decoration:none;
}}

.copyright {{
    color:#999999;
    font-size:13px;
    margin-top:15px;
}}

</style>
</head>

<body>

<div class='email-container'>

    <div class='header'>

        <div class='brand'>
            <span class='brand-cake'>Cake</span><span class='brand-studio'>Studio</span>
        </div>

        <div class='tagline'>
            Bake Moments, Deliver Happiness
        </div>

    </div>

    <div class='divider'></div>

    <div class='content'>

        <div class='title'>
            Welcome to CakeStudio! 🎉
        </div>

        <div class='customer-name'>
            Hi {customerName},
        </div>

        <div class='description'>

            Thank you for joining CakeStudio family!

            We're excited to have you on board.

            <br/><br/>

            Your account is now created and you're all set to explore delicious cakes and place your first order.

        </div>

        <div class='account-card'>

            <div class='account-title'>
                👤 Your Account Details
            </div>

            <div class='detail-row'>
                <span class='label'>Email</span>
                <span class='value'>{email}</span>
            </div>

            <div class='detail-row'>
                <span class='label'>Mobile</span>
                <span class='value'>{phoneNumber}</span>
            </div>

        </div>

        <div class='features-title'>
            What you can do with CakeStudio
        </div>

        <div class='feature-grid'>

            <div class='feature-card'>
                <div class='feature-icon'>🎂</div>
                <div class='feature-heading'>Wide Range of Cakes</div>
                <div class='feature-text'>
                    Discover delicious cakes for every occasion.
                </div>
            </div>

            <div class='feature-card'>
                <div class='feature-icon'>🛵</div>
                <div class='feature-heading'>Fast Delivery</div>
                <div class='feature-text'>
                    Fresh cakes delivered on time.
                </div>
            </div>

            <div class='feature-card'>
                <div class='feature-icon'>🛡️</div>
                <div class='feature-heading'>Secure Payments</div>
                <div class='feature-text'>
                    Safe and secure payment options.
                </div>
            </div>

            <div class='feature-card'>
                <div class='feature-icon'>🎧</div>
                <div class='feature-heading'>24/7 Support</div>
                <div class='feature-text'>
                    We are always here to help.
                </div>
            </div>

        </div>

        <div class='cta-section'>

            <a href='https://cakestudio.com'
               class='cta-button'>
                Start Exploring Cakes
            </a>

            <div class='cta-text'>
                Log in to your account and start your sweet journey with us!
            </div>

        </div>

        <div class='footer'>

            <div class='footer-message'>
                Thank you for choosing CakeStudio.
            </div>

            <div class='footer-highlight'>
                We look forward to being a part of your special moments!
            </div>

            <div class='social'>

                <a href='#' class='social-icon'>f</a>

                <a href='#' class='social-icon'>📷</a>

                <a href='#' class='social-icon'>✉</a>

            </div>

            <div class='copyright'>
                © {DateTime.Now.Year} CakeStudio. All rights reserved.
            </div>

        </div>

    </div>

</div>

</body>
</html>";
        }

        public static string ContactUsTemplate(string fullName,string email,string phone,string subject,string message)
        {
            return $@"
<!DOCTYPE html>
<html>

<head>

<meta charset='UTF-8'>

<style>

body{{
    background:#f5f5f5;
    padding:20px;
    font-family:Arial;
}}

.container{{
    max-width:700px;
    margin:auto;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    border:1px solid #eee;
}}

.header{{
    background:#ff5b84;
    color:white;
    text-align:center;
    padding:25px;
}}

.header h1{{
    margin:0;
}}

.content{{
    padding:30px;
}}

.card{{
    background:#fafafa;
    border:1px solid #eee;
    border-radius:10px;
    padding:20px;
    margin-top:20px;
}}

.label{{
    font-weight:bold;
    color:#ff5b84;
}}

.message{{
    margin-top:15px;
    white-space:pre-wrap;
    line-height:1.7;
}}

.footer{{
    text-align:center;
    color:#888;
    padding:20px;
    font-size:13px;
}}

</style>

</head>

<body>

<div class='container'>

<div class='header'>

<h1>📩 New Contact Message</h1>

</div>

<div class='content'>

<p>
A customer has submitted the Contact Us form.
</p>

<div class='card'>

<p><span class='label'>Name :</span> {fullName}</p>

<p><span class='label'>Email :</span> {email}</p>

<p><span class='label'>Phone :</span> {phone}</p>

<p><span class='label'>Subject :</span> {subject}</p>

<p class='label'>Message</p>

<div class='message'>
{message}
</div>

</div>

</div>

<div class='footer'>

CakeStudio Contact Form

</div>

</div>

</body>

</html>";
        }

        public static string ReviewReplyTemplate(string customerName,string cakeName,string review,string reply)
        {
            return $@"
<!DOCTYPE html>

<html>

<head>

<style>

body{{
font-family:Segoe UI;
background:#fff8fa;
margin:0;
padding:40px;
}}

.card{{
max-width:650px;
margin:auto;
background:#fff;
border-radius:16px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);
}}

.header{{
background:#ff5b84;
padding:24px;
color:#fff;
font-size:28px;
font-weight:bold;
text-align:center;
}}

.content{{
padding:30px;
}}

.review{{
background:#fff6f8;
padding:16px;
border-left:5px solid #ff5b84;
border-radius:8px;
margin:20px 0;
}}

.reply{{
background:#f8fff8;
padding:16px;
border-left:5px solid #3cb371;
border-radius:8px;
margin-top:20px;
}}

.footer{{
padding:20px;
background:#fafafa;
text-align:center;
color:#777;
}}

</style>

</head>

<body>

<div class='card'>

<div class='header'>
CakeStudio
</div>

<div class='content'>

<h2>Hello {customerName}, 👋</h2>

<p>
Thank you for taking the time to review
<b>{cakeName}</b>.
We truly value your feedback.
</p>

<div class='review'>

<b>Your Review</b>

<p>{review}</p>

</div>

<div class='reply'>

<b>Our Reply</b>

<p>{reply}</p>

</div>

<p style='margin-top:30px;'>

We appreciate your support and look forward
to serving you again.

</p>

</div>

<div class='footer'>

Made with ❤️ by CakeStudio

</div>

</div>

</body>

</html>";
        }

        public static string BuildOrderConfirmationEmail(Order order,Address address,string frontendBaseUrl)
        {

            var orderUrl =
                $"{frontendBaseUrl}/orders/{order.Id}";

            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'/>
</head>

<body style='margin:0;padding:0;background:#fff7f9;font-family:Segoe UI,Arial,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0'>
<tr>
<td align='center'>

<table width='650'
       style='background:#ffffff;
              border-radius:12px;
              overflow:hidden;
              border:1px solid #f5dce3;'>

<tr>
<td style='background:#ff5b84;
           padding:24px;
           color:white;
           text-align:center;'>

<h1 style='margin:0'>
CakeStudio
</h1>

<p style='margin-top:10px;font-size:18px'>
Your order has been placed successfully 🎉
</p>

</td>
</tr>

<tr>
<td style='padding:30px;'>

<p>Hello <b>{address.FullName}</b>,</p>

<p>

Thank you for ordering from
<b>CakeStudio</b>.

Your order has been received successfully.

</p>

<table width='100%'
style='border-collapse:collapse;
margin-top:25px;'>

<tr>

<td style='padding:10px;
border:1px solid #eee;'>
Order ID
</td>

<td style='padding:10px;
border:1px solid #eee;'>
#{order.Id}
</td>

</tr>

<tr>

<td style='padding:10px;
border:1px solid #eee;'>
Payment Method
</td>

<td style='padding:10px;
border:1px solid #eee;'>
{order.PaymentMethod}
</td>

</tr>

<tr>

<td style='padding:10px;
border:1px solid #eee;'>
Order Amount
</td>

<td style='padding:10px;
border:1px solid #eee;'>
₹{order.TotalAmount}
</td>

</tr>

<tr>

<td style='padding:10px;
border:1px solid #eee;'>
Order Status
</td>

<td style='padding:10px;
border:1px solid #eee;'>
{order.OrderStatus}
</td>

</tr>

</table>

<div style='text-align:center;
margin-top:35px;'>

<a href='{orderUrl}'
style='background:#ff5b84;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:8px;
font-weight:600;'>

View Order Details

</a>

</div>

<p style='margin-top:30px;'>

From the above page you can

<ul>
<li>Track your order</li>
<li>View ordered items</li>
<li>Cancel your order (if eligible)</li>
</ul>

</p>

<p>

Thank you for choosing
<b>CakeStudio ❤️</b>

</p>

</td>
</tr>

</table>

</td>
</tr>

</table>

</body>
</html>";
        }

        public static string BuildOrderStatusUpdateEmail(Order order,Address address,string frontendBaseUrl)
        {
            var orderUrl =
                $"{frontendBaseUrl}/orders/{order.Id}";

            var updatedOn =
                DateTime.Now.ToString("dd MMM yyyy hh:mm tt");

            string statusColor = "#ff5b84";

            string statusMessage;

            switch (order.OrderStatus)
            {
                case "Delivered":

                    statusColor = "#2e7d32";

                    statusMessage = @"
<div style='
background:#e8f5e9;
border-left:5px solid #2e7d32;
padding:20px;
border-radius:10px;
margin:25px 0;'>

<h2 style='margin:0;color:#2e7d32;'>

🎉 Your Order Has Been Delivered!

</h2>

<p style='margin-top:12px;color:#444;line-height:1.8;'>

We hope you loved your CakeStudio order!

Thank you for letting us be part of your celebration.

Your feedback means a lot to us, so don't forget to leave a review for your delicious cake.

❤️ Thank you for choosing CakeStudio.

</p>

</div>";

                    break;

                case "Out for Delivery":

                    statusColor = "#ef6c00";

                    statusMessage = @"
<div style='
background:#fff8e1;
border-left:5px solid #ef6c00;
padding:20px;
border-radius:10px;
margin:25px 0;'>

<h2 style='margin:0;color:#ef6c00;'>

🚚 Your Cake Is On The Way!

</h2>

<p style='margin-top:12px;color:#444;line-height:1.8;'>

Our delivery partner is on the way with your order.

Please keep your phone nearby so the delivery executive can reach you if required.

We hope you enjoy your CakeStudio experience!

</p>

</div>";

                    break;

                case "Cancelled":

                    statusColor = "#d32f2f";

                    statusMessage = @"
<div style='
background:#ffebee;
border-left:5px solid #d32f2f;
padding:20px;
border-radius:10px;
margin:25px 0;'>

<h2 style='margin:0;color:#d32f2f;'>

❌ Your Order Has Been Cancelled

</h2>

<p style='margin-top:12px;color:#444;line-height:1.8;'>

Your order has been cancelled successfully.

If this cancellation was not expected or you need any assistance,
our support team will be happy to help.

</p>

</div>";

                    break;

                default:

                    statusColor = "#ff5b84";

                    statusMessage = @"
<div style='
background:#fff5f8;
border-left:5px solid #ff5b84;
padding:20px;
border-radius:10px;
margin:25px 0;'>

<h2 style='margin:0;color:#ff5b84;'>

📦 Order Status Updated

</h2>

<p style='margin-top:12px;color:#444;line-height:1.8;'>

Your order status has been updated.

You can view the latest status and complete order details by clicking the button below.

</p>

</div>";

                    break;
            }

            return $@"
<!DOCTYPE html>

<html>

<body style='margin:0;
padding:0;
background:#fff7f9;
font-family:Segoe UI,Arial,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0'>

<tr>

<td align='center'>

<table width='650'
style='
background:#ffffff;
border-radius:12px;
overflow:hidden;
border:1px solid #f5dce3;
box-shadow:0 8px 25px rgba(0,0,0,.06);'>

<tr>

<td style='
background:#ff5b84;
padding:28px;
text-align:center;
color:white;'>

<h1 style='margin:0;'>

CakeStudio

</h1>

<p style='margin-top:10px;
font-size:18px;'>

Order Status Update

</p>

</td>

</tr>

<tr>

<td style='padding:35px;'>

<p style='font-size:16px;'>

Hello <strong>{address.FullName}</strong>,

</p>

{statusMessage}

<table width='100%'
style='border-collapse:collapse;
margin-top:30px;'>

<tr>

<td style='padding:12px;
border:1px solid #eee;
background:#fafafa;
font-weight:600;'>

Order ID

</td>

<td style='padding:12px;
border:1px solid #eee;'>

#{order.Id}

</td>

</tr>

<tr>

<td style='padding:12px;
border:1px solid #eee;
background:#fafafa;
font-weight:600;'>

Current Status

</td>

<td style='
padding:12px;
border:1px solid #eee;
font-weight:bold;
color:{statusColor};'>

{order.OrderStatus}

</td>

</tr>

<tr>

<td style='padding:12px;
border:1px solid #eee;
background:#fafafa;
font-weight:600;'>

Payment Status

</td>

<td style='padding:12px;
border:1px solid #eee;'>

{order.PaymentStatus}

</td>

</tr>

<tr>

<td style='padding:12px;
border:1px solid #eee;
background:#fafafa;
font-weight:600;'>

Updated On

</td>

<td style='padding:12px;
border:1px solid #eee;'>

{updatedOn}

</td>

</tr>

</table>

<div style='text-align:center;
margin-top:40px;'>

<a href='{orderUrl}'
style='
display:inline-block;
background:#ff5b84;
color:#fff;
text-decoration:none;
padding:15px 30px;
border-radius:8px;
font-size:16px;
font-weight:600;'>

View Order Details

</a>

</div>

<p style='margin-top:35px;
color:#555;
line-height:1.8;'>

Using the above page you can:

</p>

<ul style='color:#555;
line-height:2;'>

<li>Track your order progress</li>

<li>View ordered items</li>

<li>Cancel your order (if applicable)</li>

</ul>

<hr style='margin:35px 0;
border:none;
border-top:1px solid #eee;'>

<p style='text-align:center;
color:#777;
font-size:14px;'>

Thank you for choosing

<strong style='color:#ff5b84;'>CakeStudio ❤️</strong>

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>";
        }
    }
}

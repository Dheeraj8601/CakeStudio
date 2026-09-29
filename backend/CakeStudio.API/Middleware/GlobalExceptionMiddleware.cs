using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.Models;
using System;
using System.Net;
using System.Text.Json;

namespace CakeStudio.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Unhandled exception occurred");
                await HandleExceptionAsync(
                    context,
                    ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context,Exception exception)
        {
            var response = new ErrorResponse
            {
                Success = false
            };

            switch (exception)
            {
                case NotFoundException:
                    response.StatusCode =
                        (int)HttpStatusCode.NotFound;

                    response.Message =
                        exception.Message;

                    break;

                case BadRequestException:
                    response.StatusCode =
                        (int)HttpStatusCode.BadRequest;

                    response.Message =
                        exception.Message;

                    break;

                case UnauthorizedException:
                    response.StatusCode =
                        (int)HttpStatusCode.Unauthorized;

                    response.Message =
                        exception.Message;

                    break;

                default:
                    response.StatusCode =
                        (int)HttpStatusCode.InternalServerError;

                    response.Message =
                        "Something went wrong.";

                    break;
            }

            context.Response.ContentType =
                "application/json";

            context.Response.StatusCode =
                response.StatusCode;

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}

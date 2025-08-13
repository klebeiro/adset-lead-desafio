using System.Net;
using System.Text.Json;
using adset_api.Application.Errors;
using Microsoft.AspNetCore.Mvc;

namespace adset_api.Application.Middlewares
{
    public class ApiExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ApiExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ArgumentException ex)
            {
                var (status, title) = MapArgumentException(ex);

                var problem = new ProblemDetails
                {
                    Status = (int)status,
                    Title = title,
                    Detail = ex.Message,
                    Instance = context.Request.Path
                };

                context.Response.ContentType = "application/problem+json";
                context.Response.StatusCode = problem.Status ?? (int)HttpStatusCode.BadRequest;

                var json = JsonSerializer.Serialize(problem);
                await context.Response.WriteAsync(json);
            }
            catch (Exception)
            {
                var problem = new ProblemDetails
                {
                    Status = (int)HttpStatusCode.InternalServerError,
                    Title = "Erro interno do servidor",
                    Detail = ErrorMessages.Common.UnexpectedError,
                    Instance = context.Request.Path
                };

                context.Response.ContentType = "application/problem+json";
                context.Response.StatusCode = problem.Status.Value;

                var json = JsonSerializer.Serialize(problem);
                await context.Response.WriteAsync(json);
            }
        }

        private static (HttpStatusCode, string) MapArgumentException(ArgumentException ex)
        {
            if (ex.Message == ErrorMessages.Vehicle.NotFound)
                return (HttpStatusCode.NotFound, "Recurso não encontrado");

            if (ex.Message == ErrorMessages.Filter.InvalidPriceRange ||
                ex.Message == ErrorMessages.Vehicle.InvalidIdForQuery ||
                ex.Message == ErrorMessages.Vehicle.InvalidIdForUpdate ||
                ex.Message == ErrorMessages.Vehicle.InvalidIdForDelete ||
                ex.Message == ErrorMessages.Vehicle.InvalidUpdateData ||
                ex.Message == ErrorMessages.Vehicle.InvalidVehicle)
                return (HttpStatusCode.BadRequest, "Requisição inválida");

            return (HttpStatusCode.BadRequest, "Requisição inválida");
        }
    }
}
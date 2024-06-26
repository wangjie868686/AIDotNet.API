﻿using Thor.Abstractions;
using Thor.Ollama;

namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOllamaService(this IServiceCollection services)
    {
        IApiChatCompletionService.ServiceNames.Add("Ollama", OllamaOptions.ServiceName);
        services.AddKeyedSingleton<IApiChatCompletionService, OllamaChatService>(OllamaOptions.ServiceName);
        return services;
    }
}
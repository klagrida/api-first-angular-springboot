package com.example.taskmanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web Configuration
 *
 * Configures CORS (Cross-Origin Resource Sharing) to allow the frontend
 * to communicate with the backend API from a different origin.
 *
 * Configuration is read from application.properties:
 * - cors.allowed-origins
 * - cors.allowed-methods
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:4200}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods(allowedMethods.split(","))
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

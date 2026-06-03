package com.floralshop.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 綁定 app.cors.* */
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(String allowedOrigins) {
}

package com.floralshop.config;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Configuration;

/**
 * 啟用 @ConfigurationProperties 掃描（CorsProperties、RateLimitProperties 等）。
 */
@Configuration
@ConfigurationPropertiesScan("com.floralshop.config")
public class AppConfig {
}

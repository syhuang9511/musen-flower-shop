package com.floralshop.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 綁定 app.rate-limit.*（8.1 限流防護） */
@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(int loginPerMinute, int paymentPerMinute) {
}

package com.floralshop.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 綁定 app.jwt.*（JWT 簽發設定） */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, long accessTokenTtlMinutes) {
}

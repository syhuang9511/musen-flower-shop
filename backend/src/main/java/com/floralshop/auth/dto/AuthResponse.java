package com.floralshop.auth.dto;

/** 登入 / OAuth 成功回應：{ accessToken, user } */
public record AuthResponse(String accessToken, UserDto user) {
}

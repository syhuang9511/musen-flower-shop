package com.floralshop.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Google / LINE 一鍵登入請求：附帶 provider 回傳的授權碼 */
public record OAuthLoginRequest(
        @NotBlank(message = "缺少授權碼") String code) {
}

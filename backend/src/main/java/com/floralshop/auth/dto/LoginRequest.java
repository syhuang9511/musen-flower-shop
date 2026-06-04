package com.floralshop.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** 帳號密碼登入請求 */
public record LoginRequest(
        @Email(message = "信箱格式不正確") @NotBlank(message = "請輸入信箱") String email,
        @NotBlank(message = "請輸入密碼") String password) {
}

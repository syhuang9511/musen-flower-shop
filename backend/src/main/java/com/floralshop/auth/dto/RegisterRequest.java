package com.floralshop.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Email 驗證碼註冊請求（第二步：附帶驗證碼與密碼完成註冊） */
public record RegisterRequest(
        @Email(message = "信箱格式不正確") @NotBlank(message = "請輸入信箱") String email,
        @NotBlank(message = "請輸入驗證碼") String code,
        @NotBlank(message = "請輸入密碼") @Size(min = 6, message = "密碼至少 6 碼") String password) {
}

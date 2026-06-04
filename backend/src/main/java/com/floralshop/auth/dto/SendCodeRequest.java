package com.floralshop.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** 寄送 Email 驗證碼請求（第一步） */
public record SendCodeRequest(
        @Email(message = "信箱格式不正確") @NotBlank(message = "請輸入信箱") String email) {
}

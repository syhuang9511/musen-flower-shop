package com.floralshop.auth;

import com.floralshop.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 4.1 帳號註冊與認證（骨架）。
 * 完整實作需：JWT 簽發、Google/LINE OAuth token 交換、BCrypt 密碼雜湊。
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final EmailVerificationService emailVerificationService;

    public AuthController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    /** 取得當前登入會員 */
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me() {
        // TODO: 由 SecurityContext 取得會員
        return ApiResponse.ok(Map.of("id", 1, "name", "示範會員", "role", "MEMBER"));
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        // TODO: 驗證密碼、簽發 JWT
        return ApiResponse.ok(Map.of(
                "accessToken", "demo-token",
                "user", Map.of("id", 1, "name", "示範會員", "role", "MEMBER")));
    }

    /** Google / LINE 一鍵登入：用授權碼換 token */
    @PostMapping("/oauth/{provider}")
    public ApiResponse<Map<String, Object>> oauth(@PathVariable String provider,
                                                  @RequestBody Map<String, String> body) {
        // TODO: 以 code 向 provider 換 access token → 取 profile → 找/建會員 → 簽發 JWT
        return ApiResponse.ok(Map.of(
                "accessToken", "demo-token",
                "user", Map.of("id", 1, "name", provider + " 用戶", "role", "MEMBER")));
    }

    /** 4.1 寄送 Email 驗證碼（回傳碼給前端 EmailJS 寄出） */
    @PostMapping("/email/send-code")
    public ApiResponse<Map<String, String>> sendCode(@RequestBody Map<String, String> body) {
        String code = emailVerificationService.generateCode(body.get("email"));
        // 正式環境不應回傳明碼；此處示意前端 EmailJS 流程
        return ApiResponse.ok(Map.of("code", code));
    }

    @PostMapping("/email/verify")
    public ApiResponse<Void> verify(@RequestBody Map<String, String> body) {
        emailVerificationService.verify(body.get("email"), body.get("code"));
        // TODO: 啟用帳號 / 建立會員
        return ApiResponse.ok(null);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok(null);
    }
}

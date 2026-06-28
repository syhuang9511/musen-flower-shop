package com.floralshop.auth;

import com.floralshop.auth.dto.*;
import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import com.floralshop.member.Member;
import com.floralshop.member.MemberRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

/**
 * 4.1 帳號註冊與認證。
 * - Email 驗證碼註冊、帳密登入（簽發 JWT）
 * - Google / LINE 一鍵登入（授權轉址 + 授權碼換 token）
 * - /me 由 JWT 還原當前會員
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final OAuthService oAuthService;
    private final EmailVerificationService emailVerificationService;
    private final MemberRepository memberRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService,
                          OAuthService oAuthService,
                          EmailVerificationService emailVerificationService,
                          MemberRepository memberRepository,
                          org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.oAuthService = oAuthService;
        this.emailVerificationService = emailVerificationService;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** 當前登入會員 */
    @GetMapping("/me")
    public ApiResponse<UserDto> me(@AuthenticationPrincipal AuthPrincipal principal) {
        if (principal == null) {
            throw new BusinessException(40110, "尚未登入");
        }
        Member member = memberRepository.findById(principal.id())
                .orElseThrow(() -> new BusinessException(40110, "帳號不存在"));
        return ApiResponse.ok(UserDto.from(member));
    }

    /** 帳號密碼登入 */
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.ok(authService.login(req.email(), req.password()));
    }

    /** 4.1 寄送 Email 驗證碼（回傳碼供前端 EmailJS 寄出；正式環境不應回傳明碼） */
    @PostMapping("/email/send-code")
    public ApiResponse<Map<String, String>> sendCode(@Valid @RequestBody SendCodeRequest req) {
        String code = emailVerificationService.generateCode(req.email());
        return ApiResponse.ok(Map.of("code", code));
    }

    /** 驗證碼正確後完成註冊 */
    @PostMapping("/email/verify")
    public ApiResponse<Void> verify(@Valid @RequestBody RegisterRequest req) {
        authService.register(req.email(), req.code(), req.password());
        return ApiResponse.ok(null);
    }

    /** Google / LINE：導向 provider 授權頁 */
    @GetMapping("/oauth/{provider}/authorize")
    public ResponseEntity<Void> authorize(@PathVariable String provider) {
        URI target = URI.create(oAuthService.buildAuthorizeUrl(provider));
        return ResponseEntity.status(HttpStatus.FOUND).location(target).build();
    }

    /** Google / LINE：以授權碼換 token 完成登入 */
    @PostMapping("/oauth/{provider}")
    public ApiResponse<AuthResponse> oauth(@PathVariable String provider,
                                           @Valid @RequestBody OAuthLoginRequest req) {
        return ApiResponse.ok(oAuthService.login(provider, req.code()));
    }

    /** 登出（無狀態 JWT：前端清除 token 即可，此處保留端點以利日後撤銷名單） */
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok(null);
    }

}

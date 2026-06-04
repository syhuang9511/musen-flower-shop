package com.floralshop.auth;

/**
 * 由 JWT 解析後放入 SecurityContext 的登入主體。
 * 控制器可用 @AuthenticationPrincipal AuthPrincipal 取得。
 */
public record AuthPrincipal(Long id, String email, String name, String role) {
}

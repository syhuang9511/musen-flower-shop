package com.floralshop.auth;

import com.floralshop.auth.dto.AuthResponse;
import com.floralshop.common.BusinessException;
import com.floralshop.member.Member;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.UUID;

/**
 * 4.1 Google / LINE 一鍵登入。
 *
 * 流程：
 *  1. 前端導向 GET /auth/oauth/{provider}/authorize → 本服務組出 provider 授權 URL 後 302 轉址
 *  2. 使用者於 provider 同意 → provider 帶 code 轉回前端 /auth/{provider}/callback
 *  3. 前端 POST /auth/oauth/{provider} { code } → 本服務以 code 換 token、取個資、找/建會員、簽 JWT
 *
 * ⚠️ 需於 application-local.yml 填入 app.google.* 與 app.line.* 金鑰，並在
 *    Google Cloud Console / LINE Developers 後台登記 redirect_uri 為
 *    {app.oauth.redirect-base-url}/auth/{provider}/callback。
 */
@Service
public class OAuthService {

    private final AuthService authService;

    @Value("${app.google.client-id:}")
    private String googleClientId;
    @Value("${app.google.client-secret:}")
    private String googleClientSecret;
    @Value("${app.line.channel-id:}")
    private String lineChannelId;
    @Value("${app.line.channel-secret:}")
    private String lineChannelSecret;
    @Value("${app.oauth.redirect-base-url:http://localhost:5173}")
    private String redirectBaseUrl;

    private final RestClient restClient = RestClient.create();

    public OAuthService(AuthService authService) {
        this.authService = authService;
    }

    /** 組出 provider 的授權頁 URL 供前端轉址 */
    public String buildAuthorizeUrl(String provider) {
        String state = UUID.randomUUID().toString();
        return switch (provider.toLowerCase()) {
            case "google" -> {
                requireConfig(googleClientId, "Google");
                yield UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                        .queryParam("client_id", googleClientId)
                        .queryParam("redirect_uri", redirectUri("google"))
                        .queryParam("response_type", "code")
                        .queryParam("scope", "openid email profile")
                        .queryParam("state", state)
                        .build().toUriString();
            }
            case "line" -> {
                requireConfig(lineChannelId, "LINE");
                yield UriComponentsBuilder.fromUriString("https://access.line.me/oauth2/v2.1/authorize")
                        .queryParam("response_type", "code")
                        .queryParam("client_id", lineChannelId)
                        .queryParam("redirect_uri", redirectUri("line"))
                        .queryParam("state", state)
                        .queryParam("scope", "profile openid")
                        .build().toUriString();
            }
            default -> throw new BusinessException(40050, "不支援的登入方式：" + provider);
        };
    }

    /** 以授權碼換取會員身分並簽發 JWT */
    public AuthResponse login(String provider, String code) {
        return switch (provider.toLowerCase()) {
            case "google" -> google(code);
            case "line" -> line(code);
            default -> throw new BusinessException(40050, "不支援的登入方式：" + provider);
        };
    }

    private AuthResponse google(String code) {
        requireConfig(googleClientId, "Google");
        Map<String, Object> token = restClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form(Map.of(
                        "code", code,
                        "client_id", googleClientId,
                        "client_secret", googleClientSecret,
                        "redirect_uri", redirectUri("google"),
                        "grant_type", "authorization_code")))
                .retrieve()
                .body(MAP);
        String accessToken = str(token, "access_token");

        Map<String, Object> profile = restClient.get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(MAP);

        Member member = authService.findOrCreateOAuth(
                Member.AuthProvider.GOOGLE,
                str(profile, "sub"),
                str(profile, "email"),
                str(profile, "name"));
        return authService.issueToken(member);
    }

    private AuthResponse line(String code) {
        requireConfig(lineChannelId, "LINE");
        Map<String, Object> token = restClient.post()
                .uri("https://api.line.me/oauth2/v2.1/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form(Map.of(
                        "grant_type", "authorization_code",
                        "code", code,
                        "redirect_uri", redirectUri("line"),
                        "client_id", lineChannelId,
                        "client_secret", lineChannelSecret)))
                .retrieve()
                .body(MAP);
        String accessToken = str(token, "access_token");

        Map<String, Object> profile = restClient.get()
                .uri("https://api.line.me/v2/profile")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(MAP);

        Member member = authService.findOrCreateOAuth(
                Member.AuthProvider.LINE,
                str(profile, "userId"),
                null, // LINE 基本 profile 不含 email（需另解析 id_token）
                str(profile, "displayName"));
        return authService.issueToken(member);
    }

    // ---- helpers ----

    @SuppressWarnings("unchecked")
    private static final Class<Map<String, Object>> MAP = (Class<Map<String, Object>>) (Class<?>) Map.class;

    private String redirectUri(String provider) {
        return redirectBaseUrl + "/auth/" + provider + "/callback";
    }

    private MultiValueMap<String, String> form(Map<String, String> data) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        data.forEach(body::add);
        return body;
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map == null ? null : map.get(key);
        return v == null ? null : v.toString();
    }

    private void requireConfig(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(40051, "尚未設定 " + name + " 登入（請填入金鑰）");
        }
    }
}

package com.floralshop.auth;

import com.floralshop.config.JwtProperties;
import com.floralshop.member.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * JWT 簽發與解析（jjwt 0.12.x）。
 * Token subject = 會員 id，附帶 email / name / role 三個 claim。
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long ttlMinutes;

    public JwtService(JwtProperties props) {
        // HS256 要求金鑰至少 32 bytes，請於 application-local.yml 設定夠長的 app.jwt.secret
        this.key = Keys.hmacShaKeyFor(props.secret().getBytes(StandardCharsets.UTF_8));
        this.ttlMinutes = props.accessTokenTtlMinutes();
    }

    public String generateToken(Member member) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(member.getId()))
                .claim("email", member.getEmail())
                .claim("name", member.getName())
                .claim("role", member.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(ttlMinutes * 60)))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

package com.floralshop.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 8.1 限流防護：對登入與金流關鍵端點以「IP + 路徑」為 key 做 Rate Limiting，
 * 防範暴力破解與惡意刷單。正式環境建議改用 Redis 後端的分散式限流。
 */
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties props;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RateLimitFilter(RateLimitProperties props) {
        this.props = props;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        Integer limit = limitFor(path);
        if (limit == null) {
            chain.doFilter(request, response);
            return;
        }

        String key = request.getRemoteAddr() + ":" + path;
        Bucket bucket = buckets.computeIfAbsent(key, k -> newBucket(limit));

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":42900,\"message\":\"請求過於頻繁，請稍後再試\"}");
        }
    }

    private Integer limitFor(String path) {
        if (path.contains("/auth/login") || path.contains("/auth/email")) {
            return props.loginPerMinute();
        }
        if (path.contains("/orders") || path.contains("/payments")) {
            return props.paymentPerMinute();
        }
        return null;
    }

    private Bucket newBucket(int perMinute) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder().capacity(perMinute)
                        .refillGreedy(perMinute, Duration.ofMinutes(1)).build())
                .build();
    }
}

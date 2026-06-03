package com.floralshop.auth;

import com.floralshop.common.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 4.1 Email 驗證：產生 6 位數驗證碼，前端以 EmailJS 寄出；
 * 後端負責產碼、暫存、驗證時效（預設 5 分鐘）與正確性比對。
 *
 * 註：正式環境請改用 Redis 暫存（含 TTL），此處以記憶體 Map 示意。
 */
@Service
public class EmailVerificationService {

    private record Entry(String code, Instant expiresAt) {
    }

    private final Map<String, Entry> store = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();
    private final long ttlMinutes;

    public EmailVerificationService(@Value("${app.email-verification.ttl-minutes:5}") long ttlMinutes) {
        this.ttlMinutes = ttlMinutes;
    }

    /** 產生並暫存驗證碼，回傳給前端交由 EmailJS 寄出 */
    public String generateCode(String email) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        store.put(email, new Entry(code, Instant.now().plus(Duration.ofMinutes(ttlMinutes))));
        return code;
    }

    /** 驗證時效與正確性 */
    public void verify(String email, String code) {
        Entry entry = store.get(email);
        if (entry == null) {
            throw new BusinessException(40030, "請先取得驗證碼");
        }
        if (Instant.now().isAfter(entry.expiresAt())) {
            store.remove(email);
            throw new BusinessException(40031, "驗證碼已過期，請重新取得");
        }
        if (!entry.code().equals(code)) {
            throw new BusinessException(40032, "驗證碼錯誤");
        }
        store.remove(email);
    }
}

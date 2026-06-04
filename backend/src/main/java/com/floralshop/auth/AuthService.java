package com.floralshop.auth;

import com.floralshop.auth.dto.AuthResponse;
import com.floralshop.auth.dto.UserDto;
import com.floralshop.common.BusinessException;
import com.floralshop.member.Member;
import com.floralshop.member.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 4.1 會員認證業務邏輯：Email 註冊、帳密登入、OAuth 找/建會員、簽發 JWT。
 */
@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;

    public AuthService(MemberRepository memberRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailVerificationService emailVerificationService) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailVerificationService = emailVerificationService;
    }

    /** 帳號密碼登入 */
    @Transactional(readOnly = true)
    public AuthResponse login(String email, String rawPassword) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(40100, "帳號或密碼錯誤"));
        if (member.getPasswordHash() == null
                || !passwordEncoder.matches(rawPassword, member.getPasswordHash())) {
            throw new BusinessException(40100, "帳號或密碼錯誤");
        }
        return issueToken(member);
    }

    /** Email 驗證碼註冊：驗證碼正確後建立 LOCAL 會員 */
    @Transactional
    public void register(String email, String code, String rawPassword) {
        emailVerificationService.verify(email, code);
        if (memberRepository.findByEmail(email).isPresent()) {
            throw new BusinessException(40090, "此信箱已註冊，請直接登入");
        }
        Member member = new Member();
        member.setEmail(email);
        member.setPasswordHash(passwordEncoder.encode(rawPassword));
        member.setName(defaultName(email));
        member.setAuthProvider(Member.AuthProvider.LOCAL);
        member.setEmailVerified(true);
        memberRepository.save(member);
    }

    /** OAuth 找會員，找不到就建立（以 provider + uid 為主鍵，退而求其次用 email 比對） */
    @Transactional
    public Member findOrCreateOAuth(Member.AuthProvider provider, String providerUid,
                                    String email, String name) {
        return memberRepository.findByAuthProviderAndProviderUid(provider, providerUid)
                .or(() -> email != null ? memberRepository.findByEmail(email) : java.util.Optional.empty())
                .map(existing -> {
                    // 既有帳號補綁定 provider 資訊
                    if (existing.getProviderUid() == null) {
                        existing.setAuthProvider(provider);
                        existing.setProviderUid(providerUid);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    Member member = new Member();
                    member.setAuthProvider(provider);
                    member.setProviderUid(providerUid);
                    member.setEmail(email != null ? email
                            : provider.name().toLowerCase() + "_" + providerUid + "@oauth.local");
                    member.setName(name);
                    member.setEmailVerified(email != null);
                    return memberRepository.save(member);
                });
    }

    /** 為指定會員簽發 access token */
    public AuthResponse issueToken(Member member) {
        return new AuthResponse(jwtService.generateToken(member), UserDto.from(member));
    }

    private String defaultName(String email) {
        int at = email.indexOf('@');
        return at > 0 ? email.substring(0, at) : email;
    }
}

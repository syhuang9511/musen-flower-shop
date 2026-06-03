package com.floralshop.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByAuthProviderAndProviderUid(Member.AuthProvider provider, String providerUid);
}

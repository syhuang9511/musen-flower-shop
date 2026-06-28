package com.floralshop.member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MemberAddressRepository extends JpaRepository<MemberAddress, Long> {

    List<MemberAddress> findByMemberId(Long memberId);

    @Modifying
    @Query("UPDATE MemberAddress a SET a.isDefault = false WHERE a.memberId = :memberId")
    void clearDefaultByMemberId(Long memberId);
}

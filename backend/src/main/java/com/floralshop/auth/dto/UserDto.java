package com.floralshop.auth.dto;

import com.floralshop.member.Member;

/** 回傳給前端的會員資訊（不含敏感欄位） */
public record UserDto(Long id, String email, String name, String role) {

    public static UserDto from(Member m) {
        return new UserDto(m.getId(), m.getEmail(), m.getName(), m.getRole().name());
    }
}

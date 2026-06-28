package com.floralshop.member;

import com.floralshop.auth.AuthPrincipal;
import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberRepository memberRepository;
    private final MemberAddressRepository addressRepository;

    public MemberController(MemberRepository memberRepository, MemberAddressRepository addressRepository) {
        this.memberRepository = memberRepository;
        this.addressRepository = addressRepository;
    }

    // ── 個人資料 ──────────────────────────────────────────────────

    @GetMapping("/me")
    public ApiResponse<MemberDto> me(@AuthenticationPrincipal AuthPrincipal principal) {
        Member m = memberRepository.findById(principal.id()).orElseThrow();
        return ApiResponse.ok(toDto(m));
    }

    @PutMapping("/me")
    public ApiResponse<MemberDto> updateMe(@AuthenticationPrincipal AuthPrincipal principal,
                                           @Valid @RequestBody UpdateProfileRequest request) {
        Member m = memberRepository.findById(principal.id()).orElseThrow();
        m.setName(request.name());
        m.setPhone(request.phone());
        return ApiResponse.ok(toDto(memberRepository.save(m)));
    }

    // ── 常用地址 ──────────────────────────────────────────────────

    @GetMapping("/addresses")
    public ApiResponse<List<MemberAddress>> addresses(@AuthenticationPrincipal AuthPrincipal principal) {
        return ApiResponse.ok(addressRepository.findByMemberId(principal.id()));
    }

    @PostMapping("/addresses")
    @Transactional
    public ApiResponse<MemberAddress> addAddress(@AuthenticationPrincipal AuthPrincipal principal,
                                                  @Valid @RequestBody AddressRequest request) {
        if (request.isDefault()) {
            addressRepository.clearDefaultByMemberId(principal.id());
        }
        MemberAddress address = new MemberAddress();
        address.setMemberId(principal.id());
        address.setRecipientName(request.recipientName());
        address.setPhone(request.phone());
        address.setAddress(request.address());
        address.setDefault(request.isDefault());
        return ApiResponse.ok(addressRepository.save(address));
    }

    @PutMapping("/addresses/{id}")
    @Transactional
    public ApiResponse<MemberAddress> updateAddress(@AuthenticationPrincipal AuthPrincipal principal,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody AddressRequest request) {
        MemberAddress address = findOwnedAddress(id, principal.id());
        if (request.isDefault()) {
            addressRepository.clearDefaultByMemberId(principal.id());
        }
        address.setRecipientName(request.recipientName());
        address.setPhone(request.phone());
        address.setAddress(request.address());
        address.setDefault(request.isDefault());
        return ApiResponse.ok(addressRepository.save(address));
    }

    @DeleteMapping("/addresses/{id}")
    @Transactional
    public ApiResponse<Void> deleteAddress(@AuthenticationPrincipal AuthPrincipal principal,
                                           @PathVariable Long id) {
        addressRepository.delete(findOwnedAddress(id, principal.id()));
        return ApiResponse.ok(null);
    }

    @PatchMapping("/addresses/{id}/default")
    @Transactional
    public ApiResponse<Void> setDefault(@AuthenticationPrincipal AuthPrincipal principal,
                                         @PathVariable Long id) {
        MemberAddress address = findOwnedAddress(id, principal.id());
        addressRepository.clearDefaultByMemberId(principal.id());
        address.setDefault(true);
        addressRepository.save(address);
        return ApiResponse.ok(null);
    }

    // ── 私有輔助 ──────────────────────────────────────────────────

    private MemberAddress findOwnedAddress(Long id, Long memberId) {
        MemberAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new BusinessException("地址不存在"));
        if (!address.getMemberId().equals(memberId)) {
            throw new BusinessException(40300, "無操作權限");
        }
        return address;
    }

    private MemberDto toDto(Member m) {
        return new MemberDto(m.getId(), m.getEmail(), m.getName(), m.getPhone(),
                m.getPoints(), m.getAuthProvider().name(), m.isEmailVerified());
    }

    // ── DTOs ──────────────────────────────────────────────────────

    public record MemberDto(Long id, String email, String name, String phone,
                             Integer points, String authProvider, boolean emailVerified) {}

    public record UpdateProfileRequest(@NotBlank String name, String phone) {}

    public record AddressRequest(
            @NotBlank String recipientName,
            @NotBlank String phone,
            @NotBlank String address,
            boolean isDefault) {}
}

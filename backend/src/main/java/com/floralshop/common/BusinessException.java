package com.floralshop.common;

/**
 * 業務邏輯例外，由 GlobalExceptionHandler 轉為 4xx 回應。
 */
public class BusinessException extends RuntimeException {

    private final int code;

    public BusinessException(String message) {
        this(40000, message);
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}

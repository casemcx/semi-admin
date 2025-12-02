import { beforeEach, describe, expect, it } from '@rstest/core';
import { renderHook } from '@testing-library/react';

import { initLocale } from '@/provider/ConfigProvider/store';
import { useFormPlaceholders } from '../use-form-placeholders';

describe('useFormPlaceholders', () => {
  beforeEach(() => {
    // Reset to default locale before each test
    initLocale('zh-CN');
  });

  it('should return input placeholder with title', () => {
    const { result } = renderHook(() => useFormPlaceholders('用户名'));

    expect(result.current.inputPlaceholder).toBe('请输入用户名');
  });

  it('should return select placeholder with title', () => {
    const { result } = renderHook(() => useFormPlaceholders('状态'));

    expect(result.current.selectPlaceholder).toBe('请选择状态');
  });

  it('should return upload placeholder with title', () => {
    const { result } = renderHook(() => useFormPlaceholders('头像'));

    expect(result.current.uploadPlaceholder).toBe('请上传头像');
  });

  it('should handle empty title', () => {
    const { result } = renderHook(() => useFormPlaceholders(''));

    expect(result.current.inputPlaceholder).toBe('请输入');
    expect(result.current.selectPlaceholder).toBe('请选择');
    expect(result.current.uploadPlaceholder).toBe('请上传');
  });

  it('should handle undefined title', () => {
    const { result } = renderHook(() => useFormPlaceholders(undefined));

    expect(result.current.inputPlaceholder).toBe('请输入');
    expect(result.current.selectPlaceholder).toBe('请选择');
    expect(result.current.uploadPlaceholder).toBe('请上传');
  });

  it('should return English placeholders when locale is en-US', () => {
    initLocale('en-US');

    const { result } = renderHook(() => useFormPlaceholders('username'));

    expect(result.current.inputPlaceholder).toBe('Please enter username');
    expect(result.current.selectPlaceholder).toBe('Please select username');
    expect(result.current.uploadPlaceholder).toBe('Please upload username');
  });
});

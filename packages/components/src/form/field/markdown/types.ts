import type { HTMLAttributes } from 'react';

export const device = {
  mobile: 'mobile',
  desktop: 'desktop',
} as const;

export type MarkdownProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * 参数值
   */
  value?: string;
  /**
   * 参数值变化时回调
   */
  onChange?: (value?: string) => void;

  id: string | number;

  /**
   * 设备
   */
  device?: (keyof typeof device)[];

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 占位符
   */
  placeholder?: string;
};

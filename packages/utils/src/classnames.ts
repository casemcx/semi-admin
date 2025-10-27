import { clsx as clsxFn } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description 合并 classnames
 * @param inputs
 * @returns
 */
export const clsx = (...inputs: ClassValue[]) => {
  return twMerge(clsxFn(inputs));
};

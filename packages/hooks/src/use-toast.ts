import { Toast } from '@douyinfe/semi-ui';
import { useMemo } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  content?: string;
  duration?: number;
}

export function useToast() {
  return useMemo(
    () => ({
      success: (message: string, options: ToastOptions = {}) => {
        Toast.success({
          content: options.content || message,
          duration: options.duration ?? 3,
        });
      },
      error: (message: string, options: ToastOptions = {}) => {
        Toast.error({
          content: options.content || message,
          duration: options.duration ?? 3,
        });
      },
      warning: (message: string, options: ToastOptions = {}) => {
        Toast.warning({
          content: options.content || message,
          duration: options.duration ?? 3,
        });
      },
      info: (message: string, options: ToastOptions = {}) => {
        Toast.info({
          content: options.content || message,
          duration: options.duration ?? 3,
        });
      },
    }),
    [],
  );
}

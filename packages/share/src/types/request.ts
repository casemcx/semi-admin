import type {
  AxiosInstance,
  AxiosInterceptorOptions,
  InternalAxiosRequestConfig,
} from 'axios';

import type { Method, Middleware } from '../enums';

interface Result {
  code: number;
  msg: string;
  message: string;
}

export interface ResultData<T = string> extends Result {
  data: T;
}

export interface QueryPageResult<T = string> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface QueryPageBase {
  pageNum: number;
  pageSize: number;
  total?: number;
}

export type QueryPage<T extends Record<string, any> = Record<string, any>> = {
  pageNum?: number;
  pageSize?: number;
  total?: number;
} & Partial<T>;

const query: QueryPage<{
  name: string;
  age: number;
}> = {
  pageNum: 1,
  pageSize: 10,
  name: '123',
  age: 18,
};

export type CreateAxiosOptions = {
  /**
   * @description 前缀
   */
  baseURL?: string;
  /**
   * @description 默认请求方法
   * @default GET
   */
  default_method?: Method;
  /**
   * @description 请求超时时间
   */
  timeout?: number;
  /**
   * @description 是否携带cookie
   */
  withCredentials?: boolean;
};

export type ResultInterceptor<
  T extends Middleware,
  V extends
    | InternalAxiosRequestConfig
    | AxiosInstance = T extends Middleware.RESULT
    ? InternalAxiosRequestConfig
    : AxiosInstance,
> = {
  onFulfilled?: (value: V) => V | Promise<V>;
  onRejected?: (error: unknown) => unknown;
  options?: AxiosInterceptorOptions;
};

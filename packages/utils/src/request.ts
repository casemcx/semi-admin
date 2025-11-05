import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';

import type {
  CreateAxiosOptions,
  Middleware,
  ResultData,
  ResultInterceptor,
} from '@packages/share';
import { Method, ResultCode } from '@packages/share';

export class AxiosService {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.method) {
          config.method = this.options.default_method;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, status } = response;
        if (status < 200 || status >= 300) {
          return Promise.resolve({
            ...data,
            code: ResultCode.OVERDUE,
          });
        }

        if (data.code !== ResultCode.SUCCESS) {
          return Promise.resolve({
            ...data,
            code: ResultCode.OVERDUE,
          });
        }
        return data;
      },
      (error: AxiosError) => {
        return Promise.resolve({
          msg: error.message,
          code: ResultCode.OVERDUE,
        });
      },
    );
  }

  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.axiosInstance({
      url: url + qs.stringify(params),
      method: Method.GET,
    });
  }
  post<T>(url: string, data: unknown): Promise<ResultData<T>> {
    return this.axiosInstance({
      url: url,
      method: Method.POST,
      data,
    }) as Promise<ResultData<T>>;
  }

  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.axiosInstance({
      url: url + qs.stringify(params),
      method: Method.DELETE,
    });
  }

  put<T>(url: string, data: unknown): Promise<ResultData<T>> {
    return this.axiosInstance({
      url: url,
      method: Method.PUT,
      data,
    }) as Promise<ResultData<T>>;
  }

  use<T extends Middleware.RESULT | Middleware.RESPONSE>(
    type: T,
    options: ResultInterceptor<T>,
  ) {
    this.axiosInstance.interceptors[type]
      // @ts-ignore
      .use(options.onFulfilled, options.onRejected, options.options);
  }
}

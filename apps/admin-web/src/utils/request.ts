import { Middleware } from '@packages/share';
import { AxiosService } from '@packages/utils';

import { getToken } from '@/stores/user';

export const request = new AxiosService({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

request.use(Middleware.RESULT, {
  onFulfilled: config => {
    config.headers.set({
      authorization: getToken() ?? '',
    });
    return config;
  },
});

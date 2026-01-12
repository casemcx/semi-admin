import useUrlState from '@ahooksjs/use-url-state';
import {
  type QueryPage,
  type QueryPageResult,
  ResultCode,
  type ResultData,
} from '@packages/share';
import { useCallback, useRef, useState } from 'react';

export type TableStateOptions = {
  currentPage: number;
  pageSize: number;
  total: number;
};

type Entry = Record<string, any>;

export const useTableState = <T extends Entry, R extends Entry = T>(
  request: (query: QueryPage<T>) => Promise<ResultData<QueryPageResult<R>>>,
) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<R[]>([]);

  const [total, setTotal] = useState(0);

  const [query, setQuery] = useUrlState<QueryPage<T>>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  } as QueryPage<T>);

  const queryRef = useRef(query);

  const startLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);

    try {
      await fn();
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }

    setLoading(false);
  }, []);

  const reload = useCallback(
    () =>
      startLoading(async (params: Partial<QueryPage<T>> = {}) => {
        setQuery(prev => ({
          ...prev,
          ...params,
        }));

        try {
          const response = await request(params);

          if (response.code === ResultCode.SUCCESS) {
            const { records, total } = response.data;
            setDataSource(records);
            setTotal(total);
          } else {
            setDataSource([]);
            setTotal(0);
          }
        } catch (error) {
          setDataSource([]);
        }
      }),
    [startLoading, request, setQuery],
  );
};

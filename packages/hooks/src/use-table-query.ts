import useUrlState from '@ahooksjs/use-url-state';
import type { QueryPage, QueryPageResult, ResultData } from '@packages/share';
import { ResultCode } from '@packages/share';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface TablePagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

export const useTableQuery = <
  T extends Record<string, any> = Record<string, any>,
  R = T,
>(
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

  const fetchData = useCallback(
    async (params: Partial<QueryPage<T>> = {}) => {
      setLoading(true);

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
      } finally {
        setLoading(false);
      }
    },
    [request, setQuery],
  );

  const handleSearch = useCallback(
    (params: Partial<QueryPage<T>> = {}) => {
      const nextParams = {
        ...queryRef.current,
        ...params,
        pageNum: 1,
      };

      setQuery(prev => ({
        ...prev,
        ...nextParams,
      }));

      requestAnimationFrame(() => {
        fetchData({
          ...params,
          pageNum: 1,
        }).catch(error => {
          console.error('handleSearch error', error);
        });
      });
    },
    [fetchData, setQuery],
  );

  const handleReset = useCallback(() => {
    const defaultQuery = {
      pageNum: 1,
      pageSize: 10,
    } as QueryPage<T>;

    setQuery(prev => ({
      ...prev,
      ...defaultQuery,
    }));

    requestAnimationFrame(() => {
      fetchData(defaultQuery).catch(error => {
        console.error('handleReset error', error);
      });
    });
  }, [fetchData, setQuery]);

  const handlePageChange = useCallback(
    (currentPage: number, pageSize?: number) => {
      const nextPageSize = pageSize ?? queryRef.current.pageSize;
      const nextParams = {
        ...queryRef.current,
        pageNum: currentPage,
        pageSize: nextPageSize,
      };

      setQuery(prev => ({
        ...prev,
        ...nextParams,
      }));

      requestAnimationFrame(() => {
        fetchData({
          pageNum: currentPage,
          pageSize: nextPageSize,
          ...query,
        }).catch(error => {
          console.error('handlePageChange error', error);
        });
      });
    },
    [fetchData, setQuery, query],
  );

  const startTableTransition = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);

    try {
      await fn();
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }

    setLoading(false);
  }, []);

  return {
    loading,
    dataSource,
    query,
    total,
    setQuery,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  };
};

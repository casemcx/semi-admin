import useUrlState from '@ahooksjs/use-url-state';
import type { QueryPage, QueryPageResult, ResultData } from '@packages/share';
import { ResultCode } from '@packages/share';
import { useState } from 'react';

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

  const [query, setQuery] = useUrlState<QueryPage<T>>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  } as QueryPage<T>);

  const fetchData = async (params: Partial<QueryPage<T>> = query) => {
    setLoading(true);
    try {
      const response = await request(params as QueryPage<T>);

      if (response.code === ResultCode.SUCCESS) {
        const { records, total } = response.data;
        setDataSource(records);
        setQuery({
          ...query,
          ...params,
          total,
        });
      } else {
        setDataSource([]);
        setQuery({
          ...query,
          ...params,
          total: 0,
        });
      }
    } catch (error) {
      setDataSource([]);
      setQuery({
        ...query,
        ...params,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: Partial<QueryPage<T>> = query) => {
    console.log('handleSearch', params);
    setQuery({
      ...params,
      pageNum: 1,
    });

    requestAnimationFrame(() => {
      fetchData({
        ...params,
        pageNum: 1,
      }).catch(error => {
        console.error('handleSearch error', error);
      });
    });
  };

  const handleReset = () => {
    setQuery({
      pageNum: 1,
      pageSize: 10,
    } as QueryPage<T>);

    requestAnimationFrame(() => {
      fetchData({
        pageNum: 1,
        pageSize: 10,
      } as QueryPage<T>);
    });
  };

  const handlePageChange = (currentPage: number, pageSize?: number) => {
    setQuery({
      ...query,
      pageNum: currentPage,
      pageSize: pageSize || query.pageSize,
    });

    requestAnimationFrame(() => {
      fetchData({
        ...query,
        pageNum: currentPage,
        pageSize: pageSize || query.pageSize,
      });
    });
  };

  const startTableTransition = async (fn: () => Promise<void>) => {
    setLoading(true);

    try {
      await fn();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    dataSource,
    query,
    setQuery,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  };
};

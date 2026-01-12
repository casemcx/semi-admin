import useUrlState from '@ahooksjs/use-url-state';
import {
  type QueryPage,
  type QueryPageResult,
  ResultCode,
  type ResultData,
} from '@packages/share';
import { type Key, useCallback, useMemo, useRef, useState } from 'react';

import type { ProTableProps } from '@packages/components';

import type { Entity } from './types';

import type { RowSelectionProps } from '@douyinfe/semi-ui/lib/es/table';
import { useLoading } from '../useLoading';

const defaultQuery: QueryPage = {
  pageNum: 1,
  pageSize: 10,
  total: 0,
};

export const useProTable = <T extends Entity, R extends Entity = T>(
  request: (query: QueryPage<T>) => Promise<ResultData<QueryPageResult<R>>>,
) => {
  const [loading, startLoading] = useLoading(false);
  const [dataSource, setDataSource] = useState<R[]>([]);

  const [total, setTotal] = useState(0);

  const [query, setQuery] = useUrlState<QueryPage<T>>(
    defaultQuery as QueryPage<T>,
  );

  const queryRef = useRef(query);

  const reload = useCallback(
    (params: Partial<QueryPage<T>> = {}) =>
      startLoading(async () => {
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

  const onSearch = useCallback(
    (params: Partial<R> = {}) => {
      const nextParams = {
        ...queryRef.current,
        ...params,
        pageNum: 1,
      };

      setQuery(prev => ({
        ...prev,
        ...nextParams,
      }));

      queryRef.current = nextParams;

      reload(nextParams);
    },
    [reload, setQuery],
  );

  const onReset = useCallback(() => {
    const q = defaultQuery as QueryPage<T>;
    setQuery(q);
    queryRef.current = q;
    reload(q);
  }, [setQuery, reload]);

  const onPageChange = useCallback(
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

      queryRef.current = nextParams;

      reload(nextParams);
    },
    [setQuery, reload],
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );

  const rowSelection: RowSelectionProps<T> = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: selectedKeys => {
        setSelectedRowKeys((selectedKeys || []) as (string | number)[]);
      },
    };
  }, [selectedRowKeys]);

  const tableProps = useMemo<Partial<ProTableProps<R>>>(() => {
    return {
      dataSource,
      onSearch,
      onReset,
      loading,
      pagination: {
        onPageChange,
        total,
        pageSize: query.pageSize,
        currentPage: query.pageNum,
        pageSizeOpts: [10, 20, 50, 100],
        showSizeChanger: true,
        showQuickJumper: true,
      },
      rowSelection,
    };
  }, [
    dataSource,
    onSearch,
    onReset,
    loading,
    onPageChange,
    total,
    query,
    rowSelection,
  ]);

  return {
    onReset,
    reload,
    onSearch,
    onPageChange,
    tableProps,
  };
};

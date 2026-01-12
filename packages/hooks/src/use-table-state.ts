import useUrlState from '@ahooksjs/use-url-state';
import type { RowSelectionProps } from '@douyinfe/semi-ui/lib/es/table';
import type { QueryPage, QueryPageResult, ResultData } from '@packages/share';
import { ResultCode } from '@packages/share';
import { useCallback, useMemo, useRef, useState } from 'react';

// Re-export from use-table-query
export type { TablePagination } from './use-table-query';

type UseRowSelectionOptions<
  T extends Record<string, any> = Record<string, any>,
  Key extends string | number = string,
> = {
  defaultKeys?: Key[];
  onChange?: (selectedKeys: Key[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[]) => void;
} & Omit<RowSelectionProps<T>, 'selectedRowKeys' | 'onChange'>;

export interface UseTableStateOptions<
  T extends Record<string, any> = Record<string, any>,
  Key extends string | number = string,
> {
  rowSelection?: boolean | UseRowSelectionOptions<T, Key>;
}

export const useTableState = <
  T extends Record<string, any> = Record<string, any>,
  R extends Record<string, any> = T,
  Key extends string | number = string,
>(
  request: (query: QueryPage<T>) => Promise<ResultData<QueryPageResult<R>>>,
  options?: UseTableStateOptions<R, Key>,
) => {
  const { rowSelection: rowSelectionOptions } = options ?? {};

  // 处理 rowSelection: true 转换为空对象，false 或 undefined 转换为 undefined
  const rowSelectionOpts: UseRowSelectionOptions<R, Key> | undefined =
    rowSelectionOptions === true
      ? {}
      : rowSelectionOptions === false
        ? undefined
        : rowSelectionOptions;

  // 查询状态
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<R[]>([]);
  const [total, setTotal] = useState(0);

  const [query, setQuery] = useUrlState<QueryPage<T>>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  } as QueryPage<T>);

  const queryRef = useRef(query);

  // 行选择状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(
    rowSelectionOpts?.defaultKeys ?? [],
  );

  const rowSelection: RowSelectionProps<R> | undefined = useMemo(() => {
    if (!rowSelectionOpts) return undefined;

    const {
      defaultKeys,
      onChange: onChangeProp,
      onSelectAll,
      ...restProps
    } = rowSelectionOpts;

    return {
      ...restProps,
      selectedRowKeys,
      onChange: (selectedKeys, selectedRows) => {
        onChangeProp?.(selectedKeys as Key[]);
        setSelectedRowKeys(selectedKeys as Key[]);
      },
      onSelectAll: (selected, selectedRows) => {
        onSelectAll?.(selected, selectedRows);
        // 默认全选行为：自动更新 selectedRowKeys
        if (selected && selectedRows) {
          const allKeys = selectedRows.map(item => item.id as Key);
          setSelectedRowKeys(allKeys);
        } else {
          setSelectedRowKeys([]);
        }
      },
    };
  }, [rowSelectionOpts, selectedRowKeys]);

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
    // 查询状态
    loading,
    dataSource,
    query,
    total,
    setQuery,

    // 行选择状态
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection,

    // 操作方法
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  };
};

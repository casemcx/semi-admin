import useUrlState from '@ahooksjs/use-url-state';
import {
  type QueryPage,
  type QueryPageResult,
  ResultCode,
  type ResultData,
} from '@packages/share';
import { type Key, useCallback, useMemo, useRef, useState } from 'react';

import type { ProTableProps } from '@packages/components';

import type { Entity, TableStateOptions } from './types';

import type { RowSelectionProps } from '@douyinfe/semi-ui/lib/es/table';
import { isEqual, merge } from 'lodash-es';
import { useLoading } from '../useLoading';

/** 默认分页查询参数 */
const defaultQuery: QueryPage = {
  pageNum: 1,
  pageSize: 10,
  total: 0,
};

/**
 * ProTable 表格状态管理 Hook
 *
 * 提供完整的表格状态管理能力，包括：
 * - 数据请求与加载状态管理
 * - URL 同步的分页查询参数
 * - 搜索、重置、分页切换功能
 * - 行选择状态管理
 *
 * @template T - 表格数据实体类型，需继承 Entity
 * @param options - 配置选项
 * @param options.request - 数据请求函数，接收查询参数返回分页数据
 * @param options.props - 其他 ProTable 组件属性，会与内部状态合并
 *
 * @returns 返回表格操作方法和合并后的 tableProps
 *
 * @example
 * ```tsx
 * const { tableProps, reload, onSearch, onReset } = useProTable({
 *   request: (params) => fetchUserList(params),
 *   columns: [...],
 * });
 *
 * return <ProTable {...tableProps} />;
 * ```
 */
export const useProTable = <T extends Entity>({
  request,
  ...props
}: TableStateOptions<T>) => {
  /** 加载状态管理 */
  const [loading, startLoading] = useLoading(false);
  /** 表格数据源 */
  const [dataSource, setDataSource] = useState<T[]>([]);
  /** 数据总数 */
  const [total, setTotal] = useState(0);

  /**
   * 分页查询参数，同步到 URL
   * 使用 useUrlState 实现 URL 与状态的双向绑定
   */
  const [query, setQuery] = useUrlState<QueryPage<T>>(
    defaultQuery as QueryPage<T>,
  );

  /** 查询参数引用，用于在回调中获取最新值 */
  const queryRef = useRef(query);

  /**
   * 重新加载数据
   * @param params - 可选的额外查询参数，会与现有参数合并
   */
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

  /**
   * 搜索回调
   * 合并搜索参数并重置到第一页，触发数据加载
   * @param params - 搜索参数
   */
  const onSearch = useCallback(
    (params: Partial<T> = {}) => {
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

  /**
   * 重置回调
   * 清空所有查询参数，恢复到默认分页状态
   */
  const onReset = useCallback(() => {
    const q = defaultQuery as QueryPage<T>;
    setQuery(q);
    queryRef.current = q;
    reload(q);
  }, [setQuery, reload]);

  /**
   * 分页切换回调
   * @param currentPage - 目标页码
   * @param pageSize - 每页条数（可选）
   */
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

  /** 行选择状态 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );

  /**
   * 稳定化 props 引用
   *
   * 使用 useRef + isEqual 深度比较来稳定 props 引用：
   * - 当 props 内容未变化时（仅引用变化），保持 stableProps 引用不变
   * - 当 props 内容真正变化时，更新 stableProps 引用
   *
   * 这样可以避免父组件每次渲染都导致 tableProps 重新计算
   */
  const propsRef = useRef(props);
  if (!isEqual(propsRef.current, props)) {
    propsRef.current = props;
  }
  const stableProps = propsRef.current;

  /** 行选择配置 */
  const rowSelection: RowSelectionProps<T> = useMemo(() => {
    return {
      selectedRowKeys,
      onChange: selectedKeys => {
        setSelectedRowKeys((selectedKeys || []) as (string | number)[]);
      },
    };
  }, [selectedRowKeys]);

  /**
   * 合并后的表格属性
   * 将用户传入的 props 与内部状态合并，直接传给 ProTable 使用
   */
  const tableProps = useMemo<Partial<ProTableProps<T>>>(() => {
    return merge(stableProps, {
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
    });
  }, [
    dataSource,
    onSearch,
    onReset,
    loading,
    onPageChange,
    total,
    query,
    rowSelection,
    stableProps,
  ]);

  return {
    onReset,
    reload,
    onSearch,
    onPageChange,
    tableProps,
  };
};

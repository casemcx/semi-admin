import type { ProTableSchema } from '@packages/components';
import { omit } from 'lodash-es';
import { useMemo } from 'react';

export const useTableColumns = <V extends Record<string, any>>(
  columns: ProTableSchema<V>[],
) => {
  const searchColumns = useMemo<ProTableSchema<V>[]>(() => {
    return columns
      .filter(column => column.key !== 'actions')
      .filter(col => {
        return !col.hiddenInSearch;
      })
      .map(col => {
        const cl = omit(col, ['rules']) as ProTableSchema<V>;
        cl.colProps = {
          // 响应式span设置：xs(手机)=24, sm(平板)=12, md(小屏)=8, lg(大屏)=6, xl(2K)=6
          xs: 24, // 手机：1列
          sm: 12, // 平板：2列
          md: 8, // 小屏：3列
          lg: 6, // 大屏：4列
          xl: 6, // 2K及以上：4列
          span: 6, // 默认fallback
        };
        return cl;
      });
  }, [columns]);

  const createColumns = useMemo(() => {
    return columns
      .filter(column => column.key !== 'actions')
      .filter(col => {
        return !col.hiddenInCreate;
      });
  }, [columns]);

  const editColumns = useMemo(() => {
    return columns
      .filter(column => column.key !== 'actions')
      .filter(col => {
        return !col.hiddenInEdit;
      });
  }, [columns]);

  const tableColumns = useMemo(() => {
    return columns.filter(col => {
      return !col.hiddenInTable;
    });
  }, [columns]);

  const detailColumns = useMemo(() => {
    return columns
      .filter(column => column.key !== 'actions')
      .filter(col => {
        return !col.hiddenInDetail;
      })
      .map(col => {
        return {
          ...col,
          readonly: true,
        };
      });
  }, [columns]);

  return {
    searchColumns,
    createColumns,
    editColumns,
    tableColumns,
    detailColumns,
  };
};

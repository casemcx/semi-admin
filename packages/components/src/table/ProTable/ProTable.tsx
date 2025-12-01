import { Card, Space, Table } from '@douyinfe/semi-ui';
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  memo,
  useMemo,
} from 'react';

import { ProForm, ReadonlyField } from '@/form';
import { useTableColumns } from '@/hooks';
import type { ProTableSchema } from '@/types';
import { isIntelligentRenderType } from './utils';

export interface ProTableProps<T extends Record<string, any> = any>
  extends Omit<
    ComponentPropsWithoutRef<typeof Table>,
    'columns' | 'dataSource'
  > {
  /**
   * @description 表格标题
   */
  title?: string;

  /**
   * @description 表格列配置
   */
  columns: ProTableSchema<T>[];

  /**
   * @description 表格数据
   */
  dataSource: T[];

  /**
   * @description 是否显示搜索表单
   * @default true
   */
  showSearch?: boolean;

  /**
   * @description 搜索表单的栅格配置
   * @default 响应式配置：xs=24, sm=12, md=8, lg=6, xl=6
   */
  searchColProps?: {
    span?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
  };

  /**
   * @description 搜索表单的间距
   * @default 16
   */
  searchGutter?: number | [number, number];

  /**
   * @description 搜索表单的操作按钮对齐方式
   * @default "end"
   */
  searchActionsAlign?: 'start' | 'center' | 'end';

  /**
   * @description 搜索按钮文本
   * @default "搜索"
   */
  searchText?: string;

  /**
   * @description 重置按钮文本
   * @default "重置"
   */
  resetText?: string;

  /**
   * @description 搜索表单初始值
   */
  searchInitialValues?: Partial<T>;

  /**
   * @description 表格工具栏
   */
  toolBar?: ReactNode;

  /**
   * @description 搜索表单提交
   */
  onSearch?: (values: Partial<T>) => void;

  /**
   * @description 搜索表单重置
   */
  onReset?: () => void;

  /**
   * @description 是否显示卡片包装
   * @default true
   */
  showCard?: boolean;

  /**
   * @description 表格加载状态
   */
  loading?: boolean;

  /**
   * @description 分页配置
   */
  pagination?: ComponentPropsWithoutRef<typeof Table>['pagination'];
}

const ProTable = <T extends Record<string, any> = any>({
  title,
  columns,
  dataSource,
  searchColProps = {
    xs: 24, // 手机：1列
    sm: 12, // 平板：2列
    md: 8, // 小屏：3列
    lg: 6, // 大屏：4列
    xl: 6, // 2K及以上：4列
    span: 6, // 默认fallback
  },
  searchGutter = 16,
  searchActionsAlign = 'end',
  searchText = '搜索',
  resetText = '重置',
  searchInitialValues,
  toolBar,
  onSearch,
  onReset,
  showCard = true,
  loading = false,
  pagination,
  ...tableProps
}: ProTableProps<T>) => {
  const { searchColumns, tableColumns: baseTableColumns } =
    useTableColumns(columns);

  // 为表格列添加默认渲染逻辑
  const tableColumns = useMemo(() => {
    return baseTableColumns.map(col => {
      // 如果有自定义render函数，则使用自定义render

      if (col.render) {
        return {
          ...col,
          render: (_data: T[], record: T, index: number) => {
            return col.render?.(record[col.name as keyof T], record, index);
          },
        };
      }

      // 对于特定字段类型，使用ReadonlyField作为默认渲染
      if (isIntelligentRenderType(col.type)) {
        return {
          ...col,
          render: (_data: T[], record: T, index: number) => {
            return (
              <ReadonlyField
                column={col}
                index={index}
                value={record[col.name as keyof T]}
                record={record}
              />
            );
          },
        };
      }

      // 其他字段类型使用默认渲染
      return col;
    });
  }, [baseTableColumns]);

  const content = (
    <>
      <div className="pb-4">
        <ProForm
          columns={searchColumns}
          onSubmit={onSearch}
          onReset={onReset}
          submitButtonProps={{
            loading,
          }}
          resetButtonProps={{
            disabled: loading,
          }}
          initValues={searchInitialValues}
          submitText={searchText}
          resetText={resetText}
          gutter={searchGutter}
          colProps={searchColProps}
          actionsAlign={searchActionsAlign}
        />
      </div>
      <Space className="table-header pb-4">{toolBar}</Space>
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        {...tableProps}
      />
    </>
  );

  if (!showCard) {
    return content;
  }

  return <Card title={title}>{content}</Card>;
};

ProTable.displayName = 'ProTable';

export default memo(ProTable) as typeof ProTable;

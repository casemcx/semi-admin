import { beforeEach, describe, expect, it } from '@rstest/core';
import { act, renderHook } from '@testing-library/react';

import type { ProTableSchema } from '@/types';
import { useTableColumns } from '../use-table-columns';

describe('useTableColumns', () => {
  const baseColumns: ProTableSchema<any>[] = [
    {
      name: 'id',
      title: 'ID',
      key: 'id',
    },
    {
      name: 'name',
      title: '姓名',
      key: 'name',
    },
    {
      name: 'email',
      title: '邮箱',
      key: 'email',
      hiddenInSearch: true,
    },
    {
      name: 'status',
      title: '状态',
      key: 'status',
      hiddenInTable: true,
    },
    {
      name: 'createdAt',
      title: '创建时间',
      key: 'createdAt',
      hiddenInCreate: true,
    },
    {
      name: 'updatedAt',
      title: '更新时间',
      key: 'updatedAt',
      hiddenInEdit: true,
    },
    {
      name: 'description',
      title: '描述',
      key: 'description',
      hiddenInDetail: true,
    },
    {
      key: 'actions',
      name: 'actions',
      title: '操作',
    },
  ];

  it('should return searchColumns without hidden columns', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.searchColumns).toHaveLength(6);
    expect(
      result.current.searchColumns.every(col => col.key !== 'actions'),
    ).toBe(true);
    expect(
      result.current.searchColumns.every(col => col.name !== 'email'),
    ).toBe(true);
  });

  it('should add responsive colProps to searchColumns', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    result.current.searchColumns.forEach(col => {
      expect(col.colProps).toEqual({
        xs: 24,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 6,
        span: 6,
      });
    });
  });

  it('should remove rules from searchColumns', () => {
    const columnsWithRules: ProTableSchema<any>[] = [
      {
        name: 'test',
        title: 'Test',
        key: 'test',
        rules: [{ required: true, message: 'Required' }],
      },
    ];

    const { result } = renderHook(() => useTableColumns(columnsWithRules));

    expect(result.current.searchColumns[0].rules).toBeUndefined();
  });

  it('should return createColumns without hidden columns', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.createColumns).toHaveLength(6);
    expect(
      result.current.createColumns.every(col => col.key !== 'actions'),
    ).toBe(true);
    expect(
      result.current.createColumns.every(col => col.name !== 'createdAt'),
    ).toBe(true);
  });

  it('should return editColumns without hidden columns', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.editColumns).toHaveLength(6);
    expect(result.current.editColumns.every(col => col.key !== 'actions')).toBe(
      true,
    );
    expect(
      result.current.editColumns.every(col => col.name !== 'updatedAt'),
    ).toBe(true);
  });

  it('should return tableColumns without hidden columns', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.tableColumns).toHaveLength(7);
    expect(
      result.current.tableColumns.every(col => col.name !== 'status'),
    ).toBe(true);
  });

  it('should return tableColumns including actions', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.tableColumns.some(col => col.key === 'actions')).toBe(
      true,
    );
  });

  it('should return detailColumns without hidden columns and with readonly', () => {
    const { result } = renderHook(() => useTableColumns(baseColumns));

    expect(result.current.detailColumns).toHaveLength(6);
    expect(
      result.current.detailColumns.every(col => col.key !== 'actions'),
    ).toBe(true);
    expect(
      result.current.detailColumns.every(col => col.name !== 'description'),
    ).toBe(true);
    expect(
      result.current.detailColumns.every(col => col.readonly === true),
    ).toBe(true);
  });

  it('should handle empty columns', () => {
    const { result } = renderHook(() => useTableColumns([]));

    expect(result.current.searchColumns).toHaveLength(0);
    expect(result.current.createColumns).toHaveLength(0);
    expect(result.current.editColumns).toHaveLength(0);
    expect(result.current.tableColumns).toHaveLength(0);
    expect(result.current.detailColumns).toHaveLength(0);
  });
});

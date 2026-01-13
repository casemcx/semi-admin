import { beforeEach, describe, expect, it, rstest } from '@rstest/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';

import type { ProTableSchema } from '@packages/components';
import { ResultCode } from '@packages/share';
import type { QueryPageResult, ResultData } from '@packages/share';

import { useProTable } from '../index';
import type { Entity } from '../types';

/**
 * 测试用的 Router Wrapper
 * useUrlState 依赖 react-router 的 useLocation
 */
const wrapper = ({ children }: PropsWithChildren) => (
  <MemoryRouter>{children}</MemoryRouter>
);

interface TestEntity extends Entity {
  id: number;
  name: string;
}

/** 测试用的 mock 数据 */
const mockRecords: TestEntity[] = [
  { id: 1, name: 'Test 1' },
  { id: 2, name: 'Test 2' },
];

/** 测试用的默认 columns 配置 */
const mockColumns: ProTableSchema<TestEntity>[] = [
  { name: 'id', title: 'ID' },
  { name: 'name', title: '姓名' },
];

/** 测试用的默认 dataSource */
const mockDataSource: TestEntity[] = [];

/**
 * 创建成功响应的 mock 数据
 */
const createMockResponse = (
  records: TestEntity[] = mockRecords,
  total = 2,
): ResultData<QueryPageResult<TestEntity>> => ({
  code: ResultCode.SUCCESS,
  msg: 'success',
  message: 'success',
  data: {
    records,
    total,
    size: 10,
    current: 1,
    pages: Math.ceil(total / 10),
  },
});

/**
 * 创建错误响应的 mock 数据
 */
const createErrorResponse = (): ResultData<QueryPageResult<TestEntity>> => ({
  code: 500,
  msg: 'error',
  message: 'error',
  data: {
    records: [],
    total: 0,
    size: 10,
    current: 1,
    pages: 0,
  },
});

/**
 * 创建 useProTable 的默认配置
 */
const createDefaultOptions = (mockRequest: ReturnType<typeof rstest.fn>) => ({
  request: mockRequest,
  columns: mockColumns,
  dataSource: mockDataSource,
});

describe('useProTable', () => {
  let mockRequest: ReturnType<typeof rstest.fn>;

  beforeEach(() => {
    mockRequest = rstest.fn();
    rstest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该返回正确的初始状态', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      expect(result.current.tableProps).toBeDefined();
      expect(result.current.reload).toBeDefined();
      expect(result.current.onSearch).toBeDefined();
      expect(result.current.onReset).toBeDefined();
      expect(result.current.onPageChange).toBeDefined();
    });

    it('初始 tableProps 应该包含正确的默认分页配置', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      const pagination = result.current.tableProps.pagination;
      expect(pagination).toBeTruthy();
      if (pagination && typeof pagination === 'object') {
        expect(pagination.pageSize).toBe(10);
        expect(pagination.currentPage).toBe(1);
        expect(pagination.pageSizeOpts).toEqual([10, 20, 50, 100]);
        expect(pagination.showSizeChanger).toBe(true);
        expect(pagination.showQuickJumper).toBe(true);
      }
    });

    it('初始 dataSource 应该为空数组', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      expect(result.current.tableProps.dataSource).toEqual([]);
    });
  });

  describe('reload', () => {
    it('reload 应该调用 request 并更新数据', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        await result.current.reload();
      });

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(result.current.tableProps.dataSource).toEqual(mockRecords);

      const pagination = result.current.tableProps.pagination;
      if (pagination && typeof pagination === 'object') {
        expect(pagination.total).toBe(2);
      }
    });

    it('reload 应该在加载时设置 loading 为 true', async () => {
      let resolveRequest: (value: unknown) => void;
      mockRequest.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveRequest = resolve;
          }),
      );

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      // 开始加载
      act(() => {
        result.current.reload();
      });

      // 加载中
      expect(result.current.tableProps.loading).toBe(true);

      // 完成加载
      await act(async () => {
        resolveRequest!(createMockResponse());
      });

      expect(result.current.tableProps.loading).toBe(false);
    });

    it('reload 请求失败时应该清空数据', async () => {
      const failingRequest = rstest
        .fn()
        .mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(
        () =>
          useProTable<TestEntity>({
            request: failingRequest,
            columns: [...mockColumns],
            dataSource: [],
          }),
        { wrapper },
      );

      await act(async () => {
        try {
          await result.current.reload();
        } catch {
          // 忽略错误
        }
      });

      expect(result.current.tableProps.dataSource).toEqual([]);
    });

    it('reload 响应码非成功时应该清空数据', async () => {
      const errorRequest = rstest.fn().mockResolvedValue(createErrorResponse());

      const { result } = renderHook(
        () =>
          useProTable<TestEntity>({
            request: errorRequest,
            columns: [...mockColumns],
            dataSource: [],
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.reload();
      });

      expect(result.current.tableProps.dataSource).toEqual([]);

      const pagination = result.current.tableProps.pagination;
      if (pagination && typeof pagination === 'object') {
        expect(pagination.total).toBe(0);
      }
    });

    it('reload 应该可以传入额外参数', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        await result.current.reload({ pageNum: 2, pageSize: 20 });
      });

      expect(mockRequest).toHaveBeenCalledWith({ pageNum: 2, pageSize: 20 });
    });
  });

  describe('onSearch', () => {
    it('onSearch 应该重置到第一页并触发请求', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        result.current.onSearch({ name: 'test' });
      });

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });

      // 验证搜索参数包含 pageNum: 1
      const calls = mockRequest.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toMatchObject({ pageNum: 1 });
    });

    it('onSearch 空参数时也应该触发请求', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        result.current.onSearch();
      });

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });
    });
  });

  describe('onReset', () => {
    it('onReset 应该重置查询参数并触发请求', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      // 先搜索
      await act(async () => {
        result.current.onSearch({ name: 'test' });
      });

      // 再重置
      await act(async () => {
        result.current.onReset();
      });

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });

      // 验证重置后的分页参数
      // 注意：useUrlState 返回的是字符串类型
      const pagination = result.current.tableProps.pagination;
      if (pagination && typeof pagination === 'object') {
        expect(Number(pagination.currentPage)).toBe(1);
        expect(Number(pagination.pageSize)).toBe(10);
      }
    });
  });

  describe('onPageChange', () => {
    it('onPageChange 应该更新页码并触发请求', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        result.current.onPageChange(2);
      });

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });

      const calls = mockRequest.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toMatchObject({ pageNum: 2 });
    });

    it('onPageChange 应该支持同时修改 pageSize', async () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        result.current.onPageChange(1, 20);
      });

      await waitFor(() => {
        expect(mockRequest).toHaveBeenCalled();
      });

      const calls = mockRequest.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toMatchObject({ pageNum: 1, pageSize: 20 });
    });
  });

  describe('rowSelection', () => {
    it('tableProps 应该包含 rowSelection 配置', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      const rowSelection = result.current.tableProps.rowSelection;
      expect(rowSelection).toBeDefined();
      if (rowSelection && typeof rowSelection === 'object') {
        expect(rowSelection.selectedRowKeys).toEqual([]);
      }
    });

    it('rowSelection onChange 应该更新 selectedRowKeys', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      act(() => {
        const rowSelection = result.current.tableProps.rowSelection;
        if (
          rowSelection &&
          typeof rowSelection === 'object' &&
          rowSelection.onChange
        ) {
          rowSelection.onChange([1, 2], []);
        }
      });

      const rowSelection = result.current.tableProps.rowSelection;
      if (rowSelection && typeof rowSelection === 'object') {
        expect(rowSelection.selectedRowKeys).toEqual([1, 2]);
      }
    });

    it('rowSelection onChange 传入空值时应该设置为空数组', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      // 先选择一些
      act(() => {
        const rowSelection = result.current.tableProps.rowSelection;
        if (
          rowSelection &&
          typeof rowSelection === 'object' &&
          rowSelection.onChange
        ) {
          rowSelection.onChange([1, 2], []);
        }
      });

      // 再清空
      act(() => {
        const rowSelection = result.current.tableProps.rowSelection;
        if (
          rowSelection &&
          typeof rowSelection === 'object' &&
          rowSelection.onChange
        ) {
          rowSelection.onChange(
            undefined as unknown as (string | number)[],
            [],
          );
        }
      });

      const rowSelection = result.current.tableProps.rowSelection;
      if (rowSelection && typeof rowSelection === 'object') {
        expect(rowSelection.selectedRowKeys).toEqual([]);
      }
    });
  });

  describe('props 合并', () => {
    it('应该将传入的 props 与内部状态合并', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const customColumns: ProTableSchema<TestEntity>[] = [
        { name: 'id', title: 'ID' },
      ];

      const { result } = renderHook(
        () =>
          useProTable<TestEntity>({
            request: mockRequest,
            columns: customColumns,
            dataSource: mockDataSource,
          }),
        { wrapper },
      );

      expect(result.current.tableProps.columns).toEqual(customColumns);
    });

    it('props 内容不变时 tableProps 应该正常工作', () => {
      mockRequest.mockResolvedValue(createMockResponse());

      const staticProps = createDefaultOptions(mockRequest);

      const { result, rerender } = renderHook(
        () => useProTable<TestEntity>(staticProps),
        { wrapper },
      );

      // 重新渲染但 props 内容不变
      rerender();

      // tableProps 应该正常存在
      expect(result.current.tableProps).toBeDefined();
      expect(result.current.tableProps.columns).toEqual(mockColumns);
    });
  });

  describe('边界情况', () => {
    it('空数据响应应该正确处理', async () => {
      const emptyRequest = rstest
        .fn()
        .mockResolvedValue(createMockResponse([], 0));

      const { result } = renderHook(
        () =>
          useProTable<TestEntity>({
            request: emptyRequest,
            columns: [...mockColumns],
            dataSource: [],
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.reload();
      });

      expect(result.current.tableProps.dataSource).toEqual([]);

      const pagination = result.current.tableProps.pagination;
      if (pagination && typeof pagination === 'object') {
        expect(pagination.total).toBe(0);
      }
    });

    it('大数据量应该正确处理', async () => {
      const largeRecords = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }));

      mockRequest.mockResolvedValue(createMockResponse(largeRecords, 1000));

      const { result } = renderHook(
        () => useProTable<TestEntity>(createDefaultOptions(mockRequest)),
        { wrapper },
      );

      await act(async () => {
        await result.current.reload();
      });

      expect(result.current.tableProps.dataSource).toHaveLength(1000);

      const pagination = result.current.tableProps.pagination;
      if (pagination && typeof pagination === 'object') {
        expect(pagination.total).toBe(1000);
      }
    });
  });
});

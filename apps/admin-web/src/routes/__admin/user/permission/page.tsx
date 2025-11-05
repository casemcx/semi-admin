'use client';

import {
  createPermission,
  deletePermission,
  getPermissionPage,
  updatePermission,
} from '@/api';
import type { Permission } from '@/types/user';
import { PermissionType } from '@/types/user/permission';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Toast,
  Typography,
} from '@douyinfe/semi-ui';
import { ModalForm, ProTable, useTableColumns } from '@packages/components';
import type { ProTableProps } from '@packages/components';
import { useTableFormState, useTableQuery } from '@packages/hooks';
import { ResultCode, Status } from '@packages/share';
import { useCallback } from 'react';

const { Title } = Typography;

export default function UserPermissionPage() {
  const {
    loading,
    dataSource,
    query,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  } = useTableQuery<Permission>(getPermissionPage);

  useMount(fetchData);

  const {
    isEdit,
    modalVisible,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalCancel,
  } = useTableFormState<Permission>(
    {},
    {
      onSubmit: async (values: Permission, isEdit: boolean) => {
        if (isEdit) {
          const result = await updatePermission(values.id, values);
          console.log(result, 'result');
          if (result.code !== ResultCode.SUCCESS) {
            Toast.error(result.msg);
            return Promise.reject(result.msg);
          }
          Toast.success('更新成功');
          fetchData();
          return Promise.resolve();
        }

        const result = await createPermission(values);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
          return Promise.reject(result.msg);
        }
        Toast.success('新增成功');
        fetchData();
        return Promise.resolve();
      },
    },
  );

  const handleDelete = useCallback(
    (id: string) => {
      startTableTransition(async () => {
        const result = await deletePermission(id);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
        } else {
          Toast.success('删除成功');
          fetchData();
        }
      });
    },
    [startTableTransition, fetchData],
  );

  ///  表单
  // 表格列定义
  const columns: ProTableProps<Permission>['columns'] = [
    {
      name: 'name',
      title: '权限名称',
      ellipsis: true,
      type: 'input',
      colProps: {
        span: 12,
      },
      width: 200,
      render: (...args: any[]) => {
        // const renderIcon = () => {
        //   if (record.icon) {
        //     return <span style={{ marginRight: 8 }}>{record.icon}</span>;
        //   }
        //   return null;
        // };

        console.log(args, 'value, record');
        return <span>-</span>;
      },
    },
    {
      name: 'code',
      title: '权限编码',
      width: 180,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'type',
      title: '权限类型',
      type: 'select',
      colProps: {
        span: 12,
      },
      fieldProps: {
        optionList: [
          { label: '菜单', value: PermissionType.MENU },
          { label: '按钮', value: PermissionType.BUTTON },
          { label: '接口', value: PermissionType.API },
        ],
      },
      width: 120,
      render: (value: any) => {
        const typeMap = {
          [PermissionType.MENU]: { text: '菜单', color: 'blue' },
          [PermissionType.BUTTON]: { text: '按钮', color: 'green' },
          [PermissionType.API]: { text: '接口', color: 'orange' },
        };
        const config = typeMap[value as PermissionType];
        return <span style={{ color: config?.color }}>{config?.text}</span>;
      },
    },
    {
      name: 'path',
      title: '路径/API',
      width: 250,
      render: (_: any, record: Permission) => {
        if (record.type === PermissionType.API) {
          return (
            <span>
              {record.method && (
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                  {record.method}
                </span>
              )}
              {record.apiPath || '-'}
            </span>
          );
        }
        return record.path || '-';
      },
    },
    {
      name: 'sort',
      title: '排序',
      width: 80,
    },
    {
      name: 'status',
      title: '状态',
      width: 100,
      type: 'switch',
      colProps: {
        span: 12,
      },
      render: value => {
        return (value as Status) === Status.ENABLED ? (
          <span style={{ color: '#52c41a' }}>启用</span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>禁用</span>
        );
      },
    },
    {
      name: 'createdAt',
      title: '创建时间',
      width: 180,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
    {
      name: 'action',
      title: '操作',
      width: 150,
      fixed: 'right',
      hiddenInEdit: true,
      hiddenInSearch: true,
      hiddenInCreate: true,
      hiddenInTable: true,
      render: (_: any, record: Permission) => (
        <Space>
          <Button
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个权限吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              type="danger"
              icon={<IconDelete />}
              disabled={record.isSystem === Status.ENABLED}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { createColumns, editColumns } = useTableColumns(columns);

  useEffect(() => {
    console.log(dataSource, 'dataSource');
  }, [dataSource]);

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title heading={5}>权限管理</Title>
        </Col>
      </Row>

      <ProTable<Permission>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={record => record.id.toString()}
        onSearch={handleSearch}
        onReset={handleReset}
        pagination={{
          total: query.total,
          currentPage: query.pageNum,
          pageSize: query.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOpts: [10, 20, 50, 100],
          onPageChange: handlePageChange,
        }}
        toolBar={
          <div>
            <Button type="primary" onClick={handleAdd}>
              新增权限
            </Button>
          </div>
        }
        scroll={{ x: 1200 }}
        showCard={false}
      />

      <ModalForm
        title={isEdit ? '编辑权限' : '新增权限'}
        visible={modalVisible}
        onCancel={handleModalCancel}
        width={600}
        onSubmit={handleModalOk}
        columns={isEdit ? editColumns : createColumns}
        formProps={{
          labelPosition: 'top',
          style: { paddingTop: 16 },
        }}
      />
    </Card>
  );
}

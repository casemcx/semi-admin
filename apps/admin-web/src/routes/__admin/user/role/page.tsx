'use client';

import {
  createRole,
  deleteRoleBatch,
  deleteRoleById,
  getRolePage,
  updateRoleById,
} from '@/api';
import { useLocal } from '@/locales';
import type { Role } from '@/types/user';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Toast,
  Typography,
} from '@douyinfe/semi-ui';
import { ModalForm, ProTable, useTableColumns } from '@packages/components';
import type { ProTableProps } from '@packages/components';
import {
  useRowSelection,
  useTableFormState,
  useTableQuery,
} from '@packages/hooks';
import { useMount } from '@packages/hooks';
import { ResultCode, Status } from '@packages/share';
import { useCallback, useState } from 'react';

const { Title } = Typography;

export default function RoleManagePage() {
  const intl = useLocal();

  // 批量选择状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const {
    loading,
    dataSource,
    query,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  } = useTableQuery<Role>(getRolePage);

  useMount(() => {
    fetchData();
  });

  const {
    isEdit,
    modalVisible,
    formValues,
    handleAdd,
    handleEdit,
    handleModalOk,
    handleModalCancel,
  } = useTableFormState<Role>(
    {},
    {
      onSubmit: async (values: Role, isEdit: boolean) => {
        if (isEdit) {
          const result = await updateRoleById(values);
          if (result.code !== ResultCode.SUCCESS) {
            Toast.error(result.msg);
            return Promise.reject(result.msg);
          }
          Toast.success(intl.get('common.updateSuccess'));
          fetchData();
          return Promise.resolve();
        }

        const result = await createRole(values);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
          return Promise.reject(result.msg);
        }
        Toast.success(intl.get('common.createSuccess'));
        fetchData();
        return Promise.resolve();
      },
    },
  );

  const handleDelete = useCallback(
    (id: string) => {
      startTableTransition(async () => {
        const result = await deleteRoleById(id);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
        } else {
          Toast.success(intl.get('common.deleteSuccess'));
          fetchData();
          setSelectedRowKeys([]);
        }
      });
    },
    [startTableTransition, fetchData, intl],
  );

  // 批量删除处理函数
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      Toast.warning(intl.get('common.selectAtLeastOne'));
      return;
    }

    // 过滤掉系统角色
    const systemRoles = dataSource.filter(
      item =>
        selectedRowKeys.includes(item.id) && item.isSystem === Status.ENABLED,
    );

    if (systemRoles.length > 0) {
      Toast.error(intl.get('user.role.cannotDeleteSystem'));
      return;
    }

    Modal.confirm({
      title: intl.get('common.batchDeleteConfirm'),
      content: intl.get('common.batchDeleteContent', {
        count: selectedRowKeys.length,
      }),
      okText: intl.get('common.confirm'),
      cancelText: intl.get('common.cancel'),
      onOk: async () => {
        startTableTransition(async () => {
          const result = await deleteRoleBatch(selectedRowKeys);
          if (result.code !== ResultCode.SUCCESS) {
            Toast.error(result.msg);
          } else {
            Toast.success(intl.get('common.batchDeleteSuccess'));
            fetchData();
            setSelectedRowKeys([]);
          }
        });
      },
    });
  }, [selectedRowKeys, dataSource, startTableTransition, fetchData, intl]);

  const { rowSelection } = useRowSelection<Role, string>({
    defaultKeys: selectedRowKeys,
    onSelectAll: (selected, selectedRows) => {
      if (selected && selectedRows) {
        const allIds = selectedRows.map(item => item.id.toString());
        setSelectedRowKeys(allIds);
      } else {
        setSelectedRowKeys([]);
      }
    },
  });

  // 表格列定义
  const columns: ProTableProps<Role>['columns'] = [
    {
      name: 'name',
      title: intl.get('user.role.name'),
      ellipsis: true,
      type: 'input',
      colProps: {
        span: 12,
      },
      width: 200,
      formProps: {
        rules: [
          {
            required: true,
            message: intl.get('user.role.name.required'),
          },
        ],
      },
    },
    {
      name: 'code',
      title: intl.get('user.role.code'),
      width: 180,
      type: 'input',
      colProps: {
        span: 12,
      },
      formProps: {
        rules: [
          {
            required: true,
            message: intl.get('user.role.code.required'),
          },
        ],
      },
    },
    {
      name: 'description',
      title: intl.get('user.role.description'),
      width: 250,
      type: 'textarea',
      colProps: {
        span: 24,
      },
      hiddenInTable: true,
      hiddenInSearch: true,
    },
    {
      name: 'sort',
      title: intl.get('user.role.sort'),
      width: 100,
      type: 'inputNumber',
      colProps: {
        span: 12,
      },
      fieldProps: {
        min: 0,
      },
    },
    {
      name: 'status',
      title: intl.get('user.role.status'),
      width: 120,
      type: 'switch',
      colProps: {
        span: 12,
      },
      render: value => {
        return (value as Status) === Status.ENABLED ? (
          <span style={{ color: '#52c41a' }}>
            {intl.get('user.role.status.enabled')}
          </span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>
            {intl.get('user.role.status.disabled')}
          </span>
        );
      },
    },
    {
      name: 'isSystem',
      title: intl.get('user.role.isSystem'),
      width: 120,
      hiddenInSearch: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: value => {
        return (value as Status) === Status.ENABLED ? (
          <span style={{ color: '#1890ff' }}>{intl.get('common.yes')}</span>
        ) : (
          <span>{intl.get('common.no')}</span>
        );
      },
    },
    {
      name: 'createdAt',
      title: intl.get('user.role.createdAt'),
      width: 180,
      hiddenInCreate: true,
      hiddenInEdit: true,
      hiddenInSearch: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
    {
      name: 'action',
      title: intl.get('user.role.action'),
      width: 150,
      fixed: 'right',
      hiddenInEdit: true,
      hiddenInSearch: true,
      hiddenInCreate: true,
      render: (_: any, record: Role) => (
        <Space>
          <Button
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            {intl.get('user.role.action.edit')}
          </Button>
          <Popconfirm
            title={intl.get('user.role.delete.confirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.get('user.role.delete.confirm.ok')}
            cancelText={intl.get('user.role.delete.confirm.cancel')}
          >
            <Button
              size="small"
              type="danger"
              icon={<IconDelete />}
              disabled={record.isSystem === Status.ENABLED}
            >
              {intl.get('user.role.action.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { createColumns, editColumns } = useTableColumns(columns);

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title heading={5}>{intl.get('user.role.title')}</Title>
        </Col>
      </Row>

      <ProTable<Role>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={record => record.id.toString()}
        rowSelection={rowSelection}
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
          <Space>
            <Button
              type="danger"
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              {intl.get('common.batchDelete')} ({selectedRowKeys.length})
            </Button>
            <Button type="primary" onClick={handleAdd}>
              {intl.get('user.role.action.add')}
            </Button>
          </Space>
        }
        scroll={{ x: 1200 }}
        showCard={false}
      />

      <ModalForm<Role>
        title={
          isEdit
            ? intl.get('user.role.form.title.edit')
            : intl.get('user.role.form.title.create')
        }
        initialValues={formValues}
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

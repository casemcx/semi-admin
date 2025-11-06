'use client';

import {
  createPermission,
  deletePermission,
  getPermissionPage,
  updatePermission,
} from '@/api';
import { useLocal } from '@/locales';
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
import { useCallback, useEffect } from 'react';

const { Title } = Typography;

export default function UserPermissionPage() {
  const intl = useLocal();

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          Toast.success(intl.get('common.updateSuccess'));
          fetchData();
          return Promise.resolve();
        }

        const result = await createPermission(values);
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
        const result = await deletePermission(id);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
        } else {
          Toast.success(intl.get('common.deleteSuccess'));
          fetchData();
        }
      });
    },
    [startTableTransition, fetchData, intl],
  );

  ///  表单
  // 表格列定义
  const columns: ProTableProps<Permission>['columns'] = [
    {
      name: 'name',
      title: intl.get('user.pemission.name'),
      ellipsis: true,
      type: 'input',
      colProps: {
        span: 12,
      },
      width: 200,
      render: (...args: any[]) => {
        console.log(args, 'value, record');
        return <span>-</span>;
      },
    },
    {
      name: 'code',
      title: intl.get('user.pemission.code'),
      width: 180,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'type',
      title: intl.get('user.pemission.type'),
      type: 'select',
      colProps: {
        span: 12,
      },
      fieldProps: {
        optionList: [
          {
            label: intl.get('user.pemission.type.menu'),
            value: PermissionType.MENU,
          },
          {
            label: intl.get('user.pemission.type.button'),
            value: PermissionType.BUTTON,
          },
          {
            label: intl.get('user.pemission.type.api'),
            value: PermissionType.API,
          },
        ],
      },
      width: 120,
      render: (value: any) => {
        const typeMap = {
          [PermissionType.MENU]: {
            text: intl.get('user.pemission.type.menu'),
            color: 'blue',
          },
          [PermissionType.BUTTON]: {
            text: intl.get('user.pemission.type.button'),
            color: 'green',
          },
          [PermissionType.API]: {
            text: intl.get('user.pemission.type.api'),
            color: 'orange',
          },
        };
        const config = typeMap[value as PermissionType];
        return <span style={{ color: config?.color }}>{config?.text}</span>;
      },
    },
    {
      name: 'path',
      title: intl.get('user.pemission.path'),
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
      title: intl.get('user.pemission.sort'),
      width: 80,
    },
    {
      name: 'status',
      title: intl.get('user.pemission.status'),
      width: 100,
      type: 'switch',
      colProps: {
        span: 12,
      },
      render: value => {
        return (value as Status) === Status.ENABLED ? (
          <span style={{ color: '#52c41a' }}>
            {intl.get('user.pemission.status.enabled')}
          </span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>
            {intl.get('user.pemission.status.disabled')}
          </span>
        );
      },
    },
    {
      name: 'createdAt',
      title: intl.get('user.pemission.createdAt'),
      width: 180,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
    {
      name: 'action',
      title: intl.get('user.pemission.action'),
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
            {intl.get('user.pemission.action.edit')}
          </Button>
          <Popconfirm
            title={intl.get('user.pemission.delete.confirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.get('user.pemission.delete.confirm.ok')}
            cancelText={intl.get('user.pemission.delete.confirm.cancel')}
          >
            <Button
              size="small"
              type="danger"
              icon={<IconDelete />}
              disabled={record.isSystem === Status.ENABLED}
            >
              {intl.get('user.pemission.action.delete')}
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
          <Title heading={5}>{intl.get('user.pemission.title')}</Title>
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
              {intl.get('user.pemission.action.add')}
            </Button>
          </div>
        }
        scroll={{ x: 1200 }}
        showCard={false}
      />

      <ModalForm
        title={
          isEdit
            ? intl.get('user.pemission.form.title.edit')
            : intl.get('user.pemission.form.title.create')
        }
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

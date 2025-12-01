'use client';

import {
  createUser,
  deleteUserBatch,
  deleteUserById,
  getUserPage,
  updateUserById,
  updateUserStatus,
} from '@/api';
import { useLocal } from '@/locales';
import type { User } from '@/types/user';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
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
import { ResultCode, Status } from '@packages/share';

const { Title } = Typography;

export default function UserListPage() {
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
  } = useTableQuery<User>(getUserPage);

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
  } = useTableFormState<User>(
    {},
    {
      onSubmit: async (values: any, isEdit: boolean) => {
        if (isEdit) {
          const result = await updateUserById(values);
          if (result.code !== ResultCode.SUCCESS) {
            Toast.error(result.msg);
            return Promise.reject(result.msg);
          }
          Toast.success(intl.get('common.updateSuccess'));
          fetchData();
          return Promise.resolve();
        }

        const result = await createUser(values);
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
        const result = await deleteUserById(id);
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

    Modal.confirm({
      title: intl.get('common.batchDeleteConfirm'),
      content: intl.get('common.batchDeleteContent', {
        count: selectedRowKeys.length,
      }),
      okText: intl.get('common.confirm'),
      cancelText: intl.get('common.cancel'),
      onOk: async () => {
        startTableTransition(async () => {
          const result = await deleteUserBatch(selectedRowKeys);
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
  }, [selectedRowKeys, startTableTransition, fetchData, intl]);

  const handleStatusChange = useCallback(
    async (id: string, checked: boolean) => {
      const status = checked ? Status.ENABLED : Status.DISABLED;
      startTableTransition(async () => {
        const result = await updateUserStatus(id, status);
        if (result.code !== ResultCode.SUCCESS) {
          Toast.error(result.msg);
        } else {
          Toast.success(intl.get('common.updateSuccess'));
          fetchData();
        }
      });
    },
    [startTableTransition, fetchData, intl],
  );

  const { rowSelection } = useRowSelection<User, string>({
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
  const columns: ProTableProps<User>['columns'] = [
    {
      name: 'username',
      title: intl.get('user.list.username'),
      ellipsis: true,
      type: 'input',
      colProps: {
        span: 12,
      },
      width: 150,
      formProps: {
        rules: [
          {
            required: true,
            message: intl.get('user.list.username.required'),
          },
        ],
      },
    },
    {
      name: 'nickname',
      title: intl.get('user.list.nickname'),
      width: 150,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'email',
      title: intl.get('user.list.email'),
      width: 200,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'phone',
      title: intl.get('user.list.phone'),
      width: 150,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'password',
      title: intl.get('user.list.password'),
      width: 150,
      type: 'input',
      colProps: {
        span: 12,
      },
      hiddenInTable: true,
      hiddenInSearch: true,
      hiddenInEdit: true,
      fieldProps: {
        type: 'password',
      },
      formProps: {
        rules: [
          {
            required: !isEdit,
            message: intl.get('user.list.password.required'),
          },
        ],
      },
    },
    {
      name: 'status',
      title: intl.get('user.list.status'),
      width: 100,
      hiddenInSearch: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (_: any, record: User) => (
        <Switch
          checked={record.status === Status.ENABLED}
          onChange={checked => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      name: 'lastLoginTime',
      title: intl.get('user.list.lastLoginTime'),
      width: 180,
      hiddenInSearch: true,
      hiddenInCreate: true,
      hiddenInEdit: true,
      render: (value: any) =>
        value ? new Date(value as Date).toLocaleString() : '-',
    },
    {
      name: 'createdAt',
      title: intl.get('user.list.createdAt'),
      width: 180,
      hiddenInCreate: true,
      hiddenInEdit: true,
      hiddenInSearch: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
    {
      name: 'action',
      title: intl.get('user.list.action'),
      width: 150,
      fixed: 'right',
      hiddenInEdit: true,
      hiddenInSearch: true,
      hiddenInCreate: true,
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            {intl.get('user.list.action.edit')}
          </Button>
          <Popconfirm
            title={intl.get('user.list.delete.confirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.get('user.list.delete.confirm.ok')}
            cancelText={intl.get('user.list.delete.confirm.cancel')}
          >
            <Button size="small" type="danger" icon={<IconDelete />}>
              {intl.get('user.list.action.delete')}
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
          <Title heading={5}>{intl.get('user.list.title')}</Title>
        </Col>
      </Row>

      <ProTable<User>
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
              {intl.get('user.list.action.add')}
            </Button>
          </Space>
        }
        scroll={{ x: 1400 }}
        showCard={false}
      />

      <ModalForm<User>
        title={
          isEdit
            ? intl.get('user.list.form.title.edit')
            : intl.get('user.list.form.title.create')
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

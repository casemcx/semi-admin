'use client';

import { assignRolesToUser, getAllEnabledRoles, getUserRolePage } from '@/api';
import { useLocal } from '@/locales';
import type { Role, UserRole } from '@/types/user';
import { IconDelete } from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Select,
  Space,
  Toast,
  Typography,
} from '@douyinfe/semi-ui';
import { ProTable } from '@packages/components';
import type { ProTableProps } from '@packages/components';
import { useTableQuery } from '@packages/hooks';
import { ResultCode } from '@packages/share';

const { Title } = Typography;

export default function UserRolePage() {
  const intl = useLocal();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  const {
    loading,
    dataSource,
    query,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  } = useTableQuery<UserRole>(getUserRolePage);

  useMount(() => {
    fetchData();
    loadAvailableRoles();
  });

  const loadAvailableRoles = async () => {
    const result = await getAllEnabledRoles();
    if (result.code === ResultCode.SUCCESS) {
      setAvailableRoles(result.data);
    }
  };

  const handleAssignRoles = () => {
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!selectedUserId || selectedRoleIds.length === 0) {
      Toast.warning(intl.get('user.userRole.selectUserAndRoles'));
      return;
    }

    startTableTransition(async () => {
      const result = await assignRolesToUser({
        userId: selectedUserId,
        roleIds: selectedRoleIds,
      });

      if (result.code !== ResultCode.SUCCESS) {
        Toast.error(result.msg);
      } else {
        Toast.success(intl.get('common.assignSuccess'));
        fetchData();
        setModalVisible(false);
        setSelectedUserId('');
        setSelectedRoleIds([]);
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedUserId('');
    setSelectedRoleIds([]);
  };

  // 表格列定义
  const columns: ProTableProps<UserRole>['columns'] = [
    {
      name: 'userId',
      title: intl.get('user.userRole.userId'),
      width: 200,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'roleId',
      title: intl.get('user.userRole.roleId'),
      width: 200,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'roleName',
      title: intl.get('user.userRole.roleName'),
      width: 150,
      hiddenInSearch: true,
      render: (_: any, record: UserRole) => record.role?.name || '-',
    },
    {
      name: 'roleCode',
      title: intl.get('user.userRole.roleCode'),
      width: 150,
      hiddenInSearch: true,
      render: (_: any, record: UserRole) => record.role?.code || '-',
    },
    {
      name: 'createdAt',
      title: intl.get('user.userRole.createdAt'),
      width: 180,
      hiddenInSearch: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title heading={5}>{intl.get('user.userRole.title')}</Title>
        </Col>
      </Row>

      <ProTable<UserRole>
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
          <Space>
            <Button type="primary" onClick={handleAssignRoles}>
              {intl.get('user.userRole.action.assign')}
            </Button>
          </Space>
        }
        scroll={{ x: 1000 }}
        showCard={false}
      />

      <Modal
        title={intl.get('user.userRole.modal.title')}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={intl.get('common.confirm')}
        cancelText={intl.get('common.cancel')}
      >
        <Space vertical style={{ width: '100%' }} spacing={16}>
          <div>
            <div style={{ marginBottom: 8 }}>
              {intl.get('user.userRole.selectUser')}
            </div>
            <Select
              placeholder={intl.get('user.userRole.selectUser.placeholder')}
              style={{ width: '100%' }}
              value={selectedUserId}
              onChange={value => setSelectedUserId(value as string)}
            />
          </div>

          <div>
            <div style={{ marginBottom: 8 }}>
              {intl.get('user.userRole.selectRoles')}
            </div>
            <Select
              multiple
              placeholder={intl.get('user.userRole.selectRoles.placeholder')}
              style={{ width: '100%' }}
              value={selectedRoleIds}
              onChange={value => setSelectedRoleIds(value as string[])}
              optionList={availableRoles.map(role => ({
                label: `${role.name} (${role.code})`,
                value: role.id,
              }))}
            />
          </div>
        </Space>
      </Modal>
    </Card>
  );
}

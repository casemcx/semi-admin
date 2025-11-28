'use client';

import {
  assignPermissionsToRole,
  getAllEnabledRoles,
  getPermissionTree,
  getRolePermissionPage,
  getRolePermissions,
} from '@/api';
import { useLocal } from '@/locales';
import type { Permission, Role, RolePermission } from '@/types/user';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Select,
  Space,
  Toast,
  Tree,
  Typography,
} from '@douyinfe/semi-ui';
import { ProTable } from '@packages/components';
import type { ProTableProps } from '@packages/components';
import { useTableQuery } from '@packages/hooks';
import { ResultCode } from '@packages/share';
import { useState } from 'react';

const { Title } = Typography;

export default function RolePermissionPage() {
  const intl = useLocal();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [permissionTree, setPermissionTree] = useState<Permission[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const {
    loading,
    dataSource,
    query,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    startTableTransition,
  } = useTableQuery<RolePermission>(getRolePermissionPage);

  useMount(() => {
    fetchData();
    loadAvailableRoles();
    loadPermissionTree();
  });

  const loadAvailableRoles = async () => {
    const result = await getAllEnabledRoles();
    if (result.code === ResultCode.SUCCESS) {
      setAvailableRoles(result.data);
    }
  };

  const loadPermissionTree = async () => {
    const result = await getPermissionTree();
    if (result.code === ResultCode.SUCCESS) {
      setPermissionTree(result.data);
    }
  };

  const handleAssignPermissions = () => {
    setModalVisible(true);
    setCheckedKeys([]);
  };

  const handleRoleChange = async (roleId: string) => {
    setSelectedRoleId(roleId);

    if (roleId) {
      const result = await getRolePermissions(roleId);
      if (result.code === ResultCode.SUCCESS) {
        const permissionIds = result.data.map(p => p.id);
        setCheckedKeys(permissionIds);
        setSelectedPermissionIds(permissionIds);
      }
    } else {
      setCheckedKeys([]);
      setSelectedPermissionIds([]);
    }
  };

  const handleTreeCheck = (value?: any) => {
    if (!value) {
      setCheckedKeys([]);
      setSelectedPermissionIds([]);
      return;
    }
    const keys = Array.isArray(value)
      ? value.map((v: any) => String(v))
      : [String(value)];
    setCheckedKeys(keys);
    setSelectedPermissionIds(keys);
  };

  const handleModalOk = async () => {
    if (!selectedRoleId) {
      Toast.warning(intl.get('user.rolePermission.selectRole'));
      return;
    }

    startTableTransition(async () => {
      const result = await assignPermissionsToRole({
        roleId: selectedRoleId,
        permissionIds: selectedPermissionIds,
      });

      if (result.code !== ResultCode.SUCCESS) {
        Toast.error(result.msg);
      } else {
        Toast.success(intl.get('common.assignSuccess'));
        fetchData();
        setModalVisible(false);
        setSelectedRoleId('');
        setSelectedPermissionIds([]);
        setCheckedKeys([]);
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedRoleId('');
    setSelectedPermissionIds([]);
    setCheckedKeys([]);
  };

  // 转换权限树为 Tree 组件所需的格式
  const convertToTreeData = (permissions: Permission[]): any[] => {
    return permissions.map(permission => ({
      key: permission.id,
      label: `${permission.name} (${permission.code})`,
      value: permission.id,
      children: permission.children
        ? convertToTreeData(permission.children)
        : undefined,
    }));
  };

  // 表格列定义
  const columns: ProTableProps<RolePermission>['columns'] = [
    {
      name: 'roleId',
      title: intl.get('user.rolePermission.roleId'),
      width: 200,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'permissionId',
      title: intl.get('user.rolePermission.permissionId'),
      width: 200,
      type: 'input',
      colProps: {
        span: 12,
      },
    },
    {
      name: 'roleName',
      title: intl.get('user.rolePermission.roleName'),
      width: 150,
      hiddenInSearch: true,
      render: (_: any, record: RolePermission) => record.role?.name || '-',
    },
    {
      name: 'permissionName',
      title: intl.get('user.rolePermission.permissionName'),
      width: 200,
      hiddenInSearch: true,
      render: (_: any, record: RolePermission) =>
        record.permission?.name || '-',
    },
    {
      name: 'permissionCode',
      title: intl.get('user.rolePermission.permissionCode'),
      width: 200,
      hiddenInSearch: true,
      render: (_: any, record: RolePermission) =>
        record.permission?.code || '-',
    },
    {
      name: 'createdAt',
      title: intl.get('user.rolePermission.createdAt'),
      width: 180,
      hiddenInSearch: true,
      render: (value: any) => new Date(value as Date).toLocaleString(),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title heading={5}>{intl.get('user.rolePermission.title')}</Title>
        </Col>
      </Row>

      <ProTable<RolePermission>
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
            <Button type="primary" onClick={handleAssignPermissions}>
              {intl.get('user.rolePermission.action.assign')}
            </Button>
          </Space>
        }
        scroll={{ x: 1200 }}
        showCard={false}
      />

      <Modal
        title={intl.get('user.rolePermission.modal.title')}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={intl.get('common.confirm')}
        cancelText={intl.get('common.cancel')}
        style={{ minWidth: 600 }}
      >
        <Space vertical style={{ width: '100%' }} spacing={16}>
          <div>
            <div style={{ marginBottom: 8 }}>
              {intl.get('user.rolePermission.selectRole')}
            </div>
            <Select
              placeholder={intl.get(
                'user.rolePermission.selectRole.placeholder',
              )}
              style={{ width: '100%' }}
              value={selectedRoleId}
              onChange={value => handleRoleChange(value as string)}
              optionList={availableRoles.map(role => ({
                label: `${role.name} (${role.code})`,
                value: role.id,
              }))}
            />
          </div>

          {selectedRoleId && (
            <div>
              <div style={{ marginBottom: 8 }}>
                {intl.get('user.rolePermission.selectPermissions')}
              </div>
              <div
                style={{
                  border: '1px solid var(--semi-color-border)',
                  borderRadius: 4,
                  padding: 12,
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                <Tree
                  treeData={convertToTreeData(permissionTree)}
                  multiple
                  value={checkedKeys}
                  onChange={handleTreeCheck}
                />
              </div>
            </div>
          )}
        </Space>
      </Modal>
    </Card>
  );
}

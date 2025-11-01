import {
  IconBell,
  IconExit,
  IconHelpCircle,
  IconSemiLogo,
} from '@douyinfe/semi-icons';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Modal,
  Nav,
} from '@douyinfe/semi-ui';
import type { OnSelectedData } from '@douyinfe/semi-ui/lib/es/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AuthGuard } from '@/components';
import { LanguageSwitch } from '@/components/locale';
import { useUserStore } from '@/stores/user';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutlet,
} from '@modern-js/runtime/router';
import styled from './index.module.less';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 使用用户状态管理
  const { userInfo, logout, isAuthenticated } = useUserStore();

  const handleNavSelect = (data: OnSelectedData) => {
    navigate(data.itemKey as string);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: t('common.logoutConfirm'),
      content: t('common.logoutConfirmMessage'),
      onOk: () => {
        // 使用store的logout方法
        logout();
        // 跳转到登录页
        navigate('/login');
      },
    });
  };

  const username = useMemo(() => {
    if (!isAuthenticated) return 'User';
    return userInfo?.nickName || userInfo?.username || 'User';
  }, [userInfo, isAuthenticated]);

  const avatarText = useMemo(() => {
    if (/[\u4e00-\u9fa5]/.test(username)) {
      return username.slice(-1);
    }
    return username.slice(0, 2).toUpperCase();
  }, [username]);

  return (
    <Layout className={styled.appLayout}>
      <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
            <Nav.Header>
              <IconSemiLogo style={{ height: '36px', fontSize: 36 }} />
              <h1>{t('menu.appName')}</h1>
            </Nav.Header>
            <Nav.Footer>
              <LanguageSwitch />
              <Button
                theme="borderless"
                icon={<IconBell size="large" />}
                style={{
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
              />
              <Button
                theme="borderless"
                icon={<IconHelpCircle size="large" />}
                style={{
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
              />
              <Dropdown
                trigger="click"
                position="bottomRight"
                menu={[
                  {
                    node: 'item',
                    name: t('common.profile'),
                    onClick: () => {
                      // 跳转到个人资料页面
                      navigate('/admin/profile');
                    },
                  },
                  {
                    node: 'divider',
                  },
                  {
                    node: 'item',
                    name: t('common.logout'),
                    onClick: handleLogout,
                    icon: <IconExit />,
                  },
                ]}
              >
                <div className="flex items-center cursor-pointer">
                  <Avatar
                    color="orange"
                    size="small"
                    style={{ marginRight: '8px' }}
                  >
                    {avatarText}
                  </Avatar>
                  <span
                    style={{
                      color: 'var(--semi-color-text-0)',
                      fontSize: '14px',
                    }}
                  >
                    {username}
                  </span>
                </div>
              </Dropdown>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Layout>
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            style={{ maxWidth: 220, height: '100%' }}
            footer={{
              collapseButton: true,
            }}
            selectedKeys={[location.pathname]}
            onSelect={handleNavSelect}
          />
        </Sider>
        <Content style={{ backgroundColor: 'var(--semi-color-bg-0)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

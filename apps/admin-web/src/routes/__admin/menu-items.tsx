import {
  IconList,
  IconLock,
  IconSetting,
  IconUser,
  IconUserGroup,
} from '@douyinfe/semi-icons';
import type { TFunction } from 'i18next';

export const getMenuItems = (t: TFunction) => [
  {
    itemKey: '/user',
    text: t('menu.user'),
    icon: <IconUser />,
    items: [
      {
        itemKey: '/user/user-list',
        text: t('menu.user.list'),
        icon: <IconList />,
      },
      {
        itemKey: '/user/role',
        text: t('menu.user.roleManage'),
        icon: <IconUserGroup />,
      },
      {
        itemKey: '/user/permission',
        text: t('menu.user.permission'),
        icon: <IconLock />,
      },
      {
        itemKey: '/user/user-role',
        text: t('menu.user.userRole'),
        icon: <IconUserGroup />,
      },
      {
        itemKey: '/user/role-permission',
        text: t('menu.user.rolePermission'),
        icon: <IconSetting />,
      },
    ],
  },
];

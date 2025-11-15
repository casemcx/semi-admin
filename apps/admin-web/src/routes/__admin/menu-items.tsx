import {
  IconList,
  IconLock,
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
        itemKey: '/user/user-role',
        text: t('menu.user.role'),
        icon: <IconUserGroup />,
      },
      {
        itemKey: '/user/permission',
        text: t('menu.user.permission'),
        icon: <IconLock />,
      },
    ],
  },
];

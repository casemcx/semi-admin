import { useLocal } from '@/locales';
import {
  IconList,
  IconLock,
  IconSetting,
  IconUser,
  IconUserGroup,
} from '@douyinfe/semi-icons';

export const userMenuItems = () => {
  const intl = useLocal();

  const items = useRef([
    {
      itemKey: '/user',
      text: intl.get('menu.user'),
      icon: <IconUser />,
      items: [
        {
          itemKey: '/user/user-list',
          text: intl.get('menu.user.list'),
          icon: <IconList />,
        },
        {
          itemKey: '/user/role',
          text: intl.get('menu.user.roleManage'),
          icon: <IconUserGroup />,
        },
        {
          itemKey: '/user/permission',
          text: intl.get('menu.user.permission'),
          icon: <IconLock />,
        },
        {
          itemKey: '/user/user-role',
          text: intl.get('menu.user.userRole'),
          icon: <IconUserGroup />,
        },
        {
          itemKey: '/user/role-permission',
          text: intl.get('menu.user.rolePermission'),
          icon: <IconSetting />,
        },
      ],
    },
  ]);

  return {
    items,
  };
};

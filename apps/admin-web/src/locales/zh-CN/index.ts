import { zh } from '@packages/share';
import menu from './menu';
import permission from './user/permission';
import role from './user/role';
import rolePermission from './user/role-permission';
import userList from './user/user-list';
import userRole from './user/user-role';

export default {
  translation: {
    ...zh,
    ...permission,
    ...role,
    ...userRole,
    ...rolePermission,
    ...userList,
    ...menu,
  },
};

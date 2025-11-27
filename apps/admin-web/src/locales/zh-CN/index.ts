import { zh } from '@packages/share';
import menu from './menu';
import permission from './user/permission';
import role from './user/role';
import userRole from './user/user-role';
import rolePermission from './user/role-permission';

export default {
  translation: {
    ...zh,
    ...permission,
    ...role,
    ...userRole,
    ...rolePermission,
    ...menu,
  },
};

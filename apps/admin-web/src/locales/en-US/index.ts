import { en } from '@packages/share';
import menu from './menu';
import permission from './user/permission';

export default {
  translation: {
    ...en,
    ...permission,
    ...menu,
  },
};

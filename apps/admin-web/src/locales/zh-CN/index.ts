import { zh } from '@packages/share';
import menu from './menu';
import permission from './user/permission';

export default {
  translation: {
    ...zh,
    ...permission,
    ...menu,
  },
};

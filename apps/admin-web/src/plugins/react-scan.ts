import type { RuntimePluginFuture } from '@modern-js/runtime';
import { scan } from 'react-scan';

const reactScanPlugin: RuntimePluginFuture = {
  name: 'react-scan',
  setup(app) {
    app.onBeforeRender(() => {
      scan({
        enabled: true,
      });
    });
  },
};

export default reactScanPlugin;

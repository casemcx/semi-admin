import { withField } from '@douyinfe/semi-ui';
import { useEffect, useId, useMemo, useRef } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

import styles from './index.module.less';

import type { MarkdownProps } from './markdown-types';

export const Markdown = (props: MarkdownProps) => {
  const vditor = useRef<Vditor | undefined>(undefined);

  const { value, onChange, id, defaultValue, placeholder, ...rest } = props;

  const mounted = useRef(false);

  const componentId = useId();

  const vditorId = useMemo(() => {
    return `${id}-${componentId}`;
  }, [id, componentId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    mounted.current = true;
    vditor.current = new Vditor(vditorId, {
      mode: 'wysiwyg',
      value: defaultValue,
      placeholder,
      input(value: string) {
        onChange?.(value);
      },
      blur(value: string) {
        onChange?.(value);
      },
    });

    return () => {
      mounted.current = false;
      if (!vditorId) {
        vditor.current?.destroy();
        vditor.current = undefined;
      }
    };
  }, [vditorId]);

  useEffect(() => {
    if (value && vditor.current?.setValue && mounted.current) {
      vditor.current?.setValue(value);
    }
  }, [value]);

  return <div id={vditorId} className={styles.vditor} {...rest} />;
};

const MarkdownFormFiled = withField(Markdown, {
  valueKey: 'value',
  onKeyChangeFnName: 'onChange',
});

export default MarkdownFormFiled;

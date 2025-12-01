import { withField } from '@douyinfe/semi-ui';
import type { CommonFieldProps } from '@douyinfe/semi-ui/lib/es/form/interface';
import { useEffect, useId, useMemo, useRef } from 'react';
import type { ComponentType, RefAttributes } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

import styles from './index.module.less';

import type { MarkdownProps } from './MarkdownTypes';

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

type MarkdownFormFieldProps = Omit<MarkdownProps, 'defaultValue' | 'value'> &
  CommonFieldProps &
  RefAttributes<any>;

const MarkdownFormFiled: ComponentType<MarkdownFormFieldProps> = withField(
  Markdown,
  {
    valueKey: 'value',
    onKeyChangeFnName: 'onChange',
  },
);

export default MarkdownFormFiled;

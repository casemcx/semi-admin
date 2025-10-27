import { withField } from '@douyinfe/semi-ui';
import {
  FC,
  type HTMLAttributes,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

// @ts-ignore
import styles from './index.module.less';

export const device = {
  mobile: 'mobile',
  desktop: 'desktop',
} as const;

export type MarkdownProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * 参数值
   */
  value?: string;
  /**
   * 参数值变化时回调
   */
  onChange?: (value?: string) => void;

  id: string | number;

  /**
   * 设备
   */
  device?: (keyof typeof device)[];

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 占位符
   */
  placeholder?: string;
};

export const Markdown = (props: MarkdownProps) => {
  const vditor = useRef<Vditor>();

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
      input(value) {
        onChange?.(value);
      },
      blur(value) {
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

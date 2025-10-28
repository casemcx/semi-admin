import { useEffect, useRef } from 'react';
import Vditor from 'vditor';

import type { MarkdownProps } from './markdown-types';

export const MarkdownPreview = (props: MarkdownProps) => {
  const { id, value, ...reset } = props;

  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    elRef.current &&
      Vditor.preview(elRef.current, value ?? '', {
        speech: {
          enable: false,
        },
        mode: 'light',
        anchor: 1,
        after() {},
      });
  }, [value]);

  return <div id={id} ref={elRef} {...reset} />;
};

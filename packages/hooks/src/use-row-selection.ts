import type { RowSelectionProps } from '@douyinfe/semi-ui/lib/es/table';
import { useMemo, useState } from 'react';

type UseRowSelectionProps<
  T extends Record<string, any> = Record<string, any>,
  Key extends string = string,
> = {
  defaultKeys: Key[];
} & Omit<RowSelectionProps<T>, 'selectedRowKeys'>;

export const useRowSelection = <
  T extends Record<string, any> = Record<string, any>,
  Key extends string = string,
>(
  props: UseRowSelectionProps<T, Key>,
) => {
  const { defaultKeys, onChange } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(defaultKeys);

  const rowSelection: RowSelectionProps<T> = useMemo(() => {
    return {
      ...props,
      selectedRowKeys,
      onChange: selectedKeys => {
        onChange?.(selectedKeys);
        setSelectedRowKeys((selectedKeys || []) as Key[]);
      },
    };
  }, [selectedRowKeys, onChange, props]);

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection,
  };
};

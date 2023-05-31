import type { GupoTableProps } from '../table';

export const useColumn = (propsGetter: () => GupoTableProps) => {
  const props = toValue(propsGetter);

  const computedColumns = computed(() => {
    const columns = [...props.columns!];
    if (props.selection) {
      columns.unshift({
        type: 'selection'
      });
    }
    return columns;
  });

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    computedColumns: computedColumns as any
  };
};

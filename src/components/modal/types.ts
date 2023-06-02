import type { ModalProps } from 'naive-ui';

export type ModalMethods = {
  close: () => void;
  open: () => void;
  updateProps: (p: ModalProps) => void;
};

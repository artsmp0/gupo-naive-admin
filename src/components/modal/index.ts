import type { ModalProps } from 'naive-ui';
import type { ModalMethods } from './types';

export const useModal = (props: ModalProps) => {
  const modalRef = ref<ModalMethods>();
  const register = (methods: ModalMethods) => {
    console.log('register modal success');
    modalRef.value = methods;
  };

  const methods: ModalMethods = {
    updateProps: (props) => {
      modalRef.value?.updateProps(props);
    },
    close() {
      modalRef.value?.close();
    },
    open() {
      modalRef.value?.open();
    }
  };

  watchEffect(() => {
    modalRef.value?.updateProps(props);
  });

  return [register, methods] as [(methods: ModalMethods) => void, ModalMethods];
};

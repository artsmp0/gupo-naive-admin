<script setup lang="ts">
import { useModal } from '@/components/modal';
import GupoModal from '@/components/modal/GupoModal.vue';
import { useDiscrete } from '@/composables';

const [register, modal] = useModal({
  title: '无敌',
  showIcon: false,
  preset: 'dialog',
  contentStyle: {
    width: '800px'
  }
});

const { message } = useDiscrete();

const [register2, modal2] = useModal({
  title: '无敌222222',
  showIcon: false,
  preset: 'dialog',
  negativeText: '取消',
  positiveText: '确认',
  positiveButtonProps: {
    size: 'medium'
  },
  onClose() {
    console.log('close');
  },
  onPositiveClick: () => {
    return new Promise((resolve) => {
      modal2.updateProps({
        loading: true
      });
      setTimeout(() => {
        modal2.updateProps({
          loading: false
        });
        resolve(1);
        message.success('确定');
      }, 3000);
    });
  },
  onNegativeClick: () => {
    message.error('不确定');
  }
});

const handleConfirm = () => {
  modal.close();
};

const update = () => {
  modal.updateProps({
    negativeText: '取消',
    positiveText: '确认',
    positiveButtonProps: {
      size: 'medium'
    }
  });
};
</script>

<template>
  <div p16>
    <NSpace>
      <NButton @click="modal.open()">打开</NButton>
      <NButton @click="modal2.open()">打开2</NButton>
    </NSpace>
    <GupoModal @register="register" @confirm="handleConfirm">
      <NButton @click="update">更新props</NButton>
    </GupoModal>
    <GupoModal @register="register2">
      <div w900>模态框2</div>
    </GupoModal>
  </div>
</template>

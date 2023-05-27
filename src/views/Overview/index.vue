<script setup lang="ts"></script>

<template>
  <div page-wrapper>
    <NButton type="primary">我是按钮</NButton>
    <NCard>
      只要是 看到天边云一朵<br />
      逐天拢有好心情
    </NCard>
    <div v-for="item in 100" :key="item" text="18 primary">我是采用 Naive UI 的主题色的字体</div>
  </div>
</template>

<style lang="scss" scoped>
.wu-di {
  color: #f00;
}
</style>

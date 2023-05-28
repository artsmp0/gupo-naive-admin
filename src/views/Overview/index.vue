<script setup lang="ts"></script>

<template>
  <div page-wrapper>
    <NButton type="primary">我是按钮</NButton>
    <NCard>
      只要是 看到天边云一朵<br />
      逐天拢有好心情
    </NCard>
    <span text="12 primary">
      测试图标和字体对齐
      <SvgIcon name="sidebar-dashboard" />
    </span>
    <div v-for="item in 10" :key="item" text="30 primary">
      我是采用 Naive UI 的主题色的字体
      <SvgIcon name="sidebar-chart" />Iam
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wu-di {
  color: #f00;
}
</style>

<script setup lang="ts"></script>

<template>
  <div p16>
    这是一个有详情的嵌套路由
    <NButton @click="$router.push('/nest-is-page/page1/detail')">去详情</NButton>
  </div>
</template>

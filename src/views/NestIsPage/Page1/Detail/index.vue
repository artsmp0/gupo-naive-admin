<script setup lang="ts"></script>

<template>
  <div p16>
    <span class="text-16 text-red">
      当配置了
      <NText code> "hideInMenu": true </NText>
      时，子页面将在菜单中隐藏，一般这种情况出现在详情页
    </span>
    <NButton @click="$router.push('/nest-is-page/page1')">返回详情页的父页面</NButton>
  </div>
</template>

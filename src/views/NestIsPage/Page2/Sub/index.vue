<script setup lang="ts"></script>

<template>
  <div p16>
    <div>这是页面二的嵌套页面，页面二也是一个页面喔，你可以点击他的名称试试~~</div>
    <div class="w100">
      <!-- TODO 在 NEllipsis 中无法 设置 tooltip style  -->
      <NEllipsis :tooltip="{ placement: 'bottom-end', maxWidth: 300 }">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium odio minus
        reprehenderit quidem error atque aliquid odit! Nobis assumenda molestias aperiam dolore
        quidem, facere sunt nihil magnam explicabo, provident rem.
      </NEllipsis>
    </div>
  </div>
</template>

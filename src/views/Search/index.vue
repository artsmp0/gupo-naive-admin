<script setup lang="ts">
const model = ref({
  inputValue: ''
});
</script>

<template>
  <div>
    <SearchBar v-model:model="model" mb10>
      <NFormItem ref="el" label="Input" path="inputValue">
        <NInput v-model:value="model.inputValue" placeholder="Input" />
      </NFormItem>
      <NFormItem label="Input" path="inputValue">
        <NInput v-model:value="model.inputValue" placeholder="Input" />
      </NFormItem>
      <NFormItem label="时间选择" path="inputValue">
        <NDatePicker placeholder="Input" />
      </NFormItem>
      <NFormItem label="范围选择" path="inputValue">
        <NDatePicker type="daterange" placeholder="Input" />
      </NFormItem>
      <NFormItem label="范围选择" path="inputValue">
        <NDatePicker type="daterange" placeholder="Input" />
      </NFormItem>
    </SearchBar>
    <NCard> 123123 </NCard>
  </div>
</template>

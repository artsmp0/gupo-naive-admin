<script setup lang="ts">
interface Model {
  text1: string;
  text2: string;
  date: string | null;
  dateRange1: [string, string] | null;
  dateRange2: [string, string] | null;
}
const model = ref<Model>({
  text1: '',
  text2: '',
  date: null,
  dateRange1: null,
  dateRange2: null
});

const loading = ref(false);
const handleSearch = () => {
  console.log(model.value);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>

<template>
  <div p16>
    <SearchForm
      v-model:model="model"
      mb10
      :loading="loading"
      label-width="70px"
      @search="handleSearch"
    >
      <NFormItem ref="el" label="Input" path="text1">
        <NInput v-model:value="model.text1" placeholder="Input" />
      </NFormItem>
      <NFormItem label="Input" path="text2">
        <NInput v-model:value="model.text2" placeholder="Input" />
      </NFormItem>
      <NFormItem label="时间选择" path="date">
        <NDatePicker
          v-model:formatted-value="model.date"
          placeholder="时间选择"
          value-format="yyyy.MM.dd HH:mm:ss"
        />
      </NFormItem>
      <NFormItem label="范围选择" path="dateRange1">
        <NDatePicker
          v-model:formatted-value="model.dateRange1"
          type="daterange"
          placeholder="Input"
        />
      </NFormItem>
      <NFormItem label="范围选择" path="inputValue">
        <NDatePicker
          v-model:formatted-value="model.dateRange2"
          type="daterange"
          placeholder="Input"
        />
      </NFormItem>
    </SearchForm>
    <SearchForm
      v-model:model="model"
      mb10
      :loading="loading"
      min-width="250px"
      @search="handleSearch"
    >
      <NFormItem ref="el" path="text1">
        <NInput v-model:value="model.text1" placeholder="Input" />
      </NFormItem>
      <NFormItem path="text2">
        <NInput v-model:value="model.text2" placeholder="Input" />
      </NFormItem>
      <NFormItem path="date">
        <NDatePicker
          v-model:formatted-value="model.date"
          placeholder="时间选择"
          value-format="yyyy.MM.dd HH:mm:ss"
        />
      </NFormItem>
      <NFormItem path="dateRange1">
        <NDatePicker
          v-model:formatted-value="model.dateRange1"
          type="daterange"
          placeholder="Input"
        />
      </NFormItem>
      <NFormItem path="inputValue">
        <NDatePicker
          v-model:formatted-value="model.dateRange2"
          type="daterange"
          placeholder="Input"
        />
      </NFormItem>
    </SearchForm>
    <NCard>
      <div class="text-[var(--error-color)]">这里通常放个表格</div>
      <div class="text-[var(--warning-color)]">表格通常设置 `flex-height`，以自适应容器高度</div>
    </NCard>
  </div>
</template>

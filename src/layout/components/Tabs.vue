<script setup lang="ts">
import { useTabsStore, type Tab } from '@/stores/tabs';
// import { NIcon } from 'naive-ui';

const router = useRouter();
const route = useRoute();
const tabStore = useTabsStore();
const accessHistory = ref<Set<string>>(new Set());

const resolveHistory = (p: string) => {
  if (accessHistory.value.has(p)) {
    accessHistory.value.delete(p);
  }
  accessHistory.value.add(p);
};
watch(
  route,
  () => {
    resolveHistory(route.path);
    tabStore.addTab(route);
  },
  { immediate: true }
);

const handleClick = (t: Tab) => {
  resolveHistory(t.path);
  router.push({
    path: t.path
  });
  resolveHistory(t.path);
};

const handleClose = (t: Tab) => {
  tabStore.removeTab(t);
  accessHistory.value.delete(t.path);
  if (t.path === route.path) {
    if (!accessHistory.value.size) return;
    const newPath = [...accessHistory.value][accessHistory.value.size - 1];
    router.push({
      path: newPath
    });
  }
};

const curRightClickTab = shallowRef<Tab>();
const handleShowContextMenu = (e: MouseEvent, t: Tab) => {
  showDropdown.value = false;
  curRightClickTab.value = t;
  nextTick().then(() => {
    showDropdown.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
  });
};

// const renderIcon = (icon: Component) => {
//   return () => {
//     return h(NIcon, null, {
//       default: () => h(icon)
//     });
//   };
// };

const options = [
  {
    label: '关闭',
    key: 'close'
  },
  {
    label: '关闭其他',
    key: 'closeOther'
  },
  {
    label: '关闭所有',
    key: 'closeAll'
  },
  {
    label: '关闭右侧',
    key: 'closeRight'
  },
  {
    label: '关闭左侧',
    key: 'closeLeft'
  }
];

const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const onClickoutside = () => {
  showDropdown.value = false;
};

const handleSelect = (key: string | number) => {
  showDropdown.value = false;
  if (!curRightClickTab.value) return;
  const t = curRightClickTab.value;
  let delTabs: Tab[] = [];
  switch (key) {
    case 'close':
      handleClose(t);
      break;
    case 'closeOther':
      if (t.path === route.path) {
        tabStore.removeOther(t);
      } else {
        router.push(t.path);
        tabStore.removeOther(t);
      }
      break;
    case 'closeAll':
      router.push('/');
      tabStore.removeAll();
      break;
    case 'closeLeft':
      delTabs = tabStore.removeLeft(t);
      if (delTabs.find((t) => t.path === route.path)) {
        router.push(t.path);
      }
      delTabs = [];
      break;
    case 'closeRight':
      delTabs = tabStore.removeRight(t);
      if (delTabs.find((t) => t.path === route.path)) {
        router.push(t.path);
      }
      delTabs = [];
      break;
    default:
      break;
  }
  curRightClickTab.value = undefined;
};
</script>

<template>
  <div v-if="accessHistory.size" class="border-b-1 border-base">
    <NScrollbar :x-scrollable="true" trigger="none">
      <TransitionGroup name="list" appear class="relative flex ws-nowrap px8 py8" tag="div">
        <NTag
          v-for="[, t] of tabStore.tabs"
          :key="t.path"
          :closable="tabStore.tabs.size !== 1"
          :type="route.path === t.path ? 'error' : 'success'"
          size="large"
          class="mr8 cursor-pointer"
          @click="handleClick(t)"
          @close="handleClose(t)"
          @contextmenu.prevent="(e) => handleShowContextMenu(e, t)"
        >
          <template #icon>
            <SvgIcon v-if="t.icon" size="16" :name="t.icon" />
          </template>
          {{ t.name }}
        </NTag>
      </TransitionGroup>
      <NDropdown
        placement="bottom-start"
        trigger="manual"
        :x="x"
        :y="y"
        :options="options"
        :show="showDropdown"
        :on-clickoutside="onClickoutside"
        @select="handleSelect"
      />
    </NScrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-scrollbar) {
  > .n-scrollbar-rail.n-scrollbar-rail--horizontal,
  + .n-scrollbar-rail.n-scrollbar-rail--horizontal {
    bottom: 2px;
  }
}
</style>

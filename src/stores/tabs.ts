import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export type Tab = {
  name: string;
  path: string;
  icon?: string;
};

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Map<string, Tab>>(new Map());

  const notCanCloseTabs = ref<Tab[]>([]);

  const addTab = (route: RouteLocationNormalizedLoaded) => {
    if (route.path === '/redirect') {
      return;
    }
    if (tabs.value.has(route.path)) {
      return;
    }
    const tt = {
      name: route.meta.title!,
      path: route.path,
      icon: route.meta.icon
    };
    tabs.value.set(route.path, tt);

    if (route.meta.noClosable) {
      notCanCloseTabs.value.push(tt);
    }
  };

  const removeTab = (tab: Tab) => {
    tabs.value.delete(tab.path);
  };

  const removeOther = (tab: Tab) => {
    tabs.value = new Map([[tab.path, tab]]);
  };

  const removeAll = () => {
    tabs.value = new Map();
  };

  const removeRight = (tab: Tab) => {
    const ts: Tab[] = [];
    let idx = 0;
    let targetIdx = 0;
    tabs.value.forEach((t) => {
      if (t.path === tab.path) {
        targetIdx = idx;
      }
      ts.push(t);
      idx++;
    });
    const delTabs = ts.splice(targetIdx + 1, ts.length - targetIdx);
    tabs.value = new Map(ts.map((t) => [t.path, t]));
    return delTabs;
  };

  const removeLeft = (tab: Tab) => {
    const ts: Tab[] = [];
    let idx = 0;
    let targetIdx = 0;
    tabs.value.forEach((t) => {
      if (t.path === tab.path) {
        targetIdx = idx;
      }
      ts.push(t);
      idx++;
    });
    const delTabs = ts.splice(0, targetIdx);
    tabs.value = new Map(ts.map((t) => [t.path, t]));
    return delTabs;
  };

  return {
    tabs,
    addTab,
    removeTab,
    removeOther,
    removeAll,
    removeRight,
    removeLeft
  };
});

import type { CollapseType, LayoutType } from '@/config/design';
import { defineStore } from 'pinia';
import { onUnmounted } from 'vue';
import designSetting from '@/config/design';

const {
  darkMode: reDarkMode,
  themeColor,
  themeColorList,
  isPageAnimate,
  pageAnimateType: rePageAnimateType,
  layout: reLayout,
  collapseType: reCollapseType,
  isCollapse: reisCollapse,
  isSafeAreaHover: reisSafeAreaHover,
  hasActivatedHover: rehasActivatedHover,
} = designSetting;

type ThemeMode = 'light' | 'dark' | 'inverted' | 'system' | 'high-contrast';

export const useDesignStore = defineStore(
  'design',
  () => {
    const darkMode = ref<ThemeMode>(reDarkMode);
    const setDarkMode = (modeType: ThemeMode) => {
      if (modeType === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkMode.value = mediaQuery.matches ? 'dark' : 'light';
        
        // 监听系统主题变化
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          darkMode.value = e.matches ? 'dark' : 'light';
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // 清理函数（如果需要的话）
        onUnmounted(() => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        });
      } else {
        darkMode.value = modeType;
      }
    };

    const pageAnimateType = ref(rePageAnimateType);

    const setPageAnimateType = (type: string) => {
      pageAnimateType.value = type;
    };

    // 主题色
    const themeColorRef = ref(themeColor);
    const setThemeColor = (color: string) => {
      themeColorRef.value = color;
    };

    // 主题色列表
    const themeColorListRef = ref(themeColorList);

    // 页面动画开关
    const isPageAnimateRef = ref(isPageAnimate);
    const setIsPageAnimate = (animate: boolean) => {
      isPageAnimateRef.value = animate;
    };

    const layout = ref<LayoutType>(reLayout);

    // 当前只有一个布局，暂时不将这个方法暴露出去
    // const _setLayout = (layoutType: 'vertical') => {
    //   layout.value = layoutType;
    // };

    // 折叠状态
    const collapseType = ref<CollapseType>(reCollapseType);
    const setCollapseType = (type: CollapseType) => {
      collapseType.value = type;
    };

    // 最终是否展开左侧菜单
    const isCollapse = ref<boolean>(reisCollapse);

    const setCollapse = (collapseFinal: boolean) => {
      isCollapse.value = collapseFinal;
    };

    // 折叠按钮是否被悬停
    const isSafeAreaHover = ref<boolean>(reisSafeAreaHover);

    const setSafeAreaHover = (hover: boolean) => {
      isSafeAreaHover.value = hover;
    };

    // 跟踪是否首次激活悬停
    const hasActivatedHover = ref<boolean>(rehasActivatedHover);

    // 紧凑模式
    const isCompactMode = ref<boolean>(false);
    const setIsCompactMode = (compact: boolean) => {
      isCompactMode.value = compact;
    };

    // 自动保存
    const isAutoSave = ref<boolean>(true);
    const setIsAutoSave = (autoSave: boolean) => {
      isAutoSave.value = autoSave;
    };

    // 打字效果
    const isTypingEffect = ref<boolean>(true);
    const setIsTypingEffect = (typingEffect: boolean) => {
      isTypingEffect.value = typingEffect;
    };

    // 消息限制
    const messageLimit = ref<number>(50);
    const setMessageLimit = (limit: number) => {
      messageLimit.value = limit;
    };

    // 两个监听不要合并
    watch(
      () => isCollapse.value,
      (newValue) => {
        if (newValue) {
          hasActivatedHover.value = false;
        }
      },
      { deep: true },
    );

    watch(
      () => isSafeAreaHover.value,
      () => {
        hasActivatedHover.value = true;
      },
      { deep: true },
    );

    return {
      darkMode,
      setDarkMode,
      themeColor: themeColorRef,
      setThemeColor,
      themeColorList: themeColorListRef,
      isPageAnimate: isPageAnimateRef,
      setIsPageAnimate,
      pageAnimateType,
      setPageAnimateType,
      layout,
      collapseType,
      setCollapseType,
      isCollapse,
      setCollapse,
      isSafeAreaHover,
      setSafeAreaHover,
      hasActivatedHover,
      isCompactMode,
      setIsCompactMode,
      isAutoSave,
      setIsAutoSave,
      isTypingEffect,
      setIsTypingEffect,
      messageLimit,
      setMessageLimit,
    };
  },
  {
    persist: true,
  },
);

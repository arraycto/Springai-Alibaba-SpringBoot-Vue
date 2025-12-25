<script setup lang="ts">
import { useDesignStore } from '@/stores';
import { useLanguageStore } from '@/stores/modules/language';

const designStore = useDesignStore();
const languageStore = useLanguageStore();

// 初始化语言设置
onMounted(() => {
  languageStore.initLanguage();
});

// 监听主题变化并应用到页面
watch(
  () => designStore.darkMode,
  (newMode) => {
    applyTheme(newMode);
  },
  { immediate: true }
);

// 监听主题色变化并应用到页面
watch(
  () => designStore.themeColor,
  (newColor) => {
    applyThemeColor(newColor);
  },
  { immediate: true }
);

// 应用主题到页面
function applyTheme(mode: 'light' | 'dark' | 'inverted' | 'system' | 'high-contrast') {
  const html = document.documentElement;
  const body = document.body;
  
  // 移除现有的主题类
  html.classList.remove('light-mode', 'dark-mode', 'system-mode', 'high-contrast-mode');
  body.classList.remove('light-mode', 'dark-mode', 'system-mode', 'high-contrast-mode');
  
  switch (mode) {
    case 'light':
      html.classList.add('light-mode');
      body.classList.add('light-mode');
      html.setAttribute('data-theme', 'light');
      break;
    case 'dark':
      html.classList.add('dark-mode');
      body.classList.add('dark-mode');
      html.setAttribute('data-theme', 'dark');
      break;
    case 'system':
      html.classList.add('system-mode');
      body.classList.add('system-mode');
      // 跟随系统主题
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      html.setAttribute('data-theme', systemTheme);
      html.classList.add(systemTheme === 'dark' ? 'dark-mode' : 'light-mode');
      body.classList.add(systemTheme === 'dark' ? 'dark-mode' : 'light-mode');
      
      // 监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newSystemTheme);
        html.classList.remove('light-mode', 'dark-mode');
        body.classList.remove('light-mode', 'dark-mode');
        html.classList.add(newSystemTheme === 'dark' ? 'dark-mode' : 'light-mode');
        body.classList.add(newSystemTheme === 'dark' ? 'dark-mode' : 'light-mode');
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // 清理监听器
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      });
      break;
    case 'high-contrast':
      html.classList.add('high-contrast-mode');
      body.classList.add('high-contrast-mode');
      html.setAttribute('data-theme', 'high-contrast');
      break;
    case 'inverted':
      // 保持原有逻辑，但建议使用 'system' 替代 'inverted'
      html.classList.add('system-mode');
      body.classList.add('system-mode');
      const invertedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
      html.setAttribute('data-theme', invertedTheme);
      html.classList.add(invertedTheme === 'dark' ? 'dark-mode' : 'light-mode');
      body.classList.add(invertedTheme === 'dark' ? 'dark-mode' : 'light-mode');
      break;
  }
}

// 应用主题色到页面
function applyThemeColor(color: string) {
  const root = document.documentElement;
  
  // 设置主题色到 CSS 变量
  root.style.setProperty('--el-color-primary', color);
  
  // 生成主题色相关的派生颜色
  const rgb = hexToRgb(color);
  if (rgb) {
    // 生成浅色变体
    const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
    const lighterColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
    
    // 使用生成的浅色变量
    root.style.setProperty('--el-color-primary-light-3', lightColor);
    root.style.setProperty('--el-color-primary-light-5', lighterColor);
    root.style.setProperty('--el-color-primary-light-5', lightenColor(color, 0.5));
    root.style.setProperty('--el-color-primary-light-7', lightenColor(color, 0.7));
    root.style.setProperty('--el-color-primary-light-8', lightenColor(color, 0.8));
    root.style.setProperty('--el-color-primary-light-9', lightenColor(color, 0.9));
    root.style.setProperty('--el-color-primary-dark-2', darkenColor(color, 0.2));
  }
}

// 十六进制颜色转 RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// 颜色变亮
function lightenColor(color: string, amount: number) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount));
  
  return `rgb(${r}, ${g}, ${b})`;
}

// 颜色变暗
function darkenColor(color: string, amount: number) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));
  
  return `rgb(${r}, ${g}, ${b})`;
}
</script>

<template>
  <router-view />
</template>

<style scoped lang="scss"></style>

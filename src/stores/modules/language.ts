// 语言设置状态管理
import { defineStore } from 'pinia';

export type LanguageType = 'zh-CN' | 'en';

export const useLanguageStore = defineStore(
  'language',
  () => {
    // 当前语言
    const currentLanguage = ref<LanguageType>('zh-CN');

    // 设置语言
    const setLanguage = (language: LanguageType) => {
      currentLanguage.value = language;
      // 更新页面语言属性
      document.documentElement.lang = language;
      // 保存到本地存储
      localStorage.setItem('app-language', language);
      // 触发语言变化事件
      window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
    };

    // 切换语言
    const toggleLanguage = () => {
      const newLang = currentLanguage.value === 'zh-CN' ? 'en' : 'zh-CN';
      setLanguage(newLang);
    };

    // 初始化语言设置
    const initLanguage = () => {
      // 从本地存储或浏览器设置中获取语言
      const savedLang = localStorage.getItem('app-language') as LanguageType;
      const browserLang = navigator.language.startsWith('zh') ? 'zh-CN' : 'en';
      
      if (savedLang && ['zh-CN', 'en'].includes(savedLang)) {
        setLanguage(savedLang);
      } else {
        setLanguage(browserLang);
      }
    };

    return {
      currentLanguage,
      setLanguage,
      toggleLanguage,
      initLanguage,
    };
  },
  {
    persist: {
      key: 'language-settings',
    },
  },
);

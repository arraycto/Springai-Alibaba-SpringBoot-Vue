// 语言切换Composable
import { useLanguageStore } from '@/stores/modules/language';
import { getLanguageConfig } from '@/config/language';

export function useLanguage() {
  const languageStore = useLanguageStore();
  
  // 当前语言配置
  const languageConfig = computed(() => 
    getLanguageConfig(languageStore.currentLanguage)
  );
  
  // 翻译函数
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = languageConfig.value;
    
    // 确保 languageConfig.value 存在
    if (!value) {
      return fallback || key;
    }
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return value || fallback || key;
  };
  
  // 切换语言
  const toggleLanguage = () => {
    languageStore.toggleLanguage();
  };
  
  // 设置语言
  const setLanguage = (lang: 'zh-CN' | 'en') => {
    languageStore.setLanguage(lang);
  };
  
  return {
    // 状态
    currentLanguage: computed(() => languageStore.currentLanguage),
    languageConfig,
    
    // 方法
    t,
    toggleLanguage,
    setLanguage,
    
    // 快捷方法
    isChinese: computed(() => languageStore.currentLanguage === 'zh-CN'),
    isEnglish: computed(() => languageStore.currentLanguage === 'en'),
  };
}
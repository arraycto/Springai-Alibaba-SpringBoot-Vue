// 语言配置文件
export interface LanguageConfig {
  common: {
    login: string;
    logout: string;
    settings: string;
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    edit: string;
    delete: string;
    create: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  header: {
    title: string;
    newChat: string;
    settings: string;
    profile: string;
  };
  settings: {
    title: string;
    appearance: string;
    theme: string;
    language: string;
    animation: string;
    sidebar: string;
    about: string;
    lightMode: string;
    darkMode: string;
    systemMode: string;
    noAnimation: string;
    fadeAnimation: string;
    slideAnimation: string;
    zoomAnimation: string;
    chinese: string;
    english: string;
    version: string;
    // 新增翻译键
    interfaceSettings: string;
    interfaceDescription: string;
    chatSettings: string;
    chatDescription: string;
    themeDescription: string;
    languageDescription: string;
    languageSettings: string;
    languageSettingsDescription: string;
    sidebarDescription: string;
    pageAnimation: string;
    pageAnimationDescription: string;
    compactMode: string;
    compactModeDescription: string;
    autoSave: string;
    autoSaveDescription: string;
    messageLimit: string;
    messageLimitDescription: string;
    typingEffect: string;
    typingEffectDescription: string;
    typingEffectEnabled: string;
    typingEffectDisabled: string;
    feedback: string;
    feedbackDescription: string;
    help: string;
    helpDescription: string;
    versionDescription: string;
    highContrast: string;
    // 消息提示
    themeUpdated: string;
    themeColorUpdated: string;
    animationUpdated: string;
    sidebarUpdated: string;
    pageAnimationUpdated: string;
    compactModeEnabled: string;
    compactModeDisabled: string;
    languageSwitchedToChinese: string;
    languageSwitchedToEnglish: string;
    autoSaveEnabled: string;
    autoSaveDisabled: string;
    messageLimitUpdated: string;
    feedbackThanks: string;
    helpDocComingSoon: string;
  };
  chat: {
    welcome: string;
    sendMessage: string;
    placeholder: string;
    thinking: string;
    newSession: string;
    deleteSession: string;
  };
  error: {
    403: string;
    404: string;
    networkError: string;
    serverError: string;
  };
}

// 中文配置
export const zhCN: LanguageConfig = {
  common: {
    login: '登录',
    logout: '退出登录',
    settings: '设置',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    close: '关闭',
    edit: '编辑',
    delete: '删除',
    create: '创建',
    search: '搜索',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
  },
  header: {
    title: 'RichQI AI 对话系统',
    newChat: '新建对话',
    settings: '设置',
    profile: '个人资料',
  },
  settings: {
    title: '系统设置',
    appearance: '外观设置',
    theme: '主题模式',
    language: '界面语言',
    animation: '页面动画',
    sidebar: '侧边栏显示',
    about: '关于系统',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    systemMode: '跟随系统',
    noAnimation: '无动画',
    fadeAnimation: '淡入淡出',
    slideAnimation: '滑动',
    zoomAnimation: '缩放',
    chinese: '简体中文',
    english: 'English',
    version: '版本',
    // 新增翻译键
    interfaceSettings: '界面设置',
    interfaceDescription: '界面布局和交互设置',
    chatSettings: '对话设置',
    chatDescription: '对话相关设置',
    themeDescription: '选择系统主题模式',
    languageDescription: '选择界面语言',
    languageSettings: '语言设置',
    languageSettingsDescription: '选择您偏好的界面语言',
    sidebarDescription: '控制侧边栏显示状态',
    pageAnimation: '页面动画',
    pageAnimationDescription: '启用页面切换动画',
    compactMode: '紧凑模式',
    compactModeDescription: '减少界面元素间距',
    autoSave: '自动保存',
    autoSaveDescription: '自动保存对话记录',
    messageLimit: '消息限制',
    messageLimitDescription: '单次对话最大消息数',
    typingEffect: '打字效果',
    typingEffectDescription: '启用消息打字动画',
    typingEffectEnabled: '已启用打字效果',
    typingEffectDisabled: '已关闭打字效果',
    feedback: '意见反馈',
    feedbackDescription: '向我们提供宝贵意见',
    help: '帮助文档',
    helpDescription: '查看使用说明',
    versionDescription: '系统版本信息',
    highContrast: '高对比度',
    // 消息提示
    themeUpdated: '主题设置已更新',
    themeColorUpdated: '主题色彩已更新',
    animationUpdated: '动画设置已更新',
    sidebarUpdated: '侧边栏设置已更新',
    pageAnimationUpdated: '页面动画设置已更新',
    compactModeEnabled: '已启用紧凑模式',
    compactModeDisabled: '已关闭紧凑模式',
    languageSwitchedToChinese: '语言已切换为简体中文',
    languageSwitchedToEnglish: 'Language switched to English',
    autoSaveEnabled: '已启用自动保存',
    autoSaveDisabled: '已关闭自动保存',
    messageLimitUpdated: '消息限制已更新',
    feedbackThanks: '感谢您的反馈！',
    helpDocComingSoon: '帮助文档即将开放',
  },
  chat: {
    welcome: '欢迎使用 RichQI AI 对话系统',
    sendMessage: '发送消息',
    placeholder: '请输入您的问题...',
    thinking: '思考中...',
    newSession: '新建会话',
    deleteSession: '删除会话',
  },
  error: {
    403: '无权限访问',
    404: '页面不存在',
    networkError: '网络错误',
    serverError: '服务器错误',
  },
};

// 英文配置
export const en: LanguageConfig = {
  common: {
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
  },
  header: {
    title: 'RichQI AI Chat System',
    newChat: 'New Chat',
    settings: 'Settings',
    profile: 'Profile',
  },
  settings: {
    title: 'System Settings',
    appearance: 'Appearance',
    theme: 'Theme Mode',
    language: 'Interface Language',
    animation: 'Page Animation',
    sidebar: 'Sidebar Display',
    about: 'About System',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemMode: 'Follow System',
    noAnimation: 'No Animation',
    fadeAnimation: 'Fade',
    slideAnimation: 'Slide',
    zoomAnimation: 'Zoom',
    chinese: 'Chinese',
    english: 'English',
    version: 'Version',
    // 新增翻译键
    interfaceSettings: 'Interface Settings',
    interfaceDescription: 'Interface layout and interaction settings',
    chatSettings: 'Chat Settings',
    chatDescription: 'Chat related settings',
    themeDescription: 'Select system theme mode',
    languageDescription: 'Select interface language',
    languageSettings: 'Language Settings',
    languageSettingsDescription: 'Choose your preferred interface language',
    sidebarDescription: 'Control sidebar display status',
    pageAnimation: 'Page Animation',
    pageAnimationDescription: 'Enable page transition animation',
    compactMode: 'Compact Mode',
    compactModeDescription: 'Reduce interface element spacing',
    autoSave: 'Auto Save',
    autoSaveDescription: 'Automatically save conversation records',
    messageLimit: 'Message Limit',
    messageLimitDescription: 'Maximum number of messages per conversation',
    typingEffect: 'Typing Effect',
    typingEffectDescription: 'Enable message typing animation',
    typingEffectEnabled: 'Typing effect enabled',
    typingEffectDisabled: 'Typing effect disabled',
    feedback: 'Feedback',
    feedbackDescription: 'Provide us with valuable feedback',
    help: 'Help Documentation',
    helpDescription: 'View usage instructions',
    versionDescription: 'System version information',
    highContrast: 'High Contrast',
    // 消息提示
    // 消息提示
    themeUpdated: 'Theme settings updated',
    themeColorUpdated: 'Theme color updated',
    animationUpdated: 'Animation settings updated',
    sidebarUpdated: 'Sidebar settings updated',
    pageAnimationUpdated: 'Page animation settings updated',
    compactModeEnabled: 'Compact mode enabled',
    compactModeDisabled: 'Compact mode disabled',
    languageSwitchedToChinese: '语言已切换为简体中文',
    languageSwitchedToEnglish: 'Language switched to English',
    autoSaveEnabled: 'Auto save enabled',
    autoSaveDisabled: 'Auto save disabled',
    messageLimitUpdated: 'Message limit updated',
    feedbackThanks: 'Thank you for your feedback!',
    helpDocComingSoon: 'Help documentation coming soon',
  },
  chat: {
    welcome: 'Welcome to RichQI AI Chat System',
    sendMessage: 'Send Message',
    placeholder: 'Please enter your question...',
    thinking: 'Thinking...',
    newSession: 'New Session',
    deleteSession: 'Delete Session',
  },
  error: {
    403: 'Access Denied',
    404: 'Page Not Found',
    networkError: 'Network Error',
    serverError: 'Server Error',
  },
};

// 语言配置映射
export const languageConfigs = {
  'zh-CN': zhCN,
  'en': en,
};

// 获取当前语言配置
export function getLanguageConfig(lang: string): LanguageConfig {
  return languageConfigs[lang as keyof typeof languageConfigs] || zhCN;
}

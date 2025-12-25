<!-- 设置弹框 - 全新设计版本 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useDesignStore, useUserStore } from '@/stores';
import { useLanguage } from '@/composables/useLanguage';

const userStore = useUserStore();
const designStore = useDesignStore();
const { t, setLanguage, currentLanguage } = useLanguage();

// 使用 defineModel 定义双向绑定的 visible（需 Vue 3.4+）
const visible = defineModel<boolean>('visible', {
  default: false,
});

// 当前选中的设置分类
const activeCategory = ref('appearance');

// 关闭弹框
function handleClose() {
  visible.value = false;
}

// 点击遮罩层关闭
function handleMaskClick() {
  handleClose();
}

// 用户信息
const userInfo = computed(() => userStore.userInfo);

// 设置分类
const categories = computed(() => [
  {
    id: 'appearance',
    title: t('settings.appearance'),
    icon: 'brush-fill',
    description: t('settings.appearance'),
  },
  {
    id: 'interface',
    title: t('settings.interfaceSettings'),
    icon: 'layout-fill',
    description: t('settings.interfaceDescription'),
  },
  {
    id: 'chat',
    title: t('settings.chatSettings'),
    icon: 'chat-1-fill',
    description: t('settings.chatDescription'),
  },
  {
    id: 'about',
    title: t('settings.about'),
    icon: 'information-fill',
    description: t('settings.about'),
  },
]);

// 主题模式选项
const themeOptions = computed(() => [
  { label: t('settings.lightMode'), value: 'light', icon: 'sun-fill', preview: 'bg-gradient-to-br from-blue-50 to-white' },
  { label: t('settings.darkMode'), value: 'dark', icon: 'moon-fill', preview: 'bg-gradient-to-br from-gray-900 to-gray-800' },
  { label: t('settings.systemMode'), value: 'system', icon: 'computer-fill', preview: 'bg-gradient-to-br from-gray-200 to-gray-100' },
  { label: t('settings.highContrast'), value: 'high-contrast', icon: 'contrast-fill', preview: 'bg-gradient-to-br from-black to-white' },
]);

// 语言选项
const languageOptions = computed(() => [
  { label: t('settings.chinese'), value: 'zh-CN', icon: 'flag-fill', preview: 'bg-gradient-to-br from-red-500 to-yellow-500' },
  { label: t('settings.english'), value: 'en', icon: 'flag-fill', preview: 'bg-gradient-to-br from-blue-500 to-red-500' },
]);

// 模型选项
const modelOptions = computed(() => [
  { label: 'DeepSeek-R1', value: 'deepseek-r1', description: '深度推理思考，适合复杂问题' },
  { label: 'DeepSeek-V3.2', value: 'deepseek-v3.2', description: '全新升级代码及创作能力' },
  { label: '文心 4.5 Turbo', value: 'wenxin-4.5-turbo', description: '文心最新型，适合多数场景' },
]);

// 设置选项分组
const settingsGroups = computed(() => ({
  appearance: [
    {
      key: 'theme',
      title: t('settings.theme'),
      description: t('settings.themeDescription'),
      type: 'card-select',
      options: themeOptions.value,
      value: computed(() => designStore.darkMode),
      onChange: (value: string) => {
        designStore.setDarkMode(value as 'light' | 'dark' | 'inverted' | 'system' | 'high-contrast');
        showSuccessMessage('themeUpdated');
      },
    },
    {
      key: 'language',
      title: t('settings.language'),
      description: t('settings.languageDescription'),
      type: 'card-select',
      options: languageOptions.value,
      value: computed(() => currentLanguage.value),
      onChange: (value: string) => {
        setLanguage(value as 'zh-CN' | 'en');
        showSuccessMessage(value === 'zh-CN' ? 'languageSwitchedToChinese' : 'languageSwitchedToEnglish');
      },
    },
  ],
  interface: [
    {
      key: 'sidebar',
      title: t('settings.sidebar'),
      description: t('settings.sidebarDescription'),
      type: 'switch',
      value: computed(() => !designStore.isCollapse),
      onChange: (value: boolean) => {
        designStore.setCollapse(!value);
        showSuccessMessage('sidebarUpdated');
      },
    },
    {
      key: 'pageAnimate',
      title: t('settings.pageAnimation'),
      description: t('settings.pageAnimationDescription'),
      type: 'switch',
      value: computed(() => designStore.isPageAnimate),
      onChange: (value: boolean) => {
        designStore.setIsPageAnimate(value);
        showSuccessMessage('pageAnimationUpdated');
      },
    },
    {
      key: 'compactMode',
      title: t('settings.compactMode'),
      description: t('settings.compactModeDescription'),
      type: 'switch',
      value: computed(() => designStore.isCompactMode),
      onChange: (value: boolean) => {
        designStore.setIsCompactMode(value);
        showSuccessMessage(value ? 'compactModeEnabled' : 'compactModeDisabled');
      },
    },
  ],
  chat: [
    {
      key: 'autoSave',
      title: t('settings.autoSave'),
      description: t('settings.autoSaveDescription'),
      type: 'switch',
      value: computed(() => designStore.isAutoSave),
      onChange: (value: boolean) => {
        designStore.setIsAutoSave(value);
        showSuccessMessage(value ? 'autoSaveEnabled' : 'autoSaveDisabled');
      },
    },
    {      key: 'messageLimit',
      title: t('settings.messageLimit'),
      description: t('settings.messageLimitDescription'),
      type: 'number',
      value: computed(() => designStore.messageLimit),
      min: 10,
      max: 200,
      onChange: (value: number) => {
        designStore.setMessageLimit(value);
        showSuccessMessage('messageLimitUpdated');
      },
    },
    {      key: 'model',
      title: '模型选择',
      description: '选择您想使用的AI模型',
      type: 'select',
      options: modelOptions.value,
      value: computed(() => ({ value: 'deepseek-v3.2' })),
      onChange: (value: string) => {
        // 这里可以添加模型选择的逻辑
        showSuccessMessage('模型已切换');
      },
    },
    {      key: 'typingEffect',
      title: t('settings.typingEffect'),
      description: t('settings.typingEffectDescription'),
      type: 'switch',
      value: computed(() => designStore.isTypingEffect),
      onChange: (value: boolean) => {
        designStore.setIsTypingEffect(value);
        showSuccessMessage(value ? t('settings.typingEffectEnabled') : t('settings.typingEffectDisabled'));
      },
    },
  ],
  about: [
    {
      key: 'version',
      title: t('settings.version'),
      description: t('settings.versionDescription'),
      type: 'info',
      value: 'v1.0.0',
    },
    {
      key: 'feedback',
      title: t('settings.feedback'),
      description: t('settings.feedbackDescription'),
      type: 'button',
      onClick: () => {
        window.open('http://www.richqi.com', '_blank');
      },
    },
    {
      key: 'help',
      title: t('settings.help'),
      description: t('settings.helpDescription'),
      type: 'button',
      onClick: () => {
        window.open('http://www.richqi.com', '_blank');
      },
    },
  ],
}));

// 显示成功消息 - 置顶显示
function showSuccessMessage(messageKey: string) {
  ElMessage.success({
    message: t(`settings.${messageKey}`),
    offset: 80, // 距离顶部距离
    customClass: 'settings-message-top', // 自定义样式类
    duration: 2000, // 显示时长
    showClose: true, // 显示关闭按钮
    grouping: true, // 合并相同消息
    appendTo: document.body // 确保添加到 body 元素
  });
}



// 处理设置项交互
function handleSettingClick(item: any) {
  if (item.onClick) {
    item.onClick();
  }
}

// 处理选择器变化
function handleSelectChange(item: any, value: string) {
  if (item.onChange) {
    item.onChange(value);
  }
}

// 处理开关变化
function handleSwitchChange(item: any, value: boolean | string | number) {
  if (item.onChange) {
    item.onChange(value as boolean);
  }
}

// 处理数字输入变化
function handleNumberChange(item: any, value: number | undefined) {
  if (item.onChange && value !== undefined) {
    item.onChange(value);
  }
}

// 处理卡片选择
function handleCardSelect(item: any, value: string) {
  if (item.onChange) {
    item.onChange(value);
  }
}

// 处理颜色选择
function handleColorSelect(item: any, value: string) {
  if (item.onChange) {
    item.onChange(value);
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      name="settings-modal"
      appear
    >
      <div
        v-if="visible"
        class="settings-modal-overlay fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm"
        @click="handleMaskClick"
      >
        <div
          class="settings-modal-container bg-gradient-to-br from-white/95 to-gray-50/95 rounded-3xl shadow-2xl max-w-95vw max-h-95vh w-900px border border-white/20 dark:border-gray-700/50 backdrop-blur-xl"
          @click.stop
        >
          <!-- 头部 -->
          <div class="modal-header p-8 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-orange-50/80 to-amber-50/80">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="icon-wrapper p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                  <el-icon class="text-24px text-white">
                    <Settings4Fill />
                  </el-icon>
                </div>
                <div>
                  <h3 class="text-24px font-bold text-gray-900 dark:text-white mb-1">
                    {{ t('settings.title') }}
                  </h3>
                  <!-- <p class="text-sm text-gray-600 dark:text-gray-300">
                    个性化您的使用体验
                  </p> -->
                </div>
              </div>
              <el-icon
                class="close-icon text-22px text-gray-500 dark:text-gray-400 cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20"
                @click="handleClose"
              >
                <CloseBold />
              </el-icon>
            </div>
            
            <!-- 用户信息卡片 -->
            <div v-if="userInfo" class="user-info-card mt-6 p-5 bg-white/60 rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 backdrop-blur-sm">
              <div class="flex items-center gap-4">
                <el-avatar :src="userInfo.avatar" :size="48" fit="fit" shape="circle" class="border-2 border-orange-200 dark:border-orange-800 shadow-md" />
                <div class="flex-1 min-w-0">
                  <div class="text-15px font-semibold text-gray-900 dark:text-white truncate">
                    {{ userInfo.username || '用户' }}
                  </div>
                  <!-- <div class="text-12px text-gray-500 dark:text-gray-400 mt-1">
                      {{ (userInfo as any).email || '未设置邮箱' }}
                    </div> -->
                </div>
              </div>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="modal-content flex h-1100px">
            <!-- 左侧分类导航 -->
            <div class="category-nav w-240px bg-gradient-to-b from-orange-50/50 to-amber-50/50 overflow-y-auto border-r border-white/20 dark:border-gray-700/50">
              <div class="p-6 space-y-2">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="category-item p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-102"
                  :class="{
                    'shadow-xl border-3 border-orange-400 dark:border-orange-500 bg-white/60 dark:bg-gray-100/30 ring-2 ring-orange-200 dark:ring-orange-400/30': activeCategory === category.id,
                    'border border-transparent bg-gray-50/50 dark:bg-gray-100/20': activeCategory !== category.id
                  }"
                  @click="activeCategory = category.id"
                >
                  <div class="flex items-center gap-4">
                    <div class="icon-wrapper p-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl shadow-md">
                      <el-icon class="text-18px text-white">
                        <component :is="category.icon" />
                      </el-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-15px font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {{ category.title }}
                      </div>
                      <div class="text-12px text-gray-600 dark:text-gray-300 truncate">
                        {{ category.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧设置内容 -->
            <div class="settings-content flex-1 p-8 overflow-y-auto bg-white/30">
              <div class="space-y-8">
                <!-- 语言切换器 - 仅在appearance分类显示 -->
                <div v-if="activeCategory === 'appearance'" class="language-switcher-section">
                  <div class="mb-6">
                    <div class="text-18px font-bold text-gray-900 dark:text-white mb-2">
                      {{ t('settings.languageSettings') }}
                    </div>
                    <div class="text-14px text-gray-600 dark:text-gray-300 mb-4">
                      {{ t('settings.languageSettingsDescription') }}
                    </div>
                  </div>
                  <div class="flex gap-3">
                      <div
                        v-for="option in languageOptions"
                        :key="option.value"
                        class="language-btn px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 border-2 shadow-md"
                        :class="{
                          'selected': currentLanguage === option.value
                        }"
                        @click="() => { setLanguage(option.value as 'zh-CN' | 'en'); showSuccessMessage(option.value === 'zh-CN' ? 'languageSwitchedToChinese' : 'languageSwitchedToEnglish'); }"
                      >
                      <div class="flex items-center gap-3">
                        <el-icon class="text-18px">
                          <component :is="option.icon" />
                        </el-icon>
                        <span class="font-semibold">{{ option.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 设置项 -->
                <div
                  v-for="item in settingsGroups[activeCategory]"
                  :key="item.key"
                  class="setting-item"
                >
                  <!-- 卡片选择器 -->
                  <div v-if="item.type === 'card-select'" class="card-select-group">
                    <div class="mb-4">
                      <div class="text-18px font-bold text-gray-900 dark:text-white mb-2">
                        {{ item.title }}
                      </div>
                      <div class="text-14px text-gray-600 dark:text-gray-300">
                        {{ item.description }}
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        v-for="option in item.options"
                        :key="option.value"
                        class="card-option p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-102"
                        :class="{
                          'border-orange-500 shadow-lg ring-2 ring-orange-300 dark:ring-orange-500': item.value === option.value,
                          'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500': item.value !== option.value
                        }"
                        @click="handleCardSelect(item, option.value)"
                      >
                        <div class="flex flex-col items-center gap-3">
                          <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-inner" :class="option.preview">
                            <el-icon class="text-24px text-orange-500">
                              <component :is="option.icon" />
                            </el-icon>
                          </div>
                          <div class="text-14px font-semibold text-gray-900 dark:text-white text-center">
                            {{ option.label }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 颜色选择器 -->
                  <div v-if="item.type === 'color-select'" class="color-select-group">
                    <div class="mb-4">
                      <div class="text-18px font-bold text-gray-900 dark:text-white mb-2">
                        {{ item.title }}
                      </div>
                      <div class="text-14px text-gray-600 dark:text-gray-300">
                        {{ item.description }}
                      </div>
                    </div>
                    <div class="grid grid-cols-10 gap-3">
                      <div
                        v-for="option in item.options"
                        :key="option.value"
                        class="color-option w-10 h-10 rounded-xl cursor-pointer border-3 transition-all duration-300 hover:scale-110 shadow-md"
                        :class="{
                          'border-orange-500 scale-115 shadow-lg': item.value.value === option.value,
                          'border-gray-200 dark:border-gray-600 hover:border-orange-300': item.value.value !== option.value
                        }"
                        :style="{ backgroundColor: option.value }"
                        @click="handleColorSelect(item, option.value)"
                      />
                    </div>
                  </div>

                  <!-- 常规设置项 -->
                  <div v-if="['select', 'switch', 'number', 'info', 'button'].includes(item.type)" class="setting-control">
                    <div class="flex items-center justify-between gap-6 p-5 rounded-2xl border-2 border-white/30 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                      <div class="flex-1 min-w-0">
                        <div class="text-16px font-semibold text-gray-900 dark:text-white mb-2">
                          {{ item.title }}
                        </div>
                        <div class="text-14px text-gray-600 dark:text-gray-300">
                          {{ item.description }}
                        </div>
                      </div>
                      
                      <!-- 选择器控件 -->
                      <div v-if="item.type === 'select'" class="flex-shrink-0">
                        <el-select
                          :model-value="item.value.value"
                          size="small"
                          style="width: 220px"
                          class="setting-select"
                          popper-class="settings-select-dropdown"
                          @change="(value) => handleSelectChange(item, value)"
                        >
                          <el-option
                            v-for="option in item.options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          >
                            <div class="model-option-item">
                              <div class="model-option-title">{{ option.label }}</div>
                              <div class="model-option-desc">{{ option.description }}</div>
                              <div v-if="option.value === 'deepseek-v3.2'" class="model-option-check">✓</div>
                            </div>
                          </el-option>
                        </el-select>
                      </div>
                      
                      <!-- 开关控件 -->
                      <div v-if="item.type === 'switch'" class="flex-shrink-0">
                        <el-switch
                          :model-value="item.value.value"
                          class="custom-switch"
                          @change="(value) => handleSwitchChange(item, value)"
                        />
                      </div>
                      
                      <!-- 数字输入控件 -->
                      <div v-if="item.type === 'number'" class="flex-shrink-0">
                        <el-input-number
                          :model-value="item.value.value"
                          :min="item.min"
                          :max="item.max"
                          size="small"
                          controls-position="right"
                          @change="(value) => handleNumberChange(item, value)"
                        />
                      </div>
                      
                      <!-- 信息显示 -->
                      <div v-if="item.type === 'info'" class="flex-shrink-0">
                        <span class="text-15px font-medium text-orange-500 dark:text-orange-400">{{ item.value }}</span>
                      </div>
                      
                      <!-- 按钮控件 -->
                      <div v-if="item.type === 'button'" class="flex-shrink-0">
                        <el-button
                          type="primary"
                          size="small"
                          class="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-md hover:shadow-lg"
                          @click="handleSettingClick(item)"
                        >
                          {{ item.title }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
/* 模态框动画 */
.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.settings-modal-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(10px);
}

.settings-modal-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.6);
}

.settings-modal-container {
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 分类导航样式 */
.category-nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.category-nav::-webkit-scrollbar {
  width: 4px;
}

.category-nav::-webkit-scrollbar-track {
  background: transparent;
}

.category-nav::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

/* 设置内容区域样式 */
.settings-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  border: 1px solid var(--el-border-color-light);
}

/* 确保下拉菜单不被遮挡 */
.setting-control {
  position: relative;
  z-index: 10;
}

.setting-control .el-select {
  z-index: 100;
}

/* 全局下拉菜单样式 */
:deep(.el-select-dropdown) {
  z-index: 3000 !important;
}

:deep(.el-popper) {
  z-index: 3000 !important;
}

/* 设置对话框中的下拉菜单样式 */
:deep(.settings-select-dropdown) {
  z-index: 3000 !important;
  margin-top: 4px !important;
  min-width: 280px;
}

/* 模型选项样式 */
:deep(.model-option-item) {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 8px 0;
}

:deep(.model-option-title) {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

:deep(.model-option-desc) {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

:deep(.model-option-check) {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  color: #f59e0b;
  font-size: 16px;
  font-weight: bold;
}

/* 自定义选择器样式 */
:deep(.setting-select) {
  .el-input__wrapper {
    border-radius: 8px;
    border-color: #f59e0b;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .el-input__wrapper:hover {
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
    border-color: #d97706;
  }
  
  .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
    border-color: #d97706;
  }
}

.settings-content::-webkit-scrollbar {
  width: 6px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* 卡片选择器样式 */
.card-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.card-option:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-option.selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.card-option.selected::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--el-color-primary);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 颜色选择器样式 */
.color-option {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
}

.color-option:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.color-option.selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.3);
}

.color-option.selected::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  color: var(--el-color-primary);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

/* 语言切换器样式 */
.language-switcher-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.language-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.language-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.language-btn:active {
  transform: translateY(0) scale(0.98);
}

/* 选中状态样式 - 无背景颜色 */
.language-btn.selected {
  border-color: #f59e0b;
  color: #92400e;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3), 0 4px 16px rgba(245, 158, 11, 0.2);
}

.language-btn.selected:hover {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.4), 0 6px 20px rgba(245, 158, 11, 0.3);
}

/* 深色模式适配 */
:global(.dark) .language-btn.selected {
  border-color: #f59e0b;
  color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.3);
}

:global(.dark) .language-btn.selected:hover {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.5), 0 6px 20px rgba(245, 158, 11, 0.4);
}

/* 未选中状态样式 */
.language-btn:not(.selected) {
  border-color: rgba(209, 213, 219, 0.5);
  color: #374151;
}

.language-btn:not(.selected):hover {
  border-color: #f59e0b;
  color: #92400e;
}

:global(.dark) .language-btn:not(.selected) {
  border-color: rgba(75, 85, 99, 0.5);
  color: #d1d5db;
}

:global(.dark) .language-btn:not(.selected):hover {
  border-color: #f59e0b;
  color: #fbbf24;
}

/* 自定义开关样式 - 黄色主题 */
:deep(.custom-switch) {
  .el-switch__core {
    border-radius: 12px;
    height: 24px;
    min-width: 48px;
    border: none;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
  }
  
  .el-switch__action {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    top: 1px;
    left: 1px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
    border: none;
  }
  
  &.is-checked {
    .el-switch__core {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3);
    }
    
    .el-switch__action {
      left: calc(100% - 21px);
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
  
  /* 深色模式适配 - 黄色主题 */
  :global(.dark) & {
    .el-switch__core {
      background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.05);
    }
    
    .el-switch__action {
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    &.is-checked {
      .el-switch__core {
        background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.8), inset 0 1px 3px rgba(255, 255, 255, 0.4);
      }
      
      .el-switch__action {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  &:hover {
    .el-switch__core {
      transform: scale(1.08);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  &:active {
    .el-switch__core {
      transform: scale(0.95);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-modal-container {
    width: 95vw !important;
    height: 90vh !important;
  }
  
  .modal-content {
    flex-direction: column;
    height: auto !important;
  }
  
  .category-nav {
    width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid rgba(229, 231, 235, 1);
  }
  
  .category-nav .p-4 {
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }
  
  .category-item {
    min-width: 120px;
    flex-shrink: 0;
  }
  
  .card-select-group .grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .color-select-group .grid {
    grid-template-columns: repeat(6, 1fr) !important;
  }
}
</style>

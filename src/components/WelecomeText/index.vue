<!-- 欢迎提示词 -->
<script setup lang="ts">
import { Typewriter } from 'vue-element-plus-x';
import { useTimeGreeting } from '@/hooks/useTimeGreeting';
import { useUserStore } from '@/stores';
import { useLanguageStore } from '@/stores/modules/language';

const greeting = useTimeGreeting();
const userStore = useUserStore();
const languageStore = useLanguageStore();

const username = computed(() => userStore.userInfo?.username ?? '我是 Element Plus X');

// 根据语言生成不同的问候语
const greetingText = computed(() => {
  if (languageStore.currentLanguage === 'en') {
    return `Good ${greeting.value}, ${username.value}, what would you like to chat about?`;
  }
  else {

    return `${greeting.value}好，${username.value}，想和我聊点什么？`;
  }
});
</script>

<template>
  <div
    class="welcome-text w-full flex flex-wrap items-center justify-center text-center text-lg font-semibold mb-32px mt-12px font-size-32px line-height-32px"
    :style="{ color: 'var(--el-text-color-primary)', marginTop: '-50px', padding: '20px 0' }"
  >
    <Typewriter
      :content="greetingText"
      :typing="{
        step: 2,
        interval: 45,
      }"
      :is-fog="{
        bgColor: 'var(--el-bg-color)',
      }"
    />
  </div>
</template>

<style scoped lang="scss">
:deep {
  .typer-container {
    overflow: initial;
  }
}
</style>

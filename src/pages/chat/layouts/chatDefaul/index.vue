<!-- 默认消息列表页 -->
<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { onMounted } from 'vue';
import FilesSelect from '@/components/FilesSelect/index.vue';
import ModelSelect from '@/components/ModelSelect/index.vue';
import WelecomeText from '@/components/WelecomeText/index.vue';
import { useUserStore } from '@/stores';
import { useFilesStore } from '@/stores/modules/files';
import { useSessionStore } from '@/stores/modules/session';

const userStore = useUserStore();
const sessionStore = useSessionStore();

onMounted(async () => {
  await sessionStore.ensureDefaultSession();
});
const filesStore = useFilesStore();

const senderValue = ref('');
const senderRef = ref();

async function handleSend() {
  if (!senderValue.value.trim())
    return;

  // 检查登录状态
  if (!userStore.token) {
    userStore.openLoginDialog();
    ElMessage.warning('请先登录后再进行对话');
    return;
  }

  localStorage.setItem('chatContent', senderValue.value);
  await sessionStore.createSessionList({
    userId: userStore.userInfo?.userId as number,
    sessionContent: senderValue.value,
    sessionTitle: senderValue.value.slice(0, 10),
    remark: senderValue.value.slice(0, 10),
  });

  // 发送后清空输入框和文件列表
  senderValue.value = '';
  filesStore.setFilesList([]);
}

function handleDeleteCard(_item: FilesCardProps, index: number) {
  filesStore.deleteFileByIndex(index);
}

watch(
  () => filesStore.filesList.length,
  (val) => {
    if (val > 0) {
      nextTick(() => {
        senderRef.value.openHeader();
      });
    }
    else {
      nextTick(() => {
        senderRef.value.closeHeader();
      });
    }
  },
);
</script>

<template>
  <div class="chat-defaul-wrap">
    <WelecomeText />
    <Sender
      ref="senderRef"
      v-model="senderValue"
      class="chat-defaul-sender"
      :auto-size="{
        maxRows: 9,
        minRows: 3,
      }"
      variant="updown"
      clearable
      allow-speech
      @submit="handleSend"
    >
      <template #header>
        <div class="sender-header p-12px pt-6px pb-0px">
          <Attachments
            :items="filesStore.filesList"
            :hide-upload="true"
            @delete-card="handleDeleteCard"
          >
            <template #prev-button="{ show, onScrollLeft }">
              <div
                v-if="show"
                class="prev-next-btn left-8px flex-center w-22px h-22px rounded-8px font-size-10px"
                @click="onScrollLeft"
              >
                <el-icon>
                  <ArrowLeftBold />
                </el-icon>
              </div>
            </template>

            <template #next-button="{ show, onScrollRight }">
              <div
                v-if="show"
                class="prev-next-btn right-8px flex-center w-22px h-22px rounded-8px font-size-10px"
                @click="onScrollRight"
              >
                <el-icon>
                  <ArrowRightBold />
                </el-icon>
              </div>
            </template>
          </Attachments>
        </div>
      </template>
      <template #prefix>
        <div class="flex-1 flex items-center gap-8px flex-none w-fit overflow-hidden">
          <FilesSelect />
          <ModelSelect />
        </div>
      </template>
    </Sender>
  </div>
</template>

<style scoped lang="scss">
.chat-defaul-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  min-height: 450px;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  
  .chat-defaul-sender {
    width: 100%;
  }
}

/* 深色模式适配 */
:global(.dark-mode) .chat-defaul-wrap {
  /* 深色模式下的特殊样式 */
}

/* 修复按钮样式，使用主题变量 */
:deep(.prev-next-btn) {
  border: 1px solid var(--el-border-color-light) !important;
  color: var(--el-text-color-secondary) !important;
  background-color: var(--el-fill-color-light) !important;
  
  &:hover {
    background-color: var(--el-fill-color) !important;
  }
}
</style>

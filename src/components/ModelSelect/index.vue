<!-- 切换模型 -->
<script setup lang="ts">
import type { GetSessionListVO } from '@/api/model/types';
import Popover from '@/components/Popover/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useModelStore } from '@/stores/modules/model';

const modelStore = useModelStore();

onMounted(async () => {
  await modelStore.requestModelList();
  // 设置默认模型
  if (
    modelStore.modelList.length > 0
    && (!modelStore.currentModelInfo || !modelStore.currentModelInfo.modelName)
  ) {
    modelStore.setCurrentModelInfo(modelStore.modelList[0]);
  }
});

const currentModelName = computed(
  () => modelStore.currentModelInfo && modelStore.currentModelInfo.modelName,
);
const currentModelRemark = computed(
  () => modelStore.currentModelInfo && modelStore.currentModelInfo.remark,
);
const popoverList = computed(() => modelStore.modelList);

/* 弹出面板 开始 */
const popoverStyle = ref({
  width: '400px',
  padding: '0',
  height: 'fit-content',
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  opacity: 1,
  zIndex: 9999,
});
const popoverRef = ref();

// 显示
async function showPopover() {
  // 获取最新的模型列表
  await modelStore.requestModelList();
}

// 点击
function handleClick(item: GetSessionListVO) {
  modelStore.setCurrentModelInfo(item);
  popoverRef.value?.hide?.();
}
</script>

<template>
  <div class="model-select">
    <Popover
      ref="popoverRef"
      placement="bottom-start"
      :offset="[0, 8]"
      popover-class="model-select-popover"
      :popover-style="popoverStyle"
      trigger="clickTarget"
      @show="showPopover"
    >
      <!-- 触发元素插槽 -->
      <template #trigger>
        <div class="model-select-btn flex items-center gap-6px px-12px py-5px rounded-full bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all">
          <SvgIcon name="models" size="14" color="#666666" />
          <span class="font-medium text-sm text-gray-700">{{ currentModelName }}</span>
          <span class="text-yellow-600 font-bold text-sm">√</span>
          <SvgIcon name="arrow-down" size="12" color="#666666" />
        </div>
      </template>

      <div class="model-select-dropdown">
          <div 
            v-for="item in popoverList" 
            :key="item.id" 
            class="model-option flex items-center gap-10px p-12px cursor-pointer transition-all duration-200 border-l-4 border-transparent group"
            :class="{
              'bg-yellow-100 border-yellow-500 shadow-sm': item.modelName === currentModelName,
              'hover:bg-yellow-50 hover:border-yellow-300': item.modelName !== currentModelName
            }"
            @click="handleClick(item)"
          >
            <div class="flex-1">
              <div class="model-name text-base font-medium mb-4px whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2" :class="{'text-yellow-700 font-semibold': item.modelName === currentModelName, 'text-gray-900': item.modelName !== currentModelName}">
                {{ item.modelName }}
                <span v-if="item.modelName === currentModelName" class="text-yellow-600 font-bold text-lg">√</span>
                <SvgIcon v-if="item.modelName === currentModelName" name="check" size="14" color="#d97706" />
                <SvgIcon v-else class="opacity-0 group-hover:opacity-100 transition-opacity" name="check" size="14" color="#ca8a04" />
              </div>
              <div class="model-desc text-sm line-clamp-1" :class="{'text-yellow-600': item.modelName === currentModelName, 'text-gray-500': item.modelName !== currentModelName}">{{ item.description || item.remark || '暂无描述' }}</div>
            </div>
          </div>
        </div>
    </Popover>
  </div>
</template>

<style scoped lang="scss">
.model-select-popover {
  overflow: hidden;
}

.model-select-dropdown {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.model-option {
  position: relative;
  
  &:first-child {
    padding-top: 16px;
  }
  &:last-child {
    padding-bottom: 16px;
  }
  
  &:hover {
    transform: translateX(2px);
  }
  
  &.bg-yellow-100 {
    &:hover {
      background-color: #fef3c7 !important;
      transform: translateX(0);
    }
  }
  
  // 鼠标悬停时的黄色背景效果
  &:not(.bg-yellow-100):hover {
    background-color: #fefce8 !important; // 更亮的黄色
    border-left-color: #fbbf24 !important; // 更深的黄色边框
    
    .model-name {
      color: #92400e !important; // 深黄色文字
    }
    
    .model-desc {
      color: #b45309 !important; // 深黄色描述文字
    }
  }
}
</style>

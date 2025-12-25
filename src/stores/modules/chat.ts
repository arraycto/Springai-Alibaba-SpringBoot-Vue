import type { ChatMessageVo } from '@/api/chat/types';
import { defineStore } from 'pinia';
import { getChatList } from '@/api';
import { useUserStore } from './user';

export const useChatStore = defineStore('chat', () => {
  const userStore = useUserStore();

  // 用户头像
  const avatar = computed(() => {
    const userInfo = userStore.userInfo;
    return userInfo?.avatar || 'https://avatars.githubusercontent.com/u/76239030?v=4';
  });

  // 是否开启深度思考
  const isDeepThinking = ref<boolean>(false);

  const setDeepThinking = (value: boolean) => {
    isDeepThinking.value = value;
  };

  // 会议ID对应-聊天记录 map对象
  const chatMap = ref<Record<string, ChatMessageVo[]>>({});

  const setChatMap = (id: string, data: any[]) => {
    chatMap.value[id] = data?.flatMap((session: any) => {
      if (!session.content || !Array.isArray(session.content)) {
        return [];
      }

      return session.content.map((message: any, index: number) => {
        // 处理不同的消息格式
        let content = '';
        let role = '';

        if (message.type === 'USER' && message.contents) {
          // USER 类型消息
          content = message.contents.map((c: any) => c.text).join('');
          role = 'user';
        }
        else if (message.type === 'AI' && message.text) {
          // AI 类型消息
          content = message.text;
          role = 'system';
        }
        else if (message.text) {
          // 直接文本消息
          content = message.text;
          role = message.type === 'AI' ? 'system' : 'user';
        }

        const isUser = role === 'user';
        const thinkContent = extractThkContent(content);

        return {
          id: session.id ? `${session.id}-${index}` : `msg-${index}`,
          key: session.id ? `${session.id}-${index}` : `msg-${index}`,
          role,
          content: extractThkContentAfter(content),
          reasoning_content: thinkContent,
          placement: isUser ? 'end' : 'start',
          isMarkdown: !isUser,
          avatar: isUser
            ? avatar
            : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          avatarSize: '32px',
          typing: false,
          thinkingStatus: 'end',
          thinlCollapse: false,
        };
      });
    }) || [];
  };

  // 获取当前会话的聊天记录
  const requestChatList = async (sessionId: string) => {
    // 如果没有 token 则不查询聊天记录
    if (!userStore.token)
      return;
    try {
      const res = await getChatList({
        sessionId,
        userId: userStore.userInfo?.userId as number,
      });
      console.log('聊天记录API返回:', res); // 调试信息
      if (res.rows) {
        setChatMap(sessionId, res.rows);
      }
    }
    catch (error) {
      console.error('getChatList:', error);
    }
  };

  // 对思考中的内容回显做处理
  function extractThkContent(content: string) {
    const regex = /<think>(.*?)<\/think>/s;
    const matchResult = content.match(regex);
    // 把这些内容从 content 中移除
    content = content.replace(regex, '');
    return matchResult?.[1] ?? '';
  }

  // 如果有 </think> 标签，则把 </think> 之后的 内容从 content 中返回
  function extractThkContentAfter(content: string) {
    if (!content.includes('</think>')) {
      return content;
    }
    const regex = /<\/think>(.*)/s;
    const matchResult = content.match(regex);
    // 把这些内容从 content 中移除
    content = content.replace(regex, '');
    return matchResult?.[1] ?? '';
  }

  return {
    chatMap,
    requestChatList,
    isDeepThinking,
    setDeepThinking,
  };
});

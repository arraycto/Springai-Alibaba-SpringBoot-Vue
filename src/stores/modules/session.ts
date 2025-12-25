import type { ChatSessionVo, CreateSessionDTO, GetSessionListParams } from '@/api/session/types';
import { ChatLineRound } from '@element-plus/icons-vue';
import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { useRouter } from 'vue-router';
import {
  create_session,
  delete_session,
  get_session,
  get_session_list,
  update_session,
} from '@/api';
import { useUserStore } from './user';

export const useSessionStore = defineStore('session', () => {
  const router = useRouter();
  const userStore = useUserStore();

  // 当前选中的会话信息
  const currentSession = ref<ChatSessionVo | null>(null);
  // 设置当前会话
  const setCurrentSession = (session: ChatSessionVo | null) => {
    currentSession.value = session;
  };

  // 会话列表核心状态
  const sessionList = ref<ChatSessionVo[]>([]); // 会话数据列表
  const currentPage = ref(1); // 当前页码（从1开始）
  const pageSize = ref(25); // 每页显示数量
  const hasMore = ref(true); // 是否还有更多数据
  const isLoading = ref(false); // 全局加载状态（初始加载/刷新）
  const isLoadingMore = ref(false); // 加载更多状态（区分初始加载）

  // 获取会话列表（核心分页方法）
  const requestSessionList = async (page: number = currentPage.value, force: boolean = false) => {
    // 如果没有token就直接清空
    if (!userStore.token) {
      sessionList.value = [];
      return;
    }

    if (!force && ((page > 1 && !hasMore.value) || isLoading.value || isLoadingMore.value))
      return;

    isLoading.value = page === 1; // 第一页时标记为全局加载
    isLoadingMore.value = page > 1; // 非第一页时标记为加载更多

    try {
      const params: GetSessionListParams = {
        userId: userStore.userInfo?.userId as number,
        pageNum: page,
        pageSize: pageSize.value,
        isAsc: 'desc',
        orderByColumn: 'createTime',
      };

      const resArr = await get_session_list(params);

      // 预处理会话分组 并添加前缀图标
      const res = processSessions(resArr.data.rows);

      const allSessions = new Map(sessionList.value.map(item => [item.id, item])); // 现有所有数据
      res.forEach(item => allSessions.set(item.id, { ...item })); // 更新/添加数据

      // 按服务端排序重建列表（假设分页数据是按时间倒序，第一页是最新，后续页依次递减）
      // 此处需根据接口返回的排序规则调整，假设每页数据是递增的（第一页最新，第二页次新，第三页 oldest）
      if (page === 1) {
        // 第一页是最新数据
        if (force) {
          // 强制刷新：直接覆盖列表，避免保留已删除的旧数据
          sessionList.value = [...res];
        }
        else {
          // 非强制刷新：保留未被第一页覆盖的旧数据
          sessionList.value = [
            ...res, // 新的第一页数据（最新）
            ...Array.from(allSessions.values()).filter(item => !res.some(r => r.id === item.id)), // 保留未被第一页覆盖的旧数据
          ];
        }
      }
      else {
        // 非第一页数据是更旧的数据，追加到列表末尾
        sessionList.value = [
          ...sessionList.value.filter(item => !res.some(r => r.id === item.id)), // 保留现有数据（除了被当前页更新的）
          ...res, // 追加当前页的新数据（更旧的）
        ];
      }

      // 判断是否还有更多数据（当前页数据量 < pageSize 则无更多）
      hasMore.value = (res?.length || 0) === pageSize.value;
      currentPage.value = page; // 更新页码
    }
    catch (error) {
      console.error('requestSessionList错误:', error);
    }
    finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  };

  // 发送消息后创建新会话
  const createSessionList = async (data: Omit<CreateSessionDTO, 'id'>): Promise<string | null> => {
    if (!userStore.token) {
      router.replace({
        name: 'chatWithId',
        params: {
          id: 'not_login',
        },
      });
      return null;
    }

    try {
      // 生成sessionId并添加到请求数据中
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const requestData = {
        ...data,
        sessionId,
      };

      const res = await create_session(requestData);
      console.log('create_session API响应:', res);

      // 检查API返回的数据结构
      let newSessionId: string;
      if (res.data && typeof res.data === 'object') {
        // 如果返回的是对象，尝试获取id字段
        newSessionId = res.data.id || res.data.sessionId || sessionId;
      }
      else {
        // 如果返回的是字符串或数字，直接使用
        newSessionId = `${res.data}` || sessionId;
      }

      console.log('解析后的sessionId:', newSessionId);

      // 如果API没有返回有效的sessionId，使用我们生成的sessionId
      if (!newSessionId || newSessionId === 'undefined') {
        console.warn('API未返回有效sessionId，使用生成的ID');
        newSessionId = sessionId;
      }

      // 创建会话后强制刷新第一页数据，确保新会话立即显示在列表顶部
      await requestSessionList(1, true);

      // 如果是临时ID，不需要调用get_session
      if (newSessionId.startsWith('chat_')) {
        setCurrentSession({
          id: newSessionId,
          sessionTitle: data.sessionTitle || '新对话',
          userId: data.userId,
          createTime: new Date(),
        } as ChatSessionVo);
      }
      else {
        // 并将当前勾选信息设置为新增的会话信息
        const newSessionRes = await get_session(newSessionId);
        setCurrentSession(newSessionRes.data);
      }

      // 直接在这里跳转，确保sessionId正确传递
      router.replace({
        name: 'chatWithId',
        params: { id: newSessionId },
      });

      return newSessionId; // 返回新创建的sessionId
    }
    catch (error) {
      console.error('createSessionList错误:', error);
      return null;
    }
  };

  // 创建新对话（按钮点击）
  const createSessionBtn = async () => {
    try {
      // 清空当前选中会话信息
      setCurrentSession(null);
      // 创建新会话并获取sessionId
      await createSessionList({
        sessionTitle: '新对话',
        userId: userStore.userInfo?.userId as number,
        sessionId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
      // 强制刷新会话列表，确保新会话立即显示
      await requestSessionList(1, true);
    }
    catch (error) {
      console.error('createSessionBtn错误:', error);
    }
  };

  // 加载更多会话（供组件调用）
  const loadMoreSessions = async () => {
    if (hasMore.value)
      await requestSessionList(currentPage.value + 1);
  };

  // 更新会话（供组件调用）
  const updateSession = async (item: ChatSessionVo) => {
    try {
      await update_session(item);
      // 1. 先找到被修改会话在 sessionList 中的索引（假设 sessionList 是按服务端排序的完整列表）
      const targetIndex = sessionList.value.findIndex(session => session.id === item.id);
      // 2. 计算该会话所在的页码（页大小固定为 pageSize.value）
      const targetPage
        = targetIndex >= 0
          ? Math.floor(targetIndex / pageSize.value) + 1 // 索引从0开始，页码从1开始
          : 1; // 未找到时默认刷新第一页（可能因排序变化导致位置改变）
      // 3. 刷新目标页数据
      await requestSessionList(targetPage, true);
    }
    catch (error) {
      console.error('updateSession错误:', error);
    }
  };

  // 删除会话（供组件调用）
  const deleteSessions = async (ids: string[]) => {
    try {
      await delete_session(ids);
      // 强制刷新第一页数据，确保列表立即更新
      await requestSessionList(1, true);
    }
    catch (error) {
      console.error('deleteSessions错误:', error);
    }
  };

  // 首次进入时确保有默认会话
  const ensureDefaultSession = async () => {
    try {
      // 无 token 不处理
      if (!userStore.token)
        return;
      // 拉取第一页
      await requestSessionList(1, true);
      // 如果列表为空则创建一个默认会话
      if (!sessionList.value || sessionList.value.length === 0) {
        await createSessionList({
          sessionTitle: '新对话',
          userId: userStore.userInfo?.userId as number,
          sessionId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });
      }
      // 在默认路径下，不自动设置当前会话，保持第一个对话不被选中
      // 只有当有具体的sessionId时才设置当前会话
    }
    catch (error) {
      console.error('ensureDefaultSession错误:', error);
    }
  };

  // 在获取会话列表后添加预处理逻辑（示例）
  function processSessions(sessions: any[]) {
    const currentDate = new Date();

    return sessions.map((session) => {
      const createDate = new Date(session.createdAt!);
      const diffDays = Math.floor(
        (currentDate.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // 生成原始分组键（用于排序和分组）
      let group: string;
      if (diffDays < 7) {
        group = '7 天内'; // 用数字前缀确保排序正确
      }
      else if (diffDays < 30) {
        group = '30 天内';
      }
      else {
        const year = createDate.getFullYear();
        const month = String(createDate.getMonth() + 1).padStart(2, '0');
        group = `${year}-${month}`; // 格式：2025-05
      }

      return {
        ...session,
        id: session.sessionId, // 使用 sessionId 作为 id
        sessionTitle: session.sessionName, // 将 sessionName 映射到 sessionTitle
        createTime: session.createdAt, // 将 createdAt 映射到 createTime
        group, // 新增分组键字段
        prefixIcon: markRaw(ChatLineRound), // 图标为静态组件，使用 markRaw 标记为静态组件
      };
    });
  }

  return {
    // 当前选中的会话
    currentSession,
    // 设置当前会话
    setCurrentSession,
    // 列表状态
    sessionList,
    currentPage,
    pageSize,
    hasMore,
    isLoading,
    isLoadingMore,
    // 列表方法
    createSessionBtn,
    createSessionList,
    requestSessionList,
    loadMoreSessions,
    updateSession,
    deleteSessions,
    ensureDefaultSession,
  };
});

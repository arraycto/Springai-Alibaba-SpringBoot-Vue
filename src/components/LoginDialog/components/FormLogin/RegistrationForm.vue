<!-- 注册表单 -->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import type { RegisterDTO } from '@/api/auth/types';
import { reactive, ref } from 'vue';
import { register } from '@/api';
import { useLoginFormStore } from '@/stores/modules/loginForm';

const loginFromStore = useLoginFormStore();

const formRef = ref<FormInstance>();

const formModel = ref<RegisterDTO>({
  email: '',
  username: '',
  password: '',
});

const rules = reactive<FormRules<RegisterDTO>>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (!isEmail(value)) {
          return new Error('请输入正确的邮箱');
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

function isEmail(email: string) {
  const emailRegex = /^[\w.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return emailRegex.test(email);
}
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    const params: RegisterDTO = {
      email: formModel.value.email,
      username: formModel.value.username,
      password: formModel.value.password,
    };
    await register(params);
    ElMessage.success('注册成功');
    formRef.value?.resetFields();
  }
  catch (error) {
    console.error('请求错误:', error);
  }
}
</script>

<template>
  <div class="custom-form">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      style="width: 230px"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="email">
        <el-input v-model="formModel.email" placeholder="请输入邮箱" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Message />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="username">
        <el-input v-model="formModel.username" placeholder="请输入用户名" autocomplete="off">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="formModel.password" placeholder="请输入密码" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Unlock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width: 100%" native-type="submit">
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 返回登录 -->
    <div class="form-tip font-size-12px flex items-center">
      <span>已有账号，</span>
      <span
        class="c-[var(--el-color-primar,#409eff)] cursor-pointer"
        @click="loginFromStore.setLoginFormType('AccountPassword')"
      >
        返回登录
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
.login-btn {
  padding: 12px;
  margin-top: 24px;
  color: white;
  cursor: pointer;
  background: #409eff;
  border: none;
  border-radius: 4px;
}
</style>

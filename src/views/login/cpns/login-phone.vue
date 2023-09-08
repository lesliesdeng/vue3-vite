<template>
  <el-form label-width="0">
    <el-form-item label="">
      <el-input placeholder="请输入手机号码" v-model="phone.phone" />
    </el-form-item>
    <el-form-item label="" prop="code" v-model="phone.code">
      <div class="code-box">
        <el-input placeholder="请输入验证码" />
        <img
          alt="验证码"
          :src="`oauth/api/v1/captcha-complex?rid=${new Date().getTime()}&organization_id=${
            loginConfig.organizationId
          }`"
        />
      </div>
    </el-form-item>
    <el-form-item label="">
      <div class="verify-code">
        <el-input placeholder="请输入图形验证码" v-model="phone.pword" />
        <el-button class="get-btn" type="primary">获取验证码</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store/index'

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore()
    const phone = computed({
      get: () => props.modelValue,
      set: (newValue) => emit('update:modelValue', newValue)
    })
    const loginConfig = computed(() => store.state.login.loginConfig)
    return { loginConfig, phone }
  }
})
</script>

<style scoped lang="less">
.verify-code {
  display: flex;

  .get-btn {
    margin-left: 8px;
  }
}
.code-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    margin-left: 10px;
    width: 100px;
    height: 40px;
  }
}
</style>

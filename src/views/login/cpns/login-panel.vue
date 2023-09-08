<template>
  <div class="login-panel-box">
    <div class="login-panel">
      <el-tabs type="border-card" v-model="currentTab" stretch>
        <el-tab-pane name="account">
          <template #label>
            <span><i class="el-icon-user-solid"></i> 账号登录</span>
          </template>
          <login-account v-model="account" ref="accountRef" />
        </el-tab-pane>
        <el-tab-pane name="phone">
          <template #label>
            <span><i class="el-icon-mobile-phone"></i> 手机登录</span>
          </template>
          <login-phone ref="phoneRef" v-model="phoneForm" />
        </el-tab-pane>
      </el-tabs>
      <div class="control-account">
        <el-checkbox v-model="isKeep">记住密码</el-checkbox>
        <el-link type="primary">忘记密码</el-link>
      </div>
      <el-button type="primary" class="login-btn" @click="loginAction">立即登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, computed } from 'vue'
import localCache from '@/utils/cache'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import LoginAccount from './login-account.vue'
import LoginPhone from './login-phone.vue'

export default defineComponent({
  components: {
    LoginAccount,
    LoginPhone
  },
  setup() {
    const currentTab = ref('account')
    const isKeep = ref(true)
    const loginConfig = computed(() => store.state.login.loginConfig)

    const account = reactive({
      name: '',
      password: ''
    })

    const phoneForm = reactive({
      phone: '',
      code: '',
      pword: ''
    })
    const store = useStore()
    const route = useRoute()
    const loginAction = () => {
      const { key } = route.params
      // 参数1：用户端   0：管理端
      store.dispatch('login/afterLoginAction', {
        menuType: 1,
        key
        // 登录方式
        // loginType: '1'
      })
    }
    onMounted(() => {
      // loginAction()
    })

    return {
      loginAction,
      currentTab,
      isKeep,
      account,
      phoneForm
    }
  }
})
</script>

<style lang="less" scoped>
.login-panel-box {
  position: relative;
  width: auto;
  width: 1400px;
  min-width: 1000px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.login-panel {
  background-color: #fff;
  padding: 30px;
  width: 330px;
  margin-bottom: 150px;

  .title {
    text-align: center;
  }

  .control-account {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }

  .login-btn {
    margin-top: 10px;
    width: 100%;
  }
}
</style>

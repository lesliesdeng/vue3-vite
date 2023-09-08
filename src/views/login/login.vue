<template>
  <div
    class="login"
    :style="{
      'background-image': `url(${loginConfig.mainSite}/${loginConfig.loginPageConfig.background})`
    }"
  >
    <login-panel />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from '@/store/index'
import { useRoute } from 'vue-router'
import LoginPanel from './cpns/login-panel.vue'

import { encrypt } from '@/utils/aes'

export default defineComponent({
  components: {
    LoginPanel
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const loginConfig = computed(() => store.state.login.loginConfig)
    onMounted(() => {
      store.dispatch('login/getLoginConfigAction', {
        key: encrypt(route.params.key)
      })
    })

    return {
      loginConfig
    }
  }
})
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>

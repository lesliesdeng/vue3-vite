<template>
  <div id="app">
    <el-config-provider :locale="zhCN" :z-index="10001">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import zhCN from 'element-plus/dist/locale/zh-cn.mjs'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    return {
      zhCN
    }
  }
})
</script>

<style lang="less">
#app {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    segoe ui,
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  width: 100%;
  height: 100%;
  cursor: default;
}
:root {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    segoe ui,
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}

*,
::after,
::before {
  font-family: inherit;
}
</style>

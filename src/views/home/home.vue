<template>
  <div class="main">
    <el-container class="main-content">
      <el-container class="page">
        <el-header class="page-header">
          <nav-header :menuType="1" />
        </el-header>
        <el-main class="page-content">
          <div class="content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavHeader from '@/components/nav-header'

export default defineComponent({
  components: {
    NavHeader
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="less">
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-content,
.page {
  height: 100%;
}
.page-content {
  height: calc(100% - 48px);
  overflow-x: hidden;
  .content {
    background-color: #fff;
    // border-radius: 8px;
    height: 100%;
  }
}

.el-header,
.el-footer {
  display: flex;
  color: #333;
  text-align: center;
  align-items: center;
}

.el-header {
  height: 50px !important;
}

.el-aside {
  width: 180px;
  overflow-x: hidden;
  overflow-y: hidden;
  line-height: 200px;
  text-align: left;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-main {
  color: #333;
  text-align: center;
  padding: 0;
}
</style>

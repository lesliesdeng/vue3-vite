<template>
  <div class="main">
    <el-container class="main-content">
      <el-container class="page">
        <el-header class="page-header">
          <div class="logo">
            <img src="~@/assets/img/menu-logo.png" class="img" />
          </div>
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
import { defineComponent } from 'vue'
import router from '@/router'
import { fullScreenToRoutes } from '@/utils/map-menu'
import NavHeader from '@/components/nav-header'

export default defineComponent({
  components: {
    NavHeader
  },
  setup() {
    const fullRoutes = fullScreenToRoutes()
    fullRoutes.forEach((route) => {
      // 注册全局路由
      router.addRoute('full-screen', route)
    })

    return {}
  }
})
</script>

<style scoped lang="less">
.logo {
  display: flex;
  height: 50px;
  width: 210px;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .img {
    width: 100%;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    color: #0a60bd;
  }
}
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
.page-content:hover {
  overflow-y: overlay;
}
.page-content {
  height: calc(100% - 48px);
  .content {
    background-color: #f4f4f4;
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
.el-main {
  color: #333;
  text-align: center;
  padding: 0;
}
</style>

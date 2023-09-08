<template>
  <div class="main">
    <el-container class="main-content">
      <el-aside>
        <nav-menu :menusList="menusList" />
      </el-aside>
      <el-container class="page">
        <el-header class="page-header">
          <nav-header-admin @menuChange="menuChange" />
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
import { useStore } from '@/store'

export default defineComponent({
  components: {},
  setup() {
    const store = useStore()
    const menusList = ref()
    const menuChange = (menus: any) => {
      menusList.value = menus
    }
    onMounted(() => {
      store.dispatch('system/getUserGrade')
    })
    return {
      menusList,
      menuChange
    }
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
  padding-left: 0 !important;
}

.el-aside {
  width: 180px;
  overflow-x: hidden;
  overflow-y: hidden;
  line-height: 200px;
  text-align: left;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */

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

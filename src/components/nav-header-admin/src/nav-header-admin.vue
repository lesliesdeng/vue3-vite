<template>
  <div class="nav-header">
    <div class="content">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-admin"
        mode="horizontal"
        background-color="#0084cf"
        text-color="#fff"
        active-text-color="#fff"
        @select="handleSelect"
      >
        <el-menu-item v-for="menu in menus" :key="menu.id" @click="handleSelect(menu)">{{
          menu.name
        }}</el-menu-item>
      </el-menu>
      <span></span>
      <nav-info-admin />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useRoute } from 'vue-router'
// import { useStore } from '@/store'
import localCache from '@/utils/cache'

import NavInfoAdmin from './nav-info-admin.vue'

export default defineComponent({
  props: {
    menuType: {
      type: Number
    }
  },
  components: {
    NavInfoAdmin
  },
  emits: ['menuChange'],
  setup(props, { emit }) {
    const menus = localCache.getCache('adminMenus')
    const activeIndex = ref(window.location.hash.split('#')[1].split('?')[0])
    const handleSelect = (item: any) => {
      emit('menuChange', item.children)
    }

    return {
      handleSelect,
      activeIndex,
      menus
    }
  }
})
</script>

<style scoped lang="less">
.nav-header {
  display: flex;
  align-items: center;
  flex: 1;

  .menu-icon {
    font-size: 28px;
    cursor: pointer;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding-right: 18px;
  }
  .el-menu-admin {
    .el-menu-item {
      height: 50px !important;
    }
  }
}
</style>

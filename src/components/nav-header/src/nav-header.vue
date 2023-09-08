<template>
  <div class="nav-header">
    <!-- <i @click="handleFoldClick" class="menu-icon">
      <el-icon v-if="isFold"><Fold /></el-icon>
      <el-icon v-if="!isFold"><Expand /></el-icon>
    </i> -->

    <div class="content">
      <!-- <hy-breadcrumb :breadcrumbs="breadcrumbs" /> -->
      <span></span>
      <nav-info :menuType="menuType" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { useRoute } from 'vue-router'
// import { useStore } from '@/store'

// import { pathMapBreadcrumbs } from '@/utils/map-menu'

import NavInfo from './nav-info.vue'
// import HyBreadcrumb from '@/base-ui/breadcrumb'

import useMenuIcon from '../hooks/useMenuIconHook'

export default defineComponent({
  props: {
    menuType: {
      type: Number
    }
  },
  components: {
    NavInfo
    // HyBreadcrumb
  },
  emits: ['foldChange'],
  setup(props, ctx) {
    // 1.菜单icon
    const [isFold, handleFoldClick] = useMenuIcon({ emit: ctx.emit }) as any

    // 2.获取菜单列表 面包屑导航，目前不涉及
    // const breadcrumbs = computed(() => {
    //   const path = useRoute().path
    //   const userMenus = useStore().state.login.userMenus
    //   return pathMapBreadcrumbs(userMenus, path)
    // })

    return {
      isFold,
      // breadcrumbs,
      handleFoldClick
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
    padding: 0 18px;
  }
}
</style>

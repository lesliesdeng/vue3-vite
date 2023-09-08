<template>
  <div class="nav-menu">
    <div class="logo"></div>
    <el-menu class="el-menu-vertical" :collapse="collapse" :default-openeds="defaultOpens">
      <template v-for="item in menus" :key="item.id">
        <!-- 判断二级菜单 -->
        <template v-if="item.children && item.children.length">
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <!-- <el-icon>
                <component :is="item.icon" />
              </el-icon> -->
              <span>{{ item.name }}</span>
            </template>
            <template v-for="subitem in item.children" :key="subitem.id">
              <el-menu-item :index="subitem.id + ''" @click="handleItemClick(subitem)">
                <el-icon v-if="subitem.icon">
                  <component :is="subitem.icon" />
                </el-icon>
                <span>{{ subitem.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.id + ''" @click="handleItemClick(item)">
            <i v-if="item.icon" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div
      class="collapse-nav"
      @click="collapse = !collapse"
      :style="{ width: collapse ? '60px' : '100%' }"
    >
      <el-icon>
        <ArrowRightBold v-if="collapse" />
        <ArrowLeftBold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, watch, ref, PropType, computed } from 'vue'
import localCache from '@/utils/cache'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    menusList: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  setup(props) {
    // 1.获取menus
    const store = useStore()
    // const menus = store.state.login.userMenus
    const collapse = ref(false)

    const menus: any = ref(
      computed(() => {
        return props.menusList.length !== 0
          ? props.menusList
          : localCache.getCache('adminMenus')[0].children
      })
    )
    const defaultOpens = menus.value.map((item: any) => item.id)

    // 2.记录选中的index
    const router = useRouter()
    // const route = useRoute()
    // const menu = pathMapToMenu(menus, route.path)
    // const currentItemId = ref<string>(menu.id + '')
    const handleItemClick = (item: any) => {
      router.push({
        path: item.uri ?? '/not-found'
      })
    }
    const changeCurrentItemId = () => {
      // 不可用route.path;在长时间不操作页面后；首次进入操作，route.path取不到变化后的值
      // const menu = pathMapToMenu(menus, window.location.hash.split('#')[1].split('?')[0])
      // currentItemId.value = menu.id
    }
    const goHome = () => {
      // 0:到管理端首页;1：到用户端首页
      store.dispatch('login/afterLoginAction', { menuType: 1 })
    }
    watch(
      () => router.currentRoute.value,
      () => {
        // 菜单映射操作，跳转全屏页面不做该操作
        // 实际无影响，输入url跳转时控制台总报错，报看
        if (router.currentRoute.value.path.indexOf('full-screen') !== -1) {
          return
        }
        changeCurrentItemId()
      },
      { immediate: true }
    )
    onMounted(() => {
      window.addEventListener('popstate', changeCurrentItemId, false)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('popstate', changeCurrentItemId, false)
    })
    return {
      menus,
      // currentItemId,
      handleItemClick,
      defaultOpens,
      goHome,
      collapse
    }
  }
})
</script>

<style scoped lang="less">
.nav-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .logo {
    cursor: pointer;
    padding-left: 30px;
    display: flex;
    height: 50px;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #0084cf;
    .img {
      width: 82%;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: #0a60bd;
    }
  }
  :deep(.el-menu) {
    background-color: #363a3e;
    .el-sub-menu {
      .el-sub-menu__title {
        font-size: 14px !important;
        color: #fff !important;
        .el-icon {
          font-size: 20px;
        }
        .el-sub-menu__icon-arrow {
          font-size: 18px;
          color: #fff !important;
        }
      }
    }
    .el-sub-menu:hover,
    .el-sub-menu__title:hover {
      background-color: #222222 !important;
    }
  }
  .el-menu-item {
    font-size: 14px;
    color: #979797;
    background-color: #363a3e;
    .el-icon {
      font-size: 20px;
    }
  }
  .el-menu-item:hover {
    background-color: #303437 !important;
  }
  .el-menu-item.is-active {
    color: #fff;
    background-color: #222222 !important;
    font-weight: 600;
  }
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
}
.el-menu--collapse {
  width: 60px;
}
.el-menu-vertical {
  height: calc(100% - 90px);
}
.collapse-nav {
  color: #fff;
  background: #303437;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  transition: width 0.3s linear;
}
</style>

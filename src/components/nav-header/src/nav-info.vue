<template>
  <div class="nav-info">
    <div class="info">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="40" class="avatar">
            <img src="@/assets/img/user-default.png" @error.once="setDefaultImage" />
          </el-avatar>
          <span class="name">{{ currentUser.fullName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-circle-close" @click="goAdmin" v-if="adminGrant">{{
              '管理后台'
            }}</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-close" @click="handleExitClick"
              >退出系统</el-dropdown-item
            >
            <!-- <el-dropdown-item icon="el-icon-info" divided>个人信息</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock">修改密码</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <div class="operation">
      <span
        ><el-icon><Bell /></el-icon>
      </span>
      <span>
        <el-icon><ChatDotRound /></el-icon>
      </span>
      <span>
        <span class="dot"></span>
        <el-icon><Postcard /></el-icon>
      </span>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'
// import localCache from '@/utils/cache'

export default defineComponent({
  props: {
    menuType: {
      type: Number
    }
  },
  setup(props) {
    const store = useStore()
    const currentUser = computed(() => store.state.login.userInfo)
    const adminGrant = computed(() => store.state.login.adminGrant)

    const router = useRouter()

    const handleExitClick = () => {
      // localCache.deleteCache('token')
      // router.push('/main')
      // 关闭页面
      window.close()
    }

    const setDefaultImage = (e: any) => {
      e.target.src = require('@/assets/img/user-default.png')
    }

    const goAdmin = () => {
      // todo
      router.push('/main')
    }

    return {
      handleExitClick,
      currentUser,
      setDefaultImage,
      goAdmin,
      adminGrant
    }
  }
})
</script>

<style scoped lang="less">
.nav-info {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #2b71c8;
    .avatar {
      width: 30px;
      height: 30px;
    }
    .name {
      margin-left: 8px;
    }
  }

  .operation {
    margin-right: 20px;
    span {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 35px;
      line-height: 35px;

      &:hover {
        background: #f2f2f2;
      }

      i {
        font-size: 20px;
      }

      .dot {
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 10;
        width: 6px;
        height: 6px;
        background: red;
        border-radius: 100%;
      }
    }
  }
}
</style>

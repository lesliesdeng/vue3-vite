<template>
  <div class="nav-info">
    <div class="info">
      <span class="el-dropdown-link">
        <el-tooltip class="box-item" effect="dark" content="意见反馈" placement="bottom">
          <el-icon><EditPen @click="openSuggestionModal" /></el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="返回学员前台" placement="bottom">
          <el-icon @click="goHome"><House /></el-icon>
        </el-tooltip>
        <el-avatar :size="40" class="avatar">
          <img :src="userGrade?.integralGrade?.cover" @error.once="setDefaultImage" />
        </el-avatar>
        <!-- <span class="name">{{ currentUser.fullName }}</span> -->
      </span>
    </div>
  </div>
  <suggestion-modal ref="suggestionModalRef"></suggestion-modal>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from '@/store/index'
import SuggestionModal from '@/components/suggestion-modal'
// import { useRouter } from 'vue-router'
// import localCache from '@/utils/cache'

export default defineComponent({
  props: {},
  components: {
    SuggestionModal
  },
  setup() {
    const suggestionModalRef = ref()
    const store = useStore()
    const currentUser = computed(() => store.state.login.userInfo)
    const userGrade = computed(() => {
      return store.state.system.userGrade
    })
    const adminGrant = computed(() => store.state.login.adminGrant)

    // const router = useRouter()

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
      // todo，返回用户端
      store.dispatch('login/afterLoginAction')
    }

    const goHome = () => {
      window.location.href = `${window.location.origin}/#/home`
    }

    const openSuggestionModal = () => {
      suggestionModalRef.value.dialogVisible = true
    }

    return {
      handleExitClick,
      currentUser,
      setDefaultImage,
      goAdmin,
      adminGrant,
      userGrade,
      goHome,
      openSuggestionModal,
      suggestionModalRef
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
    color: #fff;
    .avatar {
      width: 30px;
      height: 30px;
    }
    .el-icon {
      font-size: 22px;
      padding: 0 10px;
    }
    .el-avatar {
      margin-left: 10px;
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

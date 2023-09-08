<template>
  <div class="page-content">
    <ui-table
      :totalCount="totalCount"
      :listData="pageListData"
      v-bind="contentConfig"
      v-model:page="pageInfo"
      ref="uiTableRef"
      @selectionChange="selectionChange"
    >
      <template #status="scope">
        <div class="status-box">
          <span
            :style="{ 'background-color': contentConfig.statusMap[scope.row.culStatus]?.color }"
          ></span>
          {{ contentConfig.statusMap[scope.row.culStatus]?.title }}
        </div>
      </template>
      <template #create="scope">
        {{ scope.row.createTime ? $filters.formatTime(scope.row.createTime) : '--' }}
      </template>
      <template #update="scope">
        {{ scope.row.modifyDate ? $filters.formatTime(scope.row.modifyDate) : '--' }}
      </template>
      <template #handler="scope">
        <span v-if="scope.row.canEdit === 0">/</span>
        <div class="handler" v-else>
          <el-button type="primary" link size="small" @click="handleEditClick(scope.row)">
            <!-- <el-icon style="vertical-align: middle" size="14">
              <Edit />
            </el-icon> -->
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleDeleteClick(scope.row)">
            <!-- <el-icon style="vertical-align: middle" size="14">
              <Delete />
            </el-icon> -->
            删除
          </el-button>
        </div>
      </template>
      <template v-for="item in otherPropSlots" :key="item.prop" #[item.slotName]="scope">
        <template v-if="item.slotName">
          <slot :name="item.slotName" :row="scope.row"></slot>
        </template>
      </template>
      <!-- <template #imageSlot="scope">
        <slot name="imageSlot" :row="scope.row"></slot>
      </template> -->
    </ui-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from '@/store'
import { usePermission } from '@/hooks/usePermission'
import 'element-plus/es/components/message-box/style/css'
import { ElMessageBox } from 'element-plus'

import UiTable from '@/base-ui/table'
// import { tSNonNullExpression } from '@babel/types'

export default defineComponent({
  components: {
    UiTable
  },
  props: {
    contentConfig: {
      type: Object,
      required: true
    },
    pageName: {
      type: String,
      required: true
    }
  },
  emits: ['editBtnClick', 'selectionChange'],
  setup(props, { emit }) {
    const uiTableRef = ref<InstanceType<typeof UiTable>>()
    // 7.按钮是否显示
    const isCreate = usePermission(props.pageName, 'create') && !props.contentConfig.noCreate
    // const isDelete = usePermission(props.pageName, 'delete')
    // const isUpdate = usePermission(props.pageName, 'update')
    // const isQuery = usePermission(props.pageName, 'query')

    // 1.请求页面数据
    const store = useStore()

    // 0.绑定pageInfo
    const pageInfo = ref({
      currentPage: 1,
      pageSize: 10
    })

    // 选中项
    const checkItems = ref(null)
    // 保存搜索条件
    const otherQueryInfo = ref({})

    watch(pageInfo, () => getPageData('', true))
    const storeName = props.contentConfig.pageName ? props.contentConfig.pageName : 'system'
    const pageName = props.contentConfig.pageName ? props.contentConfig.pageName : props.pageName

    watch(
      otherQueryInfo,
      (newValue) => {
        const queryInfo = store.state[storeName][`${storeName}QueryInfo`]
        store.commit(
          `${storeName}/change${storeName.charAt(0).toUpperCase() + storeName.slice(1)}QueryInfo`,
          { ...queryInfo, ...newValue }
        )
      },
      { deep: true }
    )
    // 2.获取数据
    const getPageData = (otherInfo?: any, updataPage?: any) => {
      // 支持自定义获取数据action,如不指定，默认getPageListDataAction
      const getDataAction = props.contentConfig.getDataAction ?? 'getPageListDataAction'
      otherInfo && (otherQueryInfo.value = otherInfo)
      // 搜索条件改变，回到首页
      if (otherInfo && Object.keys(otherInfo).length != 0) {
        pageInfo.value.currentPage = 1
      }
      const data = {
        pageName,
        storeName,
        queryInfo: {
          page: pageInfo.value.currentPage,
          // offset: (pageInfo.value.currentPage - 1) * pageInfo.value.pageSize,
          pageSize: pageInfo.value.pageSize,
          ...otherQueryInfo.value
        }
      }
      // 如果是页签更新，不用otherQueryInfo覆盖
      if (updataPage) {
        data.queryInfo.page = pageInfo.value.currentPage
        data.queryInfo.pageSize = pageInfo.value.pageSize
      }
      store.dispatch(`${storeName}/${getDataAction}`, data)
    }
    if (!props.contentConfig.noLoad) {
      getPageData()
    }

    // 2.获取页面数据
    const pageListData = computed(() => store.getters[`${storeName}/pageListData`](pageName))

    // 3.footer  //TEST
    const totalCount = computed(() => store.getters[`${storeName}/pageListDataCount`](pageName))

    // 4.剩余需要的插槽 （权限控制口子，目前未使用）
    const otherPropSlots = computed(() => {
      return props.contentConfig.propList.filter((item: any) => {
        if (item.slotName === 'status') return false
        else if (item.slotName === 'create') return false
        else if (item.slotName === 'update') return false
        else if (item.slotName === 'handler') return false
        return true
      })
    })

    // 5.删除操作
    const handleDeleteClick = async (rowItem: any) => {
      //删除确认弹窗
      const action = await ElMessageBox({
        title: '删除',
        message: '删除后，将无法恢复，确认继续删除？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete-confirm'
      })
      if (action !== 'confirm') {
        return
      }
      store.dispatch(`${storeName}/deletePageDataAction`, {
        pageName,
        queryInfo: {
          currentPage: pageInfo.value.currentPage,
          size: pageInfo.value.pageSize,
          ...otherQueryInfo.value,
          ...rowItem
        },
        id: props.contentConfig.id ? rowItem[props.contentConfig.id] : rowItem.id
      })
    }

    // 下载处理
    const handleDownloadClick = async (rowItem: any) => {
      const name =
        rowItem.fileName.length > 10 ? rowItem.fileName.slice(0, 10) + '···' : rowItem.fileName
      const fileName = rowItem.fileSuffix ? name + '.' + rowItem.fileSuffix : name
      store.dispatch(`system/downloadPageDataAction`, {
        id: rowItem.id,
        fileName
      })
    }

    const handleEditClick = (item: any) => {
      emit('editBtnClick', item)
    }

    // 保存多选框值
    const selectionChange = (items: any) => {
      checkItems.value = items
      emit('selectionChange', items)
    }
    return {
      pageInfo,
      pageListData,
      totalCount,
      getPageData,
      otherPropSlots,
      handleDeleteClick,
      handleEditClick,
      handleDownloadClick,
      isCreate,
      // isUpdate,
      // isDelete,
      selectionChange,
      checkItems,
      otherQueryInfo,
      uiTableRef
    }
  }
})
</script>

<style lang="less">
.delete-confirm {
  min-width: 650px !important;
  background: #ffffff;
  border-radius: 4px;
  .el-message-box__content {
    height: 218px !important;
    box-sizing: border-box;
    padding: 35px;
  }
  .el-message-box__header {
    box-sizing: border-box;
    height: 64px;
    background: #ffffff;
    box-shadow: inset 0px -1px 0px 0px rgba(232, 232, 232, 1);
    .el-message-box__title {
      font-size: 20px;
      color: #111111;
    }
  }
  .el-message-box__content .el-message-box__message {
    font-size: 16px;
    color: #575757;
  }
  .el-message-box__btns {
    box-sizing: border-box;
    height: 68px;
    background: #ffffff;
    box-shadow: inset 0px 1px 0px 0px rgba(232, 232, 232, 1);
  }
}
</style>

<style scoped lang="less">
.page-content {
  // border-top: 20px solid #f5f5f5;
  padding: 0 30px;
  .status-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      width: 7px;
      height: 7px;
      display: inline-block;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
</style>

<template>
  <div class="upload-modal">
    <el-dialog
      :title="setTitle(0)"
      v-model="dialogVisible"
      width="50%"
      class="remove-modal-box"
      append-to-body
      :close-on-click-modal="false"
      center
      destroy-on-close
    >
      <div class="remove-box">
        <div class="url-box">
          <el-input v-model="removeUrl.name" placeholder="请选择" :max="100" readonly />
        </div>
        <div class="tree-box">
          <el-tree
            :default-checked-keys="[defaultCheck]"
            :current-node-key="defaultCheck"
            ref="treeRef"
            check-strictly
            :data="data"
            node-key="id"
            :props="defaultProps"
            check-on-click-node
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleCheckChange"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirmClick">{{ setTitle(1) }}</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue'
// import type { UploadProps, UploadUserFile } from 'element-plus'
import { useStore } from '@/store'
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: {},
  props: {
    modalIndex: {
      type: Number
    },
    title: {
      type: String
    },
    pageName: {
      type: String
    },
    isBatch: {
      type: Boolean
    },
    selectItems: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    dataInfo: {
      type: Object,
      default: () => ({})
    },
    titleArr: {
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    interface Tree {
      fileName: string
      children?: Tree[]
      fullUrl: string
      id: string
    }
    const defaultProps = {
      children: 'children',
      label: 'fileName'
    }
    const defaultCheck = ref()
    const store = useStore()
    const data = computed(() => store.getters[`${props.pageName}/urlTreeData`](`${props.pageName}`))
    const treeRef = ref()
    const removeUrl = ref({ name: '', id: '' })
    const dialogVisible = ref(false)
    const handleType = ref('move')
    const setTitle = (code: number) => {
      const titleObj = {
        move: ['移动文件', '移动至此'],
        copy: ['复制文件', '复制到此'],
        restore: ['还原文件', '还原到此'],
        select: props.titleArr.length != 0 ? props.titleArr : ['选择路径', '确定']
      }
      return titleObj[handleType.value][code]
    }
    const handleConfirmClick = () => {
      handleType.value == 'move' && removeFn()
      handleType.value == 'copy' && copyFn()
      handleType.value == 'restore' && restoreFn()
      handleType.value == 'select' && selectFn()
    }
    const removeFn = async () => {
      if (!removeUrl.value.id) {
        ElMessage.error('请选择移动路径')
        return
      }
      // 批量操作还是单项操作
      if (props.isBatch) {
        const arrId: string[] = []
        props.selectItems.map((item: any) => {
          arrId.push(item.id)
        })
        await store.dispatch(`${props.pageName}/removeBatchUrlAction`, {
          fParentId: removeUrl.value.id,
          ids: arrId.join(',')
        })
      } else {
        await store.dispatch(`${props.pageName}/removeUrlAction`, {
          fParentId: removeUrl.value.id,
          id: props.dataInfo.id
        })
      }
      dialogVisible.value = false
    }
    const copyFn = async () => {
      if (!removeUrl.value.id) {
        ElMessage.error('请选择复制路径')
        return
      }
      await store.dispatch(`${props.pageName}/copyFileAction`, {
        fParentId: removeUrl.value.id,
        id: props.dataInfo.id
      })
      dialogVisible.value = false
    }
    const restoreFn = async () => {
      if (!removeUrl.value.id) {
        ElMessage.error('请选择还原路径')
        return
      }
      emit('restoreConfirm', removeUrl.value.id)
      dialogVisible.value = false
    }
    const selectFn = async () => {
      if (!removeUrl.value.id) {
        ElMessage.error('请选择路径')
        return
      }
      emit('selectConfirm', removeUrl.value)
      dialogVisible.value = false
    }
    // 树形控件选择回调
    const handleCheckChange = (data: Tree, checked: boolean) => {
      if (checked) {
        defaultCheck.value = ''
        treeRef.value.setCheckedNodes([data])
        removeUrl.value.name = data.fullUrl
        removeUrl.value.id = data.id
      }
    }

    const getUrlTreeAll = async () => {
      await store.dispatch(`${props.pageName}/getPageListUrlTreeAction`, {
        pageName: props.pageName
      })
      if (handleType.value == 'select') {
        // 设置根节点为默认选中
        const { fullUrl, id } = store.getters[`${props.pageName}/urlTreeData`](
          `${props.pageName}`
        )[0]
        defaultCheck.value = id
        removeUrl.value.name = fullUrl
        removeUrl.value.id = id
      }
    }

    watch(dialogVisible, (newValue) => {
      if (!newValue) {
        return
      }
      getUrlTreeAll()
    })

    return {
      handleType,
      dialogVisible,
      removeUrl,
      handleConfirmClick,
      data,
      defaultProps,
      handleCheckChange,
      treeRef,
      setTitle,
      defaultCheck
    }
  }
})
</script>

<style scoped lang="less">
.remove-box {
  padding: 20px 0 30px;
  .url-box {
    display: flex;
    justify-content: space-between;
  }
  .tree-box {
    border: 1px solid #d9d9d9;
    height: 280px;
    overflow: auto;
    margin-top: 15px;
    padding: 15px;
    border-radius: 4px;
  }
}
</style>

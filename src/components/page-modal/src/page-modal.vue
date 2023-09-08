<template>
  <div class="page-modal">
    <el-dialog
      :title="isAdd ? modalConfig.title : modalConfig.titleEdit"
      v-model="dialogVisible"
      append-to-body
      v-bind="modalConfig.modalStyle"
      :close-on-click-modal="false"
      center
      destroy-on-close
    >
      <ui-form
        v-bind="modalConfig"
        v-model="formData"
        ref="ruleFormRef"
        :readOnly="readonly"
      ></ui-form>
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirmClick">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useStore } from '@/store'
// import { ElDialog, ElDrawer } from 'element-plus'
import UiForm from '@/base-ui/form'

export default defineComponent({
  components: {
    UiForm
  },
  props: {
    modalConfig: {
      type: Object,
      required: true
    },
    defaultInfo: {
      type: Object,
      default: () => ({})
    },
    otherInfo: {
      type: Object,
      default: () => ({})
    },
    pageName: {
      type: String,
      required: true
    }
  },
  emits: ['resetPageClick'],
  setup(props, { emit }) {
    const isAdd = ref(Object.keys(props.defaultInfo).length === 0)
    const ruleFormRef: any = ref(null)
    // 1.绑定属性
    const store = useStore()
    const originFormData: any = {}
    const storeName = props.pageName ? props.pageName : 'system'
    const formData = ref({ ...originFormData })
    // 是否是查看打开，查看打开所有表单项不可编辑
    const readonly = ref(false)
    watch(
      () => props.defaultInfo,
      (newValue) => {
        for (const item of props.modalConfig.formItems) {
          formData.value[`${item.field}`] =
            newValue[`${item.field}`] !== undefined && newValue[`${item.field}`] !== ''
              ? newValue[`${item.field}`]
              : item.defaultValue
        }
        isAdd.value = Object.keys(newValue).length === 0
      }
    )

    const dialogVisible = ref(false)
    // 点击确定函数
    const handleConfirmClick = async () => {
      let formCheck = false
      await ruleFormRef.value.ruleUFormRef.validate((valid: any) => {
        formCheck = valid
      })
      if (!formCheck) {
        return
      }
      if (!isAdd.value) {
        // 编辑
        await store.dispatch(`${storeName}/editPageDataAction`, {
          pageName: props.pageName,
          queryInfo: { ...formData.value, ...props.otherInfo },
          // 如果有配置id字段，使用配置字段；不然默认id
          id: props.modalConfig.id ? props.defaultInfo[props.modalConfig.id] : props.defaultInfo.id
        })
      } else {
        // 新建
        await store.dispatch(`${storeName}/newPageDataAction`, {
          pageName: props.pageName,
          queryInfo: { ...formData.value, ...props.otherInfo }
        })
        // 分页控件回到首页
        emit('resetPageClick')
      }
      // 关闭弹窗
      dialogVisible.value = false
    }

    return {
      formData,
      dialogVisible,
      handleConfirmClick,
      ruleFormRef,
      isAdd,
      readonly
    }
  }
})
</script>

<style scoped></style>

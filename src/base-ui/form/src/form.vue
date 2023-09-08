<template>
  <div class="i-form" :class="formClass">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="form-box">
      <el-form :label-width="labelWidth" ref="ruleUFormRef" :model="formData">
        <el-row>
          <template v-for="(item, index) in formItems" :key="index">
            <el-col v-bind="item.colLayout ? item.colLayout : colLayout">
              <el-form-item
                :prop="`${item.field}`"
                :label="item.label"
                :rules="item.rules"
                :class="`form-item form-item-${itemTextAlign}`"
                :style="itemStyle"
                v-if="!item.isHidden"
              >
                <template v-if="item.type === 'input' || item.type === 'password'">
                  <el-input
                    :disabled="readOnly"
                    v-model="formData[`${item.field}`]"
                    :placeholder="item.placeHolder"
                    :maxlength="item.maxlength"
                    v-bind="item.otherOption"
                    :show-password="item.type === 'password'"
                  />
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select
                    :disabled="readOnly"
                    clearable
                    @change="(selectItem: any) => selectChange(selectItem, item)"
                    v-model="formData[`${item.field}`]"
                    :placeholder="item.placeHolder"
                    style="width: 100%"
                    v-bind="item.otherOption"
                  >
                    <el-option
                      v-for="option in item.options ?? item.originOptions"
                      :key="option.value"
                      :value="option.value"
                      :label="option.label"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.type === 'datepicker'">
                  <el-date-picker
                    :disabled="readOnly"
                    v-model="formData[`${item.field}`]"
                    v-bind="item.otherOption"
                    style="width: 100%"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="item.type === 'tree'">
                  <el-tree-select
                    :disabled="readOnly"
                    v-model="formData[`${item.field}`]"
                    :data="item.treeData"
                    multiple
                    :render-after-expand="false"
                    show-checkbox
                    v-bind="item.otherOption"
                  />
                </template>
                <template v-else-if="item.type === 'memberPicker'">
                  <member-picker
                    :disabled="readOnly"
                    :title="item.title"
                    :placeholder="item.placeHolder"
                    v-model:formValue="formData[`${item.field}`]"
                    :formOptions="item.otherOption"
                  />
                </template>
                <template v-else-if="item.type === 'organizationPicker'">
                  <organization-picker
                    :disabled="readOnly"
                    :title="item.title"
                    :placeholder="item.placeHolder"
                    v-model:formValue="formData[`${item.field}`]"
                    :formOptions="item.otherOption"
                  />
                </template>
                <template v-else-if="item.type === 'pathPicker'">
                  <path-picker
                    :disabled="readOnly"
                    :title="item.title"
                    :placeholder="item.placeHolder"
                    v-model:formValue="formData[`${item.field}`]"
                    :formOptions="item.otherOption"
                  />
                </template>
                <template #default="scope" v-if="item.slotName">
                  <slot
                    :name="item.slotName"
                    :value="formData[`${item.field}`]"
                    :col="scope"
                  ></slot>
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div :class="hasFooter ? 'footer' : ''">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted, computed } from 'vue'
import { IFormItem } from '../types'
import type { FormInstance } from 'element-plus'

export default defineComponent({
  components: {
    PathPicker: () => import('@/components/picker/path-picker'),
    MemberPicker: () => import('@/components/picker/member-picker'),
    OrganizationPicker: () => import('@/components/picker/organization-picker')
  },
  props: {
    readOnly: {
      type: Boolean
    },
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasFooter: {
      type: Boolean
    },
    labelWidth: {
      type: String,
      default: () => '80px'
    },
    formItems: {
      type: Array as PropType<IFormItem[]>,
      default: () => []
    },
    itemStyle: {
      type: Object,
      default: () => ({ padding: '10px 40px' })
    },
    itemTextAlign: {
      type: String,
      default: () => 'right'
    },
    formClass: {
      type: String,
      default: () => ''
    },
    colLayout: {
      type: Object,
      default: () => ({
        xl: 6, // ≥1920px
        lg: 8, // ≥1200px
        md: 12, // ≥992px
        sm: 24, // ≥768px
        xs: 24 // <768px
      })
    }
  },
  emit: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = computed(() => {
      return props.modelValue
    })
    const ruleUFormRef = ref<InstanceType<typeof FormInstance>>()
    watch(
      formData,
      (newValue) => {
        emit('update:modelValue', newValue)
      },
      { deep: true }
    )
    const selectChange = (selectItem: any, item: any) => {
      if (!item.onChange) {
        return
      }
      item.onChange(formData)
      emit('handleFormChange', { selectItem, item })
    }
    // 加这个的原因是因为element组件treeselect的bug，初始化是会自动做表单校验，如果必填，就会标红
    onMounted(() => {
      ruleUFormRef.value!.resetFields()
    })

    return {
      formData,
      ruleUFormRef,
      selectChange
    }
  }
})
</script>

<style scoped lang="less">
.i-form {
  padding: 20px 30px 20px;
}
.form-box {
  display: flex;
  align-items: baseline;
  .el-form {
    flex: 1;
  }
  .form-item-right {
    :deep(.el-form-item__label) {
      justify-content: flex-end;
    }
  }
  .form-item-left {
    :deep(.el-form-item__label) {
      justify-content: flex-start;
    }
  }
  .footer {
    width: 200px;
  }
}
</style>

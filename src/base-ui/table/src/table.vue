<template>
  <div class="i-table">
    <!-- <div class="header" v-if="!!title">
      <slot name="header">
        <div class="title">{{ title }}</div>
        <div class="handler">
          <slot name="headerHandler"></slot>
        </div>
      </slot>
    </div> -->
    <el-table
      ref="tableRef"
      :data="listData"
      stripe
      @selection-change="selectionChange"
      @select-all="selectionChange"
      v-bind="childrenProps"
      @row-click="handleRowClick"
      :row-key="rowId"
      :tooltip-options="{
        placement: 'bottom'
      }"
    >
      <!-- selection加key值是因为它的视图不会随着selectable更新而更新-->
      <el-table-column
        fixed="left"
        v-if="showSelectColumn"
        type="selection"
        :reserve-selection="false"
        width="60"
        :key="propList"
        :selectable="selectable"
      ></el-table-column>
      <!-- 单选框模板 -->
      <el-table-column v-if="showRadioColumn" fixed="left" width="60">
        <template v-slot="scope">
          <el-radio v-model="checkValue" :label="scope.row[rowId]">
            <!-- 随便放点东西，让id不显示 -->
            <span></span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        v-if="showIndexColumn"
        type="index"
        label="序号"
        width="80"
      ></el-table-column>
      <template v-for="item in propList" :key="item.prop">
        <el-table-column v-bind="item" show-overflow-tooltip>
          <template #default="scope">
            <slot :name="item.slotName" :row="scope.row">
              {{ getTableAttr(scope.row, item.prop) }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <slot></slot>
    </el-table>
    <div class="footer" v-if="showFooter">
      <slot name="footer">
        <el-pagination
          v-if="totalCount != 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          :total="totalCount"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    selectable: {
      type: Function,
      default: () => {
        return () => {
          return true
        }
      }
    },
    showIndexColumn: {
      type: Boolean,
      default: true
    },
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    showRadioColumn: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    listData: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    propList: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    childrenProps: {
      type: Object,
      default: () => ({})
    },
    totalCount: {
      type: Number,
      default: 0
    },
    rowId: {
      type: String,
      default: 'id'
    },
    page: {
      type: Object,
      default: () => ({
        currentPage: 0,
        pageSize: 10
      })
    }
  },
  emits: ['selectionChange', 'update:page'],
  setup(props, { emit }) {
    const checkValue = ref('')
    const tableRef = ref()
    const selectionChange = (value: any) => {
      if (props.showSelectColumn) {
        emit('selectionChange', value)
      }
    }

    const handleCurrentChange = (currentPage: number) => {
      checkValue.value = ''
      emit('update:page', { ...props.page, currentPage })
    }
    const handleSizeChange = (pageSize: number) => {
      emit('update:page', { ...props.page, pageSize })
    }

    const handleRowClick = (row: any) => {
      if (props.showRadioColumn) {
        checkValue.value = row[props.rowId]
        emit('selectionChange', [row])
      }
    }

    const getTableAttr = (row: any, prop: string) => {
      const propsList = prop.split('.')
      return propsList[1] ? (row[propsList[0]] ? row[propsList[0]][propsList[1]] : '') : row[prop]
    }

    return {
      selectionChange,
      handleCurrentChange,
      handleSizeChange,
      getTableAttr,
      checkValue,
      handleRowClick,
      tableRef
    }
  }
})
</script>

<style scoped lang="less">
.header {
  display: flex;
  height: 45px;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 20px;
    font-weight: 700;
  }

  .handler {
    align-items: center;
  }
}

.footer {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  .el-pagination {
    text-align: right;
  }
}
</style>

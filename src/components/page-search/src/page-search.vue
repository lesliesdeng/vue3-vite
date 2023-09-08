<template>
  <div class="page-search">
    <div
      v-if="mainSearch || !searchConfig.noCreate || searchConfig.title"
      class="header"
      :style="{
        marginBottom: !showSearchMore || searchConfig.formItems?.length === 0 ? '1.56vw' : 0
      }"
    >
      <div class="title">
        <div class="title-box">
          {{ searchConfig.title }}
          <slot name="headerMessageHandler"></slot>
        </div>
        <el-autocomplete
          v-if="!searchConfig.noMain && mainSearch"
          v-model="searchState"
          :fetch-suggestions="querySearchAsync"
          :placeholder="mainSearch.placeHolder"
          @select="handleSelect"
          :trigger-on-focus="false"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="handleQueryClick(0)">
              <Search />
            </el-icon>
          </template>
          <!-- 自定义自动补全搜索项 -->
          <template #default="{ item }">
            <div class="item" :class="item.type ? item.type : 'auto-item'">
              {{ item.value ? item.value : item.title }}
            </div>
          </template>
        </el-autocomplete>
        <el-button type="primary" plain @click="switchSearch" v-if="!hasAdvanced && mainSearch">
          高级搜索
          <el-icon v-if="showSearchMore"><ArrowUp /></el-icon>
          <el-icon v-if="!showSearchMore"><ArrowDown /></el-icon>
        </el-button>
      </div>
      <div class="handler">
        <el-button
          type="primary"
          v-bind="searchConfig.btnConfig"
          v-if="!searchConfig.noCreate"
          size="default"
          @click="handleNewData"
        >
          {{ searchConfig.newBtnTitle ?? '新建数据' }}
        </el-button>
      </div>
      <slot name="headerHandler"></slot>
    </div>
    <ui-form
      v-bind="searchConfig"
      v-model="formData"
      v-show="showSearchMore"
      :hasFooter="true"
      @handleFormChange="handleFormChange"
      v-if="searchConfig.formItems?.length !== 0"
    >
      <template #footer>
        <div class="btns">
          <el-button size="default" @click="handleResetClick">
            <!-- <el-icon style="vertical-align: middle" size="14">
              <Refresh />
            </el-icon> -->
            重置
          </el-button>
          <el-button type="primary" size="default" @click="handleQueryClick(1)">
            <!-- <el-icon style="vertical-align: middle" size="14">
              <Search />
            </el-icon> -->
            查询
          </el-button>
        </div>
      </template>
    </ui-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, computed, nextTick, watch } from 'vue'
import { useStore } from '@/store'

import UiForm, { IForm } from '@/base-ui/form'

interface IFormData {
  [key: string]: any
}

export default defineComponent({
  components: {
    UiForm
  },
  props: {
    searchConfig: {
      type: Object as PropType<IForm>,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['queryBtnClick', 'resetBtnClick', 'newBtnClick', 'formChange'],
  setup(props, { emit }) {
    const store = useStore()
    // 自动补全搜索框=>用户输入
    const searchState = ref('')
    // 自动补全搜索框=>用户选择
    const searchStateCheck: any = ref({ id: '', value: '' })
    // 高级搜索项模型
    const mainSearch: any = ref(
      props.searchConfig.mainSearch ? { ...props.searchConfig.mainSearch, value: '' } : false
    )
    // 是否需要高级搜索
    const hasAdvanced = ref(props.searchConfig.noAdvanced || false)
    //展开高级搜索
    const showSearchMore = ref(!{ ...props.searchConfig }.mainSearch)
    const autoQueryInfo = ref({})
    const originFormData: IFormData = {}
    const formItems = ref()
    watch(
      () => props.searchConfig.formItems,
      (newValue) => {
        formItems.value = newValue ?? []
        for (const formItem of formItems.value) {
          // 不直接置空的原因：为了保存搜索时不在搜索表单中展示，但是又固定需要下发的参数 例如：左树右表时的左树id
          originFormData[`${formItem.field}`] =
            formItem.defaultValue && !formItem.resSetInit ? formItem.defaultValue : ''
          if (formItem.defaultValue) {
            formData?.value && (formData.value[`${formItem.field}`] = formItem.defaultValue)
          }
        }
      },
      { deep: true, immediate: true }
    )

    const formData = ref<IFormData>({ ...originFormData })

    const handleResetClick = () => {
      for (const key in originFormData) {
        formData.value[`${key}`] = originFormData[key]
      }
      emit('resetBtnClick')
    }

    const buildAutonQueryInfo = () => {
      const isCheck = searchState.value === searchStateCheck.value.value
      // 如果当前搜索的是在搜索列表中选中的人员，用id精确搜索;如果是用户手动输入，搜索用户输入内容
      const queryValue = isCheck ? searchStateCheck.value.id : searchState.value

      autoQueryInfo.value[mainSearch.value.field] = queryValue
      autoQueryInfo.value['autoSearch'] = true
      if (mainSearch.value.searchKey) {
        autoQueryInfo.value[mainSearch.value.searchKey] = queryValue
      }
    }
    const handleQueryClick = (type: number) => {
      // 0:搜索框搜索  1：高级搜索
      if (type === 0) {
        const isCheck = searchState.value === searchStateCheck.value.value
        buildAutonQueryInfo()
        // 保存搜索历史
        store.dispatch(`system/editAutocomplete`, {
          pageName: props.searchConfig.pageName,
          data: {
            value: isCheck ? searchStateCheck.value.value : searchState.value,
            id: isCheck ? searchStateCheck.value.id : searchState.value
          }
        })
        emit('queryBtnClick', autoQueryInfo.value)
      } else {
        emit('queryBtnClick', formData.value)
      }
    }

    const handleNewData = () => {
      emit('newBtnClick')
    }

    const handleFormChange = (params: any) => {
      emit('formChange', params)
    }

    const switchSearch = () => {
      showSearchMore.value = !showSearchMore.value
    }

    interface LinkItem {
      value?: string
      type?: string
      id?: string
      title?: string
    }

    const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
      await loadAll(queryString)
      nextTick(() => {
        cb(restaurants.value)
      })
    }

    const handleSelect = (item: any) => {
      if (!item.id) return
      // 保存选中项相关数据
      searchStateCheck.value = item
    }

    const restaurants = computed(() => {
      const historyListData = store.getters[`system/pageAutoComplete`](props.searchConfig.pageName)
      let list: LinkItem[] = store.getters[`${props.searchConfig.pageName}/autoListData`](
        props.searchConfig.pageName
      )
      if (list[0]?.type !== 'auto-title-search') {
        list.unshift({
          title: '搜索列表',
          type: 'auto-title-search'
        })
      }

      list = [...historyListData].concat(list)
      list.unshift({ title: '历史记录', type: 'auto-title' })
      return list
    })

    const loadAll = (queryString?: any) => {
      const queryInfo = {
        pageSize: 10,
        page: 1,
        // 查询自动补全框数据
        [mainSearch.value.field]: queryString
      }
      if (mainSearch.value.searchKey) {
        queryInfo[mainSearch.value.searchKey] = queryString
      }
      buildAutonQueryInfo()
      return store.dispatch(`${props.searchConfig.pageName}/getPageListAutoDataAction`, {
        pageName: props.searchConfig.pageName,
        queryInfo
      })
    }
    onMounted(() => {
      // 如果需要自动补全搜索框，查询自动补全框信息
      mainSearch.value && loadAll()
    })

    return {
      formData,
      handleResetClick,
      handleQueryClick,
      handleNewData,
      searchState,
      querySearchAsync,
      showSearchMore,
      switchSearch,
      handleSelect,
      mainSearch,
      hasAdvanced,
      handleFormChange
    }
  }
})
</script>
<style scoped lang="less">
@blue-2: #2b71c8;
.page-search {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
.header {
  padding: 30px 30px 0;
  display: flex;
  height: 45px;
  justify-content: space-between;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    font-size: 22px;
    font-weight: 400;
    color: #020a10;
    span,
    div {
      font-weight: 600;
    }
    .title-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    :deep(.el-button) {
      span {
        .el-icon {
          margin-left: 10px;
        }
      }
    }
    :deep(.el-autocomplete) {
      margin: 0 20px 0 30px;
      width: 550px;
      border: 1px solid @blue-2;
      border-radius: 6px;
      .el-input--suffix {
        .el-input__wrapper {
          box-shadow: none;
        }
        .el-input__suffix {
          color: @blue-2;
          font-size: 20px;
        }
      }
    }
  }

  .handler {
    align-items: center;
  }
}
.btns {
  text-align: right;
}
.auto-item:hover {
  color: @blue-2;
}
.auto-title,
.auto-title-search {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
}
.auto-title-search {
  padding-top: 15px;
  margin-top: 10px;
  border-top: 1px solid #e8e8e8;
}
</style>

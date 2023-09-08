import { App } from 'vue'
// import {
//   ElButton,
//   ElTabs,
//   ElTabPane,
//   ElForm,
//   ElFormItem,
//   ElInput,
//   ElCheckbox,
//   ElLink,
//   ElMenu,
//   ElMenuItem,
//   ElSubMenu,
//   ElContainer,
//   ElAside,
//   ElHeader,
//   ElMain,
//   ElDropdown,
//   ElDropdownMenu,
//   ElDropdownItem,
//   ElAvatar,
//   ElButtonGroup,
//   ElCol,
//   ElRow,
//   ElSelect,
//   ElOption,
//   ElDatePicker,
//   ElBreadcrumb,
//   ElBreadcrumbItem,
//   ElTable,
//   ElTableColumn,
//   ElPagination,
//   ElConfigProvider,
//   ElDialog,
//   ElImage,
//   ElTree,
//   ElDescriptions,
//   ElDescriptionsItem,
//   ElTag,
//   ElCard,
//   ElTooltip
// } from 'element-plus'
// import 'element-plus/es/components/submenu/style/css'

// const components = [
//   ElButton,
//   ElTabs,
//   ElTabPane,
//   ElForm,
//   ElFormItem,
//   ElInput,
//   ElCheckbox,
//   ElLink,
//   ElMenu,
//   ElSubMenu,
//   ElMenuItem,
//   ElContainer,
//   ElAside,
//   ElHeader,
//   ElMain,
//   ElDropdown,
//   ElDropdownMenu,
//   ElDropdownItem,
//   ElAvatar,
//   ElButtonGroup,
//   ElRow,
//   ElCol,
//   ElSelect,
//   ElOption,
//   ElDatePicker,
//   ElBreadcrumb,
//   ElBreadcrumbItem,
//   ElTable,
//   ElTableColumn,
//   ElPagination,
//   ElConfigProvider,
//   ElDialog,
//   ElImage,
//   ElTree,
//   ElDescriptions,
//   ElDescriptionsItem,
//   ElTag,
//   ElCard,
//   ElTooltip
// ]

// function registerElement(app: App): void {
//   for (const cpn of components) {
//     app.component(cpn.name, cpn)
//   }
// }
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

function registerElement(app: App): void {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    // @ts-ignore
    app.component(key, component)
  }
}

export default registerElement

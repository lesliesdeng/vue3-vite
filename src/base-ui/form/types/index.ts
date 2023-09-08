interface ISelectOption {
  label: string
  value: any
  owner?: any
}
interface ModalStyleOption {
  direction?: string
  size?: string
  width?: string
}

interface ITreeOption {
  value: string | number
  label: string
  children?: ITreeOption[]
}

type ItemType =
  | 'input'
  | 'password'
  | 'select'
  | 'datepicker'
  | 'tree'
  | 'memberPicker'
  | 'organizationPicker'
  | 'pathPicker'
  | 'cascader'

export interface IFormItem {
  field: string //下发字段名，与接口对应
  type: ItemType //表单项类型
  label?: string //表单label
  placeHolder?: string
  rules?: any[] //校验规则
  options?: ISelectOption[] | null
  otherOption?: any //会直接绑定到对应表单组件上
  defaultValue?: any //默认值
  isHidden?: boolean //是否隐藏，默认false
  slotName?: string //插槽名称，支持自定义表单项
  treeData?: ITreeOption[]
  title?: string
  onChange?: any //表单change回调
  maxlength?: number //input框输入长度限制
  colLayout?: any //布局，希望当前表单显示不按照整体布局时配置;优先级高于IForm中的配置
  originOptions?: any
  resSetInit?: any //重置时是否清空默认值，与defaultValue搭配使用
}

export interface IForm {
  titleEdit?: string //编辑弹框标题
  type?: string //抽屉还是弹窗，目前未使用
  title?: string //新增弹框标题
  formItems?: IFormItem[] //表单项
  labelWidth?: string //表单label宽度
  itemStyle: any //自定义样式
  colLayout: any //几列布局
  modalStyle?: ModalStyleOption //弹框样式
  isLoadOnCreated?: boolean //是否打开弹窗时就开始加载数据
  pageName?: string //当前页面名，驼峰命名，与路由对应
  noMain?: boolean //是否需要显示全局自动补全搜索框
  mainSearch?: any //是否需要全局自动补全搜索框,没有自动补全框则直接显示高级搜索项
  newBtnTitle?: string //新增按钮名
  noCreate?: boolean //是否需要新增按钮，默认有
  noAdvanced?: boolean
  itemTextAlign?: string //表单label文字align 默认右对齐
  formClass?: string //自定义表单样式
  id?: string //编辑弹窗，自已定义唯一标识字段，默认是id
  btnConfig?: any //搜索栏最右按钮配置项
}

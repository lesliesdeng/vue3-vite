export interface ISystemState {
  departmentTotalCount: number
  departmentList: any[]
  roleTotalCount: number
  roleList: any[]
  menuList: any[]
  autoComplete: any
  userMenus: any[]
  userGrade: any
  token: any
  userInfo: any
}

export interface IPagePayload {
  pageName: string
  // pageUrl: string
  queryInfo: any
  id?: number
}

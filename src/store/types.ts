import { ILoginState } from './login/types'
import { ISystemState } from './main/system/types'

export interface IRootState {
  name: string
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}

export interface IRootAndLogin {
  login: ILoginState
  system: ISystemState
}

export type IStore = IRootState & IRootAndLogin

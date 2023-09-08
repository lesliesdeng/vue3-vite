import iRequest from '../index'

import { Account, LoginInfo } from './types'

enum LoginAPI {
  AccountLogin = '/login',
  UserInfo = '/users/',
  UserMenusAdmin = '/menu/list',
  UserMenus = '/menu/listStudent',
  AdminGrant = '/grant/userGrantMember'
}

export function accountLoginRequest(account: Account) {
  return iRequest.post<LoginInfo>({
    url: LoginAPI.AccountLogin,
    data: account
  })
}

export function getUserById(id: number) {
  return iRequest.get({
    url: LoginAPI.UserInfo + id
  })
}
export function getUserDetail() {
  return iRequest.get({
    url: `${window.location.origin}/api/v1/human/member/edit-detail`
  })
}
export function getUserMenus() {
  return iRequest.get({
    url: LoginAPI.UserMenus
  })
}

export function getUserMenusAdmin() {
  return iRequest.get({
    url: `${window.location.origin}/api/v1/system/menu/member-menu`,
    returnAll: true //返回全部数据
  })
}

export function getUserGrant() {
  return iRequest.get({
    url: LoginAPI.AdminGrant
  })
}

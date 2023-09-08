import { RouteRecordRaw } from 'vue-router'
// import { IBreadcrumb } from '@/base-ui/breadcrumb/types'

let firstMenu: any = undefined
let firstRoute: RouteRecordRaw | undefined = undefined

export function fullScreenToRoutes() {
  const fullRoutes: RouteRecordRaw[] = []
  const routeFiles = import.meta.glob('../router/full-screen/**/*.ts', { eager: true })
  // const routeFiles = require.context('../router/full-screen', true, /\.ts/)
  // @ts-ignore
  Object.keys(routeFiles).forEach((key: any) => {
    if (key.indexOf('./full-screen.ts') !== -1) return
    // const route =  import.meta.glob('../router/full-screen' + key.split('.')[1])
    // @ts-ignore
    fullRoutes.push(routeFiles[key].default)
  })
  return fullRoutes
}

export function menuMapToRoutes(userMenus?: any[]): {
  routes: RouteRecordRaw[]
  fullRoutes: RouteRecordRaw[]
  homeRoutes: RouteRecordRaw[]
} {
  // 在此清空，不然管理端学院端切换会有问题
  firstMenu = undefined
  firstRoute = undefined
  const routes: RouteRecordRaw[] = []
  const fullRoutes: RouteRecordRaw[] = []
  const homeRoutes: RouteRecordRaw[] = []
  // 1.读取本地所有的路由
  const localRoutes: RouteRecordRaw[] = []
  // const routeFiles = require.context('../router', true, /\.ts/)
  const routeFiles = import.meta.glob('../router/**/*.ts', { eager: true })
  // @ts-ignore
  Object.keys(routeFiles).forEach((key: any) => {
    if (
      key.indexOf('/main.ts') !== -1 ||
      key.indexOf('/home.ts') !== -1 ||
      key.indexOf('/full-screen.ts') !== -1
    )
      return
    // const route = require('../router' + key.split('.')[1])
    if (key.indexOf('/full-screen') !== -1) {
      // @ts-ignore
      fullRoutes.push(routeFiles[key].default)
    }
    if (key.indexOf('/home') !== -1) {
      // @ts-ignore
      homeRoutes.push(routeFiles[key].default)
    }
    // @ts-ignore
    localRoutes.push(routeFiles[key].default)
  })

  // 2.菜单的映射
  const _recurseGetRoute = (menus: any[]) => {
    for (const menu of menus) {
      if (!menu.children || menu.children.length === 0) {
        const route = localRoutes.find((route) => route.path === menu.uri)
        if (route) routes.push(route)
        firstMenu = firstMenu || menu
        firstRoute = firstRoute || route
      } else {
        _recurseGetRoute(menu.children ?? [])
      }
    }
  }

  userMenus && _recurseGetRoute(userMenus)
  return { routes, fullRoutes, homeRoutes }
}

// 面包屑导航路由处理 暂未涉及
// export function mapPathToBreadpaths(currentPath: string, userMenus: any[]) {
//   const breadPaths: IBreadcrumb[] = []

//   const _recurseGetPath = (menus: any[]): any => {
//     for (const menu of menus) {
//       if (menu.type === 1) {
//         const foundMenu = _recurseGetPath(menu.children)
//         if (foundMenu) {
//           breadPaths.push({ name: menu.name, path: menu.uri })
//         }
//       } else if (menu.type === 2 && menu.uri === currentPath) {
//         breadPaths.push({ name: menu.name, path: menu.uri })
//         return menu
//       }
//     }
//   }

//   _recurseGetPath(userMenus)

//   return breadPaths.reverse()
// }

// export function pathMapBreadcrumbs(userMenus: any[], currentPath: string) {
//   const breadcrumbs: IBreadcrumb[] = []
//   pathMapToMenu(userMenus, currentPath, breadcrumbs)
//   return breadcrumbs
// }

//main/system/role  -> type === 2 对应menu
export function pathMapToMenu(
  userMenus: any[],
  currentPath: string
  // breadcrumbs?: IBreadcrumb[]
): any {
  for (const menu of userMenus) {
    if (menu.children && menu.children.length !== 0) {
      const findMenu = pathMapToMenu(menu.children ?? [], currentPath)
      if (findMenu) {
        // breadcrumbs?.push({ name: menu.name, path: '/' })
        // breadcrumbs?.push({ name: findMenu.name, path: '/' })
        return findMenu
      }
    } else if (menu.uri === currentPath) {
      return menu
    }
  }
}

// 根据菜单获取所有的按钮权限
// export function menuMapToPermissions(userMenus: any[]) {
//   const permissions: string[] = []

//   const _recurseGetPermission = (menus: any[]) => {
//     for (const menu of menus) {
//       if (menu.type === 1 || menu.type === 2) {
//         _recurseGetPermission(menu.children ?? [])
//       } else if (menu.type === 3) {
//         permissions.push(menu.permission)
//       }
//     }
//   }
//   _recurseGetPermission(userMenus)

//   return permissions
// }

export function getMenuChecks(menuList: any[]): number[] {
  const checks: number[] = []
  const _recurseGetChecked = (menuList: any[]) => {
    for (const menu of menuList) {
      if (menu.children) {
        _recurseGetChecked(menu.children)
      } else {
        checks.push(menu.id)
      }
    }
  }
  _recurseGetChecked(menuList)
  return checks
}

export { firstMenu, firstRoute }

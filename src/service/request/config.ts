// 1.区分环境变量方式一:
// export const API_BASE_URL = 'https://coderwhy/org/dev'
// export const API_BASE_URL = 'https://coderwhy/org/prod'

// 2.区分环境变量方式二:
// let baseURL = ''
// if (process.env.NODE_ENV === 'production') {
//   baseURL = '/cultural'
// } else if (process.env.NODE_ENV === 'development') {
//   baseURL = ''
// } else {
//   baseURL = ''
// }

// 3.区分环境变量方式三: 加载.env文件
// export const API_BASE_URL = process.env.VUE_APP_BASE_URL
export const API_BASE_URL = '/api/v1/cultural'
// export const BASE_URL = baseURL
export const TIME_OUT = 100000000

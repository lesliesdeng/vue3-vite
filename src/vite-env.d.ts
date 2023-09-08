/// <reference types="vite/client" />
declare module "element-plus";
declare module "element-plus/dist/locale/zh-cn.mjs";

declare module "@element-plus/icons-vue";

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
  
}
declare module '*.json'

declare module 'vue3-pdfjs/esm'

declare module 'aplayer'

declare module '@chuangkit/chuangkit-design'

declare module 'swiper/vue'

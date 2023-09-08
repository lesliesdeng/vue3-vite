import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import requireTransform from 'vite-plugin-require-transform'

export default defineConfig({
  base: './',
  resolve: { alias: [{ find: '@', replacement: resolve(__dirname, 'src') }] },
  plugins: [
    vue(),
    AutoImport({
      eslintrc: {
        enabled: true
      },
      imports: ['vue', 'vue-router'], //自动引入vue的ref、toRefs、onmounted等，无需在页面中再次引入
      dts: true, // 生成在src路径下名为auto-import.d.ts的声明文件
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
      resolvers: [ElementPlusResolver()]
    }),
    requireTransform({
      fileRegex: /.ts$|.vue$/
    })
  ],
  server: {
    port: 8008,
    proxy: {
      '/api/v1': {
        secure: false, // 跳过https验证
        target: 'xxxx',
        ws: true,
        changeOrigin: true
      },
      '/oauth/api/v1': {
        secure: false, // 跳过https验证
        target: 'xxx',
        ws: true,
        changeOrigin: true
      }
    }
  }
})

<template>
  <div class="footer-btn-box">
    <span>{{ `已选择${count}项` }}</span>
    <el-button
      type="primary"
      plain
      v-for="button in buttons"
      :key="button.title"
      @click="button.callback"
      >{{ button.title }}</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
interface ButtonItem {
  callback: any
  title: string
}
export default defineComponent({
  components: {},
  props: {
    count: {
      type: Number,
      required: true
    },
    buttons: {
      type: Array as PropType<ButtonItem[]>,
      required: true
    }
  },
  setup(_, { emit }) {
    return {}
  }
})
</script>
<style scoped lang="less">
.footer-btn-box {
  background-color: #ffffff;
  z-index: 666;
  padding: 15px 30px;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 1px solid #dbdbdb;
  span {
    color: #666666;
    font-size: 14px;
    margin-right: 20px;
  }
}
</style>

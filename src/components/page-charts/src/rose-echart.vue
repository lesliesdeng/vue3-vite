<template>
  <div class="rose-echart">
    <base-echart :options="options"></base-echart>
  </div>
</template>

<script lang="ts" setup>
import {computed } from 'vue'
import BaseEchart from '@/base-ui/echarts'
import { IPieEchartData } from '../types'

const props = defineProps<{
  roseData: IPieEchartData[]
}>()

const options = computed(() => {
  return {
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'item' as const
    },
    series: [
      {
        name: '访问来源',
        type: 'pie' as const,
        radius: [10, 160],
        center: ['50%', '50%'],
        roseType: 'area' as const,
        itemStyle: {
          borderRadius: 8
        },
        data: props.roseData,
        label: {
          show: false
        }
      }
    ]
  }
})
</script>

<style lang="less" scoped></style>

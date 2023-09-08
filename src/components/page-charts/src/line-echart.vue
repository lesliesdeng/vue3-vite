<template>
  <div class="line-echart">
    <base-echart :options="options"></base-echart>
  </div>
</template>

<script setup lang="ts">
import {computed } from 'vue'
import BaseEchart from '@/base-ui/echarts'
import { IEchartXAxisLabel, IEchartValueData } from '../types'

const props = defineProps<{
  labels: IEchartXAxisLabel[]
  values: IEchartValueData[]
}>()

const options = computed(() => {
  return {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'cross' as const,
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category' as const,
        boundaryGap: false,
        data: props.labels as any
      }
    ],
    yAxis: [
      {
        type: 'value' as const
      }
    ],
    series: [
      {
        name: '分类销量统计',
        type: 'line' as const,
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series' as const
        },
        data: props.values as any
      }
    ]
  }
})
</script>

<style lang="less" scoped></style>

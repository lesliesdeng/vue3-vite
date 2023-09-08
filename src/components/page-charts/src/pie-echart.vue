<template>
  <div class="pie-echart">
    <base-echart :options="options"></base-echart>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import BaseEchart from '@/base-ui/echarts'
import { IPieEchartData } from '../types'

const props = defineProps<{
  pieData: IPieEchartData[]
}>()

const options = computed(() => {
  return {
    tooltip: {
      trigger: 'item' as const
    },
    legend: {
      orient: 'horizontal' as const,
      left: 'left'
    },
    series: [
      {
        name: '访问来源',
        type: 'pie' as const,
        radius: '50%',
        bottom: '-10%',
        data: props.pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<style scoped></style>

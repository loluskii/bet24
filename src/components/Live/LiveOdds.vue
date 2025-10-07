<template lang="">
  <!-- The class is m-outcome--up/m-outcome--down -->
  <div
    class="m-outcome m-event-outcome-default"
    :class="[
      selectionClass,
      odds.odds <= 1 ? 'm-outcome--disabled' : 'x',
      oddUp ? 'm-outcome--up' : oddDown ? 'm-outcome--down' : ''
    ]"
  >
    <span v-if="odds.odds <= 1" class="m-outcome-odds m-icon-lock"></span>
    <span v-else data-op="label-odds-amount" class="m-outcome-odds">
      {{ odds.odds.toFixed(2) }}
    </span>
  </div>
</template>
<script setup>
// import { formatOdd } from '@/helpers'
import { defineComponent, watch, ref } from 'vue'

const oddUp = ref(false)
const oddDown = ref(false)

const props = defineProps({
  odds: Object,
  selectionClass: String
})

watch(
  () => props.odds.odds,
  (newValue, oldValue) => {
    if (newValue && oldValue) {
      const nVal = newValue.toFixed(2)
      const oVal = oldValue.toFixed(2)

      if (parseFloat(nVal) > parseFloat(oVal)) {
        oddUp.value = true
        oddDown.value = false
      } else if (parseFloat(nVal) < parseFloat(oVal)) {
        oddUp.value = false
        oddDown.value = true
      }
      // reset indicators
      setTimeout(() => {
        oddDown.value = false
        oddUp.value = false
      }, 5000)
    }
  },
  { immediate: true }
)
defineComponent({
  name: 'prematch-odds'
})
</script>
<!-- <style scoped>
.m-outcome-odds.m-outcome-up:before {
  color: var(--brand-highlight-text);
  /* color: var(--brand-text-secondary); */
  display: inline-block;
  padding-right: 0.83333333rem;
}
.m-outcome-odds.m-outcome-down::before {
  content: '\e605';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-outcome-odds.m-outcome-down:before {
  color: #e41827;
  color: var(--warning-primary);
  display: inline-block;
  padding-right: 0.83333333rem;
}
</style> -->

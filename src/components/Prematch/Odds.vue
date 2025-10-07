<template lang="">
  <div
    class="m-outcome m-event-outcome-default"
    :class="[
      selectionClass,
      odds.odds <= 1 ? 'm-outcome--disabled' : 'x',
      oddUp ? 'm-outcome--up' : oddDown ? 'm-outcome--down' : ''
    ]"
  >
    <span v-if="odds.odds <= 1" class="m-outcome-odds m-icon-lock"></span>
    <span v-else data-op="label-odds-amount" class="m-outcome-odds">{{
      odds.odds.toFixed(2)
    }}</span>
  </div>
</template>
<script setup>
import { defineComponent, ref, watch, onMounted, onBeforeUpdate } from 'vue'
const oddUp = ref(false)
const oddDown = ref(false)
const previousOdds = ref(null)
const oddsId = ref(null)

const props = defineProps({
  odds: Object,
  selectionClass: String
})

defineComponent({
  name: 'prematch-odds'
})

// Store initial odds value and ID on mount
onMounted(() => {
  previousOdds.value = props.odds.odds
  oddsId.value = props.odds.oddID
  // console.log('Odds component mounted with oddID:', oddsId.value, 'and value:', previousOdds.value)
})

// Check before each update if this is a completely different odds object
onBeforeUpdate(() => {
  // If the oddID has changed, this is a different selection entirely, not an odds change
  if (props.odds.oddID !== oddsId.value) {
    // console.log('oddID changed from', oddsId.value, 'to', props.odds.oddID)
    // Update the stored ID
    oddsId.value = props.odds.oddID
    // Reset the previous odds value to prevent arrows
    previousOdds.value = props.odds.odds
    // Ensure no arrows are shown
    oddUp.value = false
    oddDown.value = false
  }
})

watch(
  () => props.odds.odds,
  (newValue) => {
    // Skip if we don't have a previous value to compare with
    if (newValue === undefined || previousOdds.value === null) {
      previousOdds.value = newValue
      return
    }

    // Convert to fixed precision for comparison
    const nVal = parseFloat(newValue.toFixed(2))
    const pVal = parseFloat(previousOdds.value.toFixed(2))

    // console.log('Odds watch triggered:',
    //   'oddID:', props.odds.oddID,
    //   'new:', nVal,
    //   'prev:', pVal,
    //   'same ID?', props.odds.oddID === oddsId.value)

    // Only show indicators if there's an actual change in value
    // AND we're dealing with the same odds selection (same oddID)
    if (nVal !== pVal && props.odds.oddID === oddsId.value) {
      // console.log('SHOWING ARROWS - odds changed from', pVal, 'to', nVal)
      if (nVal > pVal) {
        oddUp.value = true
        oddDown.value = false
      } else if (nVal < pVal) {
        oddUp.value = false
        oddDown.value = true
      }

      // Reset indicators after a delay
      setTimeout(() => {
        oddDown.value = false
        oddUp.value = false
      }, 5000)
    }

    // Update the previous odds value for next comparison
    previousOdds.value = newValue
  }
)
</script>
<style scoped>
.m-outcome--up:before {
  color: #33ea6a;
}

.m-outcome--down:before {
  color: #e41827;
}
</style>

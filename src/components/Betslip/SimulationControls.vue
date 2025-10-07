<template>
  <div class="buttons h-48 size-16" @click="handleSimulationExit">
    <div data-op="sim-ok-button" class="button__ok">
      <span>{{ timerEnded ? 'OK' : 'Skip to Results' }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  timerEnded: {
    type: Boolean,
    required: true
  },
  timerStarted: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['exit'])

const handleSimulationExit = () => {
  if (props.timerStarted && !props.timerEnded) {
    emit('exit', 'skip')
    return
  }

  if (props.timerEnded) {
    emit('exit', 'close')
  }
}
</script>

<style scoped>
.buttons {
  cursor: pointer;
  flex-shrink: 0;
  font-family: 'Roboto-Bold';
}

.buttons > div {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
}

.buttons .button__ok {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #000000;
}

.h-48 {
  height: 4rem;
}

.size-16 {
  font-size: 1.33333333rem;
}
</style>

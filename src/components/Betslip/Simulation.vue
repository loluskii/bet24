<template>
  <div id="Simulate">
    <SimulationHeader
      :timer-ended="timerEnded"
      :timer-display="timerDisplay"
      :is-winner="isWinner"
      :simulation-results="simulationResults"
    />

    <!-- Simulation Events -->
    <div class="ticket-wrapper">
      <div class="ticket">
        <div class="events-container">
          <SimulationEvent
            v-for="selection in couponStore.coupon.selections"
            :key="selection.matchId"
            :selection="selection"
            :simulation-data="simulationData[selection.matchId]"
            :current-time="currentTime"
            :timer-ended="timerEnded"
          />
        </div>
      </div>
    </div>

    <SimulationControls
      :timer-ended="timerEnded"
      :timer-started="timerStarted"
      @exit="handleSimulationExit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useCouponStore, useUtilsStore } from '@/stores'
import SimulationHeader from './SimulationHeader.vue'
import SimulationEvent from './SimulationEvent.vue'
import SimulationControls from './SimulationControls.vue'

// Store and Props
const couponStore = useCouponStore()
const { SportsbookGlobalVariable } = useUtilsStore()
const props = defineProps({
  simulationResults: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['exit'])
// Constants
const SIMULATION_DURATION = 9 // seconds
const UPDATE_INTERVAL = 250 // milliseconds
const INITIAL_DELAY = 1000 // milliseconds

// Reactive State
const currentTime = ref(0)
const intervalId = ref(0)

// Computed Properties
const simulationData = computed(() => {
  try {
    const events = JSON.parse(props.simulationResults.events)
    return events.reduce((acc, ev) => {
      const matchId = Number(ev.reference)
      const playout = ev.playout

      const goalEvents = [
        ...(playout.homeCompetitorGoals?.map((time) => ({
          time: time / 10,
          team: 'home'
        })) || []),
        ...(playout.awayCompetitorGoals?.map((time) => ({
          time: time / 10,
          team: 'away'
        })) || [])
      ].sort((a, b) => a.time - b.time)

      acc[matchId] = {
        goalEvents,
        finalScore: {
          home: playout.homeCompetitorScore,
          away: playout.awayCompetitorScore
        },
        halfTime: {
          home: playout.homeCompetitorHalfTimeScore,
          away: playout.awayCompetitorHalfTimeScore
        },
        status: ev.status
      }
      return acc
    }, {})
  } catch (error) {
    console.error('Error processing simulation data:', error)
    return {}
  }
})

const timerStarted = computed(() => currentTime.value > 0)
const timerEnded = computed(() => currentTime.value >= SIMULATION_DURATION)
const isWinner = computed(() => props.simulationResults.statusCode === 2)

const timerDisplay = computed(() => {
  if (!timerStarted.value) return 'Starting Game...'
  return `${currentTime.value * 10}'`
})

const formattedWinAmount = computed(() => {
  const amount = props.simulationResults.possibleWin
  return `${SportsbookGlobalVariable.Currency}${amount.toLocaleString('en')}`
})

// Methods
const handleSimulationExit = (action) => {
  if (action === 'skip') {
    currentTime.value = SIMULATION_DURATION
    clearInterval(intervalId.value)
    return
  }

  if (action === 'close') {
    emit('exit')
  }
}

// Lifecycle Hooks
onMounted(() => {
  currentTime.value = 0

  setTimeout(() => {
    intervalId.value = setInterval(() => {
      if (currentTime.value >= SIMULATION_DURATION) {
        currentTime.value = SIMULATION_DURATION
        clearInterval(intervalId.value)
        return
      }
      currentTime.value = +(currentTime.value + 0.1).toFixed(1)
    }, UPDATE_INTERVAL)
  }, INITIAL_DELAY)
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style>
#Simulate {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #353a45;
  color: var(--text-type1-primary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

#Simulate .ticket-wrapper {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  flex-grow: 1;
  overflow: auto;
}

#Simulate .ticket-wrapper .ticker-bar {
  align-items: center;
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  display: flex;
  justify-content: space-between;
}

#Simulate .ticket-wrapper .ticker-bar .left {
  font-family: 'Roboto-Medium';
}

#Simulate .ticket-wrapper .ticker-bar .rotate {
  transform: rotate(180deg);
}

#Simulate .border-bottom {
  border-bottom: 1px solid #eaecef;
  border-bottom-color: #eaecef;
}

#Simulate .c-pointer {
  cursor: pointer;
}

#Simulate .flex-center {
  align-items: center;
  display: flex;
}
</style>

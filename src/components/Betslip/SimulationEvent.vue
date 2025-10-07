<template>
  <div class="simulate-card pd-h-16 sim-card-mb-8" style="position: relative">
    <!-- Status Icon -->
    <span
      v-if="timerEnded"
      class="status-icon"
      :class="{ win: isSelectionWinner }"
      style="position: absolute; top: 5px; right: 5px"
    >
      <template v-if="simulationData?.status === 1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="green"
          class="bi bi-shield-fill-check"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
          />
        </svg>
      </template>
      <template v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="red"
          class="bi bi-x-octagon-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"
          />
        </svg>
      </template>
    </span>

    <!-- Match Details -->
    <div class="team-match size-12 pd-v-15">
      <span class="teamName size-12">{{ selection.homeTeam }}</span>
      <div class="teamScore">
        <template v-if="!timerEnded">
          <span class="teamScore__current">
            {{ currentScore.home }} - {{ currentScore.away }}
          </span>
        </template>
        <template v-else>
          <span class="teamScore__finished">
            {{ simulationData?.finalScore.home }} -
            {{ simulationData?.finalScore.away }}
          </span>
          <span class="teamScore__half">
            ({{ simulationData?.halfTime.home }} - {{ simulationData?.halfTime.away }})
          </span>
        </template>
      </div>
      <span class="teamName size-12">{{ selection.awayTeam }}</span>
    </div>

    <!-- Bet Details -->
    <div class="event-bet pd-t-10 pd-b-12">
      <div class="info">
        <span class="type__name">{{ selection.marketName }}</span>
        <div class="info-odds">{{ selection.outcomeName }} @ {{ selection.odds }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selection: {
    type: Object,
    required: true
  },
  simulationData: {
    type: Object,
    required: true
  },
  currentTime: {
    type: Number,
    required: true
  },
  timerEnded: {
    type: Boolean,
    required: true
  }
})

const currentScore = computed(() => {
  if (!props.simulationData) return { home: 0, away: 0 }

  return {
    home: props.simulationData.goalEvents.filter(
      (g) => g.team === 'home' && g.time <= props.currentTime
    ).length,
    away: props.simulationData.goalEvents.filter(
      (g) => g.team === 'away' && g.time <= props.currentTime
    ).length
  }
})

const isSelectionWinner = computed(() => props.simulationData?.status === 1)
</script>

<style scoped>
.simulate-card {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}

.simulate-card .teamScore {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 6rem;
  font-family: 'Roboto-Bold';
}

.simulate-card .teamScore .teamScore__finished {
  font-weight: bold;
}

.simulate-card .teamScore .teamScore__half {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-family: 'Roboto-Medium';
}

.team-match {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid #eaecef;
  border-bottom-color: #eaecef;
  font-family: 'Roboto-Medium';
}

.team-match .teamName {
  flex: 1.3;
}

.team-match .teamScore {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  font-family: 'Roboto-Bold';
}

.event-bet {
  display: flex;
  font-family: 'Roboto-Regular';
}

.event-bet .info {
  word-break: break-word;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.event-bet .info div {
  width: 50%;
}

.event-bet .info > div:first-child {
  text-align: center;
}

.event-bet .info > div:last-child {
  text-align: right;
}

.event-bet .info .info-odds {
  margin-left: 10px;
}

.size-12 {
  font-size: 1rem;
}

.pd-v-15 {
  padding: 1.25rem 0;
}

.pd-t-10 {
  padding-top: 0.83333333rem;
}

.pd-b-12 {
  padding-bottom: 1rem;
}

.pd-h-16 {
  padding: 0 1.33333333rem;
}

.sim-card-mb-8:not(:last-child) {
  margin-bottom: 0.66666667rem;
}
</style>

<template lang="">
  <div data-op="label-event-live" class="m-event-live x-live-row">
    <div class="m-event-meta">
      <span class="m-event-time">{{ displayTime }}</span>
      <span class="match-status">{{
        gameData.matchStatus == '1st half'
          ? 'H1'
          : gameData.matchStatus == '2nd half'
            ? 'H2'
            : gameData.matchStatus
      }}</span>
      <span class="m-league-name">{{ gameData.categoryName }} - {{ gameData.tournament }}</span>
      <div class="live-marker" data-cms-key="live">Live</div>
    </div>
    <div class="x-table-row x-live-table">
      <div
        @click="
          $router.push({
            name: 'live-fixtures-detail',
            params: {
              sport: slugify(gameData.sportName),
              tournament_name: slugify(gameData.tournament),
              event_name: slugify(gameData.name),
              event_id: gameData.matchID
            }
          })
        "
        class="x-table-cell m-info-cell"
      >
        <div class="team">{{ gameData.homeTeam }}</div>
        <div class="team">{{ gameData.awayTeam }}</div>
      </div>
      <div class="x-table-cell score">
        <div class="set-score">{{ scores.homeScore }}</div>
        <div class="set-score">{{ scores.awayScore }}</div>
      </div>

      <div class="x-table-cell m-market-cell">
        <div class="m-market m-event-market-default" style="position: relative">
          <template v-if="outcomes && outcomes.length">
            <div
              v-if="activeMarket.specifier !== ''"
              @click="toggleList"
              class="m-outcome m-event-outcome-default specifiers-select"
            >
              <div tabindex="0" class="grid-specifier-select">
                <div class="grid-specifier-select-label">
                  {{ activeSpecifier }}
                </div>
                <div class="grid-specifier-select-icon">
                  <em class="icon">^</em>
                </div>
              </div>
            </div>
            <div
              class="af-select-list m-event-specifiers-order"
              v-if="specifierOpen"
              :class="'af-select-list-' + gameData.matchID"
              style="width: 67px; opacity: 1; position: absolute; top: 37px; left: 0"
            >
              <span
                class="af-select-item"
                :class="{ 'af-select-item-active': activeSpecifier === item.value }"
                @click="setActiveSpecifier(item)"
                v-for="(item, i) in getSpecifiers"
                :key="i"
                >{{ item.value }}</span
              >
            </div>
            <LiveOdds
              v-for="(odd, index) in uniqueOutcomes(outcomes)"
              @click="addToBetslip(gameData, odd)"
              :selectionClass="
                isSelected(
                  createID(
                    gameData.gameID,
                    gameData.matchID,
                    odd.outcomeName,
                    odd.oddID,
                    gameData.name
                  ),
                  couponStore.coupon
                )
                  ? 'm-outcome--checked'
                  : ''
              "
              :key="index"
              :odds="odd"
            ></LiveOdds>
          </template>
          <EmptyOdds v-for="(odd, index) in activeMarket.outcomes" :key="index" v-else></EmptyOdds>
        </div>
      </div>
    </div>
    <div class="m-event-footer">
      <div class="m-market-size">+{{ gameData.activeMarkets }}&gt;</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import LiveOdds from './LiveOdds.vue'
import EmptyOdds from '@/components/EmptyOdds.vue'
import { sortArr, createID, isSelected, slugify } from '@/helpers'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { SIM_ALLOWED_MARKETS } from '@/helpers'
import { useMqttService } from '@/composables/useMqtt'

const couponStore = useCouponStore()
const updatePending = ref(false)

// Extract the subscribe function at the top level
const { subscribe } = useMqttService()

const props = defineProps({
  gameData: Object,
  activeMarket: Object
})

const activeSpecifier = ref()
const specifierOpen = ref(false)
const timer = ref(null)
const displayTime = ref(props.gameData.eventTime || '00:00')
const isClockStopped = ref(false)

const scores = ref({
  homeScore: props.gameData?.homeScore || 0,
  awayScore: props.gameData?.awayScore || 0
})

const outcomes = ref([])

// Keep track of updated odds
const updatedOutcomes = ref({})

// Keep track of the last update timestamp for each match
const lastUpdateTimestamp = ref({})

// Time handling functions
const parseTimeToSeconds = (timeStr) => {
  if (timeStr === '--:--') return null
  const [minutes, seconds] = timeStr.split(':').map(Number)
  return minutes * 60 + seconds
}

const formatSecondsToTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const startTimer = () => {
  stopTimer()

  const initialTime = parseTimeToSeconds(displayTime.value)
  if (initialTime === null || initialTime === 45 * 60 || initialTime === 90 * 60) return

  let currentSeconds = initialTime
  displayTime.value = formatSecondsToTime(currentSeconds)

  timer.value = setInterval(() => {
    currentSeconds++

    // Stop at key match times
    if (currentSeconds === 45 * 60 || currentSeconds === 90 * 60) {
      stopTimer()
      return
    }

    displayTime.value = formatSecondsToTime(currentSeconds)
  }, 1000)
}

// Function to handle fixture status updates
function handleFixtureStatus(data) {
  requestAnimationFrame(() => {
    // Check if match has ended
    if (data.status_code === 100) {
      // Emit event to parent to remove this fixture
      emitter.emit('match-ended', props.gameData.matchID)
      return
    }

    // Update scores
    scores.value.homeScore = data.home_score
    scores.value.awayScore = data.away_score

    // Update time and status
    displayTime.value = data.event_time
    props.gameData.matchStatus = data.match_status

    // Restart timer with new time
    startTimer()
  })
}

const getOdds = () => {
  if (props.activeMarket && props.gameData.activeMarkets > 0) {
    if (props.gameData.outcomes) {
      // Find and return the odds based on marketID and outcomeID
      const odds = props.gameData.outcomes
      let filtered = odds.filter((item) => item.marketID == props.activeMarket.marketID)
      let uniqueFiltered = uniqueOutcomes(filtered)

      // Apply any updates we've received from MQTT
      const updatedOutcomesList = uniqueFiltered.map((outcome) => {
        const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier}`
        if (updatedOutcomes.value[key]) {
          return {
            ...outcome,
            odds: updatedOutcomes.value[key].odds,
            active: updatedOutcomes.value[key].active
          }
        }
        return outcome
      })

      if (props.activeMarket.specifier && props.activeMarket.specifier !== '') {
        let defaultSpecifier = updatedOutcomesList[0]?.specifier
        if (defaultSpecifier) {
          const filteredBySpecifier = updatedOutcomesList.filter(
            (item) => item.specifier === defaultSpecifier
          )

          // Only update activeSpecifier if it's different to avoid recursive updates
          if (activeSpecifier.value !== defaultSpecifier.split('=')[1]) {
            activeSpecifier.value = defaultSpecifier.split('=')[1]
          }

          // Compare before updating to avoid unnecessary reactivity
          if (JSON.stringify(filteredBySpecifier) !== JSON.stringify(outcomes.value)) {
            outcomes.value = sortArr([...filteredBySpecifier], 'outcomeID')
          }
        }
      } else if (updatedOutcomesList.length) {
        // Compare before updating to avoid unnecessary reactivity
        const sortedOutcomes = sortArr([...updatedOutcomesList], 'outcomeID')
        if (JSON.stringify(sortedOutcomes) !== JSON.stringify(outcomes.value)) {
          outcomes.value = sortedOutcomes
        }
      } else if (outcomes.value.length > 0) {
        outcomes.value = []
      }
    }
  }
}

const getSpecifiers = computed(() => {
  if (props.activeMarket && props.activeMarket.specifier && props.activeMarket.specifier !== '') {
    const result = []

    const outcomes = props.gameData.outcomes
    if (outcomes.length > 0) {
      const filtered = outcomes.filter(
        (item) => item.marketID === parseInt(props.activeMarket.marketID)
      )

      let uniqueFiltered = uniqueOutcomes(filtered)

      uniqueFiltered.forEach((outcome) => {
        let specifier = outcome.specifier
        let found = result.find((item) => item.specifier === specifier)
        if (!found)
          // check if specifier has been listed
          result.push({ specifier, value: specifier.split('=')[1] }) //push value to array
      })
    }
    return result.sort((a, b) => a.value - b.value)
  } else {
    return []
  }
})

// set active specifier value
const setActiveSpecifier = (spec) => {
  if (props.gameData.outcomes) {
    // console.log(spec)
    const odds = props.gameData.outcomes
    let filtered = odds.filter((item) => item.marketID === parseInt(props.activeMarket.marketID))
    if (filtered) {
      let uniqueFiltered = uniqueOutcomes(filtered)
      uniqueFiltered = uniqueFiltered.filter((item) => item.specifier === spec.specifier)

      // Apply any updates we've received from MQTT
      uniqueFiltered = uniqueFiltered.map((outcome) => {
        const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier}`
        if (updatedOutcomes.value[key]) {
          return {
            ...outcome,
            odds: updatedOutcomes.value[key].odds,
            active: updatedOutcomes.value[key].active
          }
        }
        return outcome
      })

      outcomes.value = uniqueFiltered
      activeSpecifier.value = spec.value
      toggleList()
    }
  }
}

const toggleList = () => {
  specifierOpen.value = !specifierOpen.value
}

function addToBetslip(event, odd) {
  if (odd.odds <= 1) return
  const id = createID(event.gameID, event.matchID, odd.outcomeName, odd.oddID, event.name)
  let marketId = parseInt(odd.marketID)
  if (couponStore.betslipMode && !SIM_ALLOWED_MARKETS.includes(marketId)) {
    emitter.emit(
      'showErrorMessage',
      'This market is not supported in simulation mode. Exit Simulation mode to add to betslip'
    )
    return
  }
  const data = {
    fixture: event,
    market_name: props.activeMarket.marketName,
    market_id: odd.marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: 'live',
    event_id: event.gameID,
    specifier: props.activeMarket.specifier
  }

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

function handleOddsChange(data) {
  if (!data || !data.markets) return

  const matchId = props.gameData.matchID
  if (String(data.event_id) !== String(matchId)) return

  if (data.sport_event_status?.clock?.stopped !== undefined) {
    isClockStopped.value = data.sport_event_status.clock.stopped
    if (isClockStopped.value) {
      stopTimer()
    } else {
      startTimer()
    }
  }
  // Use requestAnimationFrame for smooth UI updates
  requestAnimationFrame(() => {
    // Update scores
    scores.value.homeScore = data.sport_event_status.home_score
    scores.value.awayScore = data.sport_event_status.away_score

    // Batch odds updates
    if (data.markets?.length > 0) {
      const updatedOutcomesCopy = { ...updatedOutcomes.value }

      data.markets.forEach((market) => {
        market.outcomes?.forEach((outcome) => {
          const key = `${market.id}-${outcome.id}-${market.specifiers || ''}`
          updatedOutcomesCopy[key] = {
            odds: outcome.odds,
            active: outcome.active ? 1 : 0
          }
        })
      })

      updatedOutcomes.value = updatedOutcomesCopy
      getOdds()
    }
  })
}

function handleBetStop(data) {
  const matchId = props.gameData.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`);
    return
  }

  // console.log(`📊 MQTT: Processing bet stop for match ID ${matchId}`);

  setTimeout(() => {
    const newOutcomes = outcomes.value.map((outcome) => ({
      ...outcome,
      odds: 0,
      active: 0
    }))

    const updatedOutcomesCopy = { ...updatedOutcomes.value }

    newOutcomes.forEach((outcome) => {
      const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ''}`
      updatedOutcomesCopy[key] = {
        odds: 0,
        active: 0,
        timestamp: Date.now()
      }
    })

    updatedOutcomes.value = updatedOutcomesCopy

    if (JSON.stringify(newOutcomes) !== JSON.stringify(outcomes.value)) {
      outcomes.value = newOutcomes
    }
  }, 0)
}

const uniqueOutcomes = (outcomes) => {
  let x = outcomes.filter(
    (outcome, index, self) =>
      index ===
      self.findIndex((o) => o.outcomeID == outcome.outcomeID && o.specifier == outcome.specifier)
  )
  return x
}

watch(
  () => displayTime.value,
  (newTime) => {
    if (newTime) {
      startTimer()
    }
  },
  { immediate: true }
)

watch(
  [() => props.activeMarket, () => props.gameData.outcomes],
  () => {
    // Use setTimeout to break potential update cycles
    setTimeout(() => {
      getOdds()
    }, 0)
  },
  { immediate: true }
)

onMounted(() => {
  // console.log(`🏗️ Component: Setting up MQTT subscriptions for match ID: ${props.gameData.matchID}`);

  // Initialize scores from props
  scores.value = {
    homeScore: props.gameData.homeScore,
    awayScore: props.gameData.awayScore
  }

  outcomes.value = props.gameData.outcomes || []
  getOdds()

  const matchId = props.gameData.matchID

  if (matchId) {
    const componentId = `live-highlights-fixture-${matchId}-${Date.now()}`

    const topics = {
      oddsChange: `feeds/live/odds_change/${matchId}`,
      betStop: `feeds/live/bet_stop/${matchId}`,
      fixtureStatus: `feeds/live/fixture_status/${matchId}`
    }

    const handlers = {
      oddsChange: handleOddsChange,
      betStop: handleBetStop,
      fixtureStatus: handleFixtureStatus
    }

    const unsubscribers = Object.entries(topics).map(([key, topic]) => {
      // console.log(`📊 Subscribing to ${key} on topic: ${topic}`);
      return subscribe(topic, (data) => {
        // console.log(`📊 MQTT: Received message on topic ${topic} for component ${componentId}`, data);
        handlers[key](data)
      })
    })

    onBeforeUnmount(() => {
      // console.log(`🧹 Component: Cleaning up MQTT subscriptions for match ID: ${matchId}`);
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      stopTimer()
    })
  }
})
</script>

<style scoped>
.m-table {
  display: block;
  width: 100%;
}

.m-table .m-table-row {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
}

.m-table .m-table-cell {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 1%;
}
/* Live Fixture */
.m-live-table .m-live-row {
  margin: 0 0.83333333rem;
}

.m-event-specifiers-order {
  padding: 0;
  text-align: center;
  background-color: #50545f;
  font-weight: bold;
  color: #f2f3f5;
}

.af-select-item-active {
  color: var(--brand-live-odds-text);
}
</style>

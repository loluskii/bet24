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
      <!-- <span class="m-league-name">{{ gameData.categoryName }} - {{ gameData.tournament }}</span> -->
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
        <div class="m-market m-event-market-default">
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
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import LiveOdds from './LiveOdds.vue'
import EmptyOdds from '@/components/EmptyOdds.vue'
import { sortArr, createID, isSelected, slugify } from '@/helpers'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { SIM_ALLOWED_MARKETS } from '@/helpers'
import { useMqttService } from '@/composables/useMqtt'

// Import MQTT service
const { subscribe } = useMqttService()

const couponStore = useCouponStore()

const props = defineProps({
  gameData: Object,
  activeMarket: Object
})

const scores = ref({
  homeScore: props.gameData?.homeScore || 0,
  awayScore: props.gameData?.awayScore || 0
})
const outcomes = ref([])
const timer = ref(null)
const displayTime = ref(props.gameData.eventTime || '00:00')

// Keep track of updated outcomes
const updatedOutcomes = ref({})

const activeSpecifier = ref()
const specifierOpen = ref(false)

const updatePending = ref(false)

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

// Watch for gameData changes to start timer
watch(
  () => displayTime.value,
  (newTime) => {
    if (newTime) {
      startTimer()
    }
  },
  { immediate: true }
)

const getOdds = () => {
  if (props.activeMarket && props.gameData.activeMarkets > 0) {
    if (props.gameData.outcomes) {
      // Find and return the odds based on marketID and outcomeID
      const odds = props.gameData.outcomes
      let filtered = odds.filter((item) => item.marketID == props.activeMarket.marketID)
      let uniqueFiltered = uniqueOutcomes(filtered)

      if (props.activeMarket.specifier && props.activeMarket.specifier !== '') {
        let defaultSpecifier = uniqueFiltered[0]?.specifier
        if (defaultSpecifier) {
          uniqueFiltered = uniqueFiltered.filter((item) => item.specifier === defaultSpecifier)
          activeSpecifier.value = defaultSpecifier.split('=')[1]
        }
      }

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

      if (uniqueFiltered.length) {
        outcomes.value = sortArr(uniqueFiltered, 'outcomeID')
      } else {
        outcomes.value = []
      }
    }
  }
}

const uniqueOutcomes = (outcomes) => {
  let x = outcomes.filter(
    (outcome, index, self) =>
      index ===
      self.findIndex((o) => o.outcomeID === outcome.outcomeID && o.specifier == outcome.specifier)
  )
  return x
}

watch(
  [() => props.activeMarket, () => props.gameData.outcomes],
  () => {
    getOdds()
  },
  { immediate: true }
)

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

// Function to handle odds changes
function handleOddsChange(data) {
  if (!data || !data.markets) return

  const matchId = props.gameData.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    return
  }

  if (!updatePending.value) {
    updatePending.value = true

    requestAnimationFrame(() => {
      scores.value.homeScore = data.sport_event_status.home_score
      scores.value.awayScore = data.sport_event_status.away_score

      const markets = data.markets || []

      if (markets.length > 0) {
        const updatedOutcomesCopy = { ...updatedOutcomes.value }

        markets.forEach((market) => {
          if (market.outcomes) {
            market.outcomes.forEach((outcome) => {
              const key = `${market.id}-${outcome.id}-${market.specifiers || ''}`
              updatedOutcomesCopy[key] = {
                odds: outcome.odds,
                active: outcome.active ? 1 : 0,
                timestamp: Date.now()
              }
            })
          }
        })

        updatedOutcomes.value = updatedOutcomesCopy

        if (outcomes.value.length > 0) {
          outcomes.value = outcomes.value.map((outcome) => {
            const market = markets.find(
              (m) => m.id === outcome.marketID && (m.specifiers || '') === (outcome.specifier || '')
            )

            if (market && market.outcomes) {
              const newOutcome = market.outcomes.find(
                (o) => String(o.id) === String(outcome.outcomeID)
              )

              if (newOutcome) {
                return {
                  ...outcome,
                  odds: newOutcome.odds,
                  active: newOutcome.active ? 1 : 0
                }
              }
            }

            return outcome
          })
        }
      }

      updatePending.value = false
    })
  }
}

// Function to handle bet stop
function handleBetStop(data) {
  // First, verify this update is for the correct match
  const matchId = props.gameData.matchID
  const dataMatchId = data.event_id || data.match_id

  // If the data doesn't match our event, ignore it
  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`);
    return
  }

  // console.log(`⚠️ BET STOP: Processing bet stop for match ID ${matchId}`);

  // Immediately suspend all outcomes in the component
  outcomes.value = outcomes.value.map((outcome) => ({
    ...outcome,
    odds: 0,
    active: 0
  }))
}

// Function to handle fixture status updates
function handleFixtureStatus(data) {
  // Handle match end
  if (data.status_code === 100) {
    stopTimer()
    emitter.emit('match-ended', props.gameData.matchID)
    return
  }

  requestAnimationFrame(() => {
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

onMounted(() => {
  // console.log(`🏗️ Component: Setting up MQTT subscriptions for match ID: ${props.gameData.matchID}`);

  scores.value = {
    homeScore: props.gameData.homeScore,
    awayScore: props.gameData.awayScore
  }

  outcomes.value = props.gameData.outcomes || []
  getOdds()

  const matchId = props.gameData.matchID

  if (matchId) {
    const componentId = `live-fixture-${matchId}-${Date.now()}`

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

const getSpecifiers = computed(() => {
  if (props.gameData.outcomes) {
    const odds = props.gameData.outcomes
    let filtered = odds.filter((item) => item.marketID == props.activeMarket.marketID)
    let uniqueFiltered = uniqueOutcomes(filtered)
    let specifiers = uniqueFiltered.map((item) => {
      return {
        value: item.specifier.split('=')[1],
        specifier: item.specifier
      }
    })
    let uniqueSpecifiers = specifiers.filter(
      (item, index, self) => index === self.findIndex((t) => t.value === item.value)
    )
    return uniqueSpecifiers
  }
  return []
})

function toggleList() {
  specifierOpen.value = !specifierOpen.value
}

function setActiveSpecifier(item) {
  activeSpecifier.value = item.value
  specifierOpen.value = false
  if (props.gameData.outcomes) {
    const odds = props.gameData.outcomes
    let filtered = odds.filter((odd) => odd.marketID == props.activeMarket.marketID)
    let uniqueFiltered = uniqueOutcomes(filtered)
    uniqueFiltered = uniqueFiltered.filter((odd) => odd.specifier === item.specifier)
    outcomes.value = sortArr(uniqueFiltered, 'outcomeID')
  }
}
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

.m-event-specifiers-order {
  padding: 0;
  text-align: center;
}
</style>

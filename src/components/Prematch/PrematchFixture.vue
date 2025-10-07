<template lang="">
  <div style="min-height: 102px; width: 100%">
    <div data-op="label-prematch" class="m-event-sport m-sports-row">
      <div class="m-event-meta">
        <div>
          <span class="m-time" style="margin-right: 5px">{{ eventData.eventTime }}</span>
          <span class="m-game-id" style="margin-right: 5px">ID {{ eventData.gameID }}</span>
          <span class="m-league-name"
            >{{ eventData.tournament }} - {{ eventData.categoryName }}</span
          >
        </div>
        <img
          src="@/assets/images/chart.png"
          style="height: 12px"
          alt=""
          @click="showFixtureAnalysis(eventData.matchID)"
          srcset=""
        />
      </div>
      <div class="x-table-row m-sports-table">
        <div
          class="x-table-cell m-info-cell"
          @click="
            $router.push({
              name: 'fixtures-detail',
              params: {
                sport: slugify(eventData.sportName),
                tournament_name: slugify(eventData.tournament),
                event_name: slugify(eventData.name),
                event_id: eventData.matchID
              }
            })
          "
        >
          <div class="team">{{ eventData.homeTeam }}</div>
          <div class="team">{{ eventData.awayTeam }}</div>
        </div>
        <div class="x-table-cell m-market-cell">
          <div class="m-market m-event-market-default market-id-1" style="position: relative">
            <template v-if="eventData.outcomes && eventData.activeMarkets > 0">
              <template v-if="outcomes.length">
                <div
                  v-if="activeMarket.specifier !== ''"
                  class="m-outcome m-event-outcome-default specifiers-select"
                  @click="toggleList"
                >
                  <div tabindex="0" class="grid-specifier-select">
                    <div class="grid-specifier-select-label">
                      {{ activeSpecifier }}
                    </div>
                    <div class="grid-specifier-select-icon">
                      <em class="icon">^</em>
                    </div>
                    <!---->
                  </div>
                </div>
                <div
                  class="af-select-list m-event-specifiers-order"
                  v-if="specifierOpen"
                  :class="'af-select-list-' + eventData.matchID"
                  style="width: 62px; opacity: 1; position: absolute; top: 34px; left: 0"
                >
                  <span
                    class="af-select-item"
                    @click="setActiveSpecifier(item)"
                    v-for="(item, i) in getSpecifiers"
                    :key="i"
                    >{{ item.value }}</span
                  >
                </div>
                <Odds
                  @click="addToBetslip(eventData, odd)"
                  v-for="(odd, index) in uniqueOutcomes(outcomes)"
                  :key="index"
                  :odds="odd"
                  :selectionClass="
                    isSelected(
                      createID(
                        eventData.gameID,
                        eventData.matchID,
                        odd.outcomeName,
                        odd.oddID,
                        eventData.name
                      ),
                      couponStore.coupon
                    )
                      ? 'm-outcome--checked'
                      : ''
                  "
                ></Odds>
              </template>
              <template v-else>
                <div
                  v-if="activeMarket.specifier !== ''"
                  class="m-outcome--disabled m-outcome m-event-outcome-default m-icon-lock"
                >
                  <span data-op="prematch-lock" class="m-icon-lock"></span>
                </div>
                <EmptyOdds v-for="(odd, index) in activeMarket.outcomes" :key="index"></EmptyOdds>
              </template>
            </template>
            <EmptyOdds v-else></EmptyOdds>
          </div>
        </div>
      </div>
      <div class="m-event-footer">
        <div class="m-market-size">+{{ eventData.activeMarkets }}</div>
      </div>
    </div>
  </div>
  <!---->
</template>
<script setup>
import { defineComponent, computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { createID, isSelected, sortArr, slugify } from '@/helpers'
import Odds from '@/components/Prematch/Odds.vue'
import EmptyOdds from '@/components/EmptyOdds.vue'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { SIM_ALLOWED_MARKETS } from '@/helpers'
import { useMqttService } from '@/composables/useMqtt'

const couponStore = useCouponStore()

const { subscribe } = useMqttService()

const props = defineProps({
  eventData: Object,
  activeMarket: Object
})

const activeSpecifier = ref()
const specifierOpen = ref(false)

const outcomes = ref([])
// Create a local copy of eventData outcomes that we can update
const localOutcomes = ref([])

// Keep track of updated odds
const updatedOutcomes = ref({})

// Add the updatePending ref
const updatePending = ref(false)

const getSpecifiers = computed(() => {
  if (props.activeMarket && props.activeMarket.specifier && props.activeMarket.specifier !== '') {
    const result = []

    // Always use props.eventData.outcomes as the base data
    const outcomes = props.eventData.outcomes
    if (outcomes && outcomes.length > 0) {
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

const uniqueMarkets = (markets) => {
  // console.log(markets)
  let x = markets.filter(
    (market, index, self) =>
      index ===
      self.findIndex((o) => o.marketID === market.marketID && o.specifier === market.specifier)
  )
  return x
}

const uniqueOutcomes = (outcomes) => {
  let x = outcomes.filter(
    (outcome, index, self) =>
      index ===
      self.findIndex((o) => o.outcomeID === outcome.outcomeID && o.specifier === outcome.specifier)
  )
  return x
}

const setActiveSpecifier = (spec) => {
  if (props.eventData.outcomes) {
    const odds = props.eventData.outcomes
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

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    'stats',
    'width=1078,height=768'
  )
}

const getOdds = () => {
  // Find and return the odds based on marketID and outcomeID
  if (props.activeMarket && props.eventData.activeMarkets > 0) {
    if (props.eventData.outcomes) {
      // Always start with the original data from props
      const odds = props.eventData.outcomes
      let filtered = odds.filter((item) => item.marketID === parseInt(props.activeMarket.marketID))
      let uniqueFiltered = uniqueOutcomes(filtered)

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

      if (props.activeMarket.specifier && props.activeMarket.specifier !== '') {
        let defaultSpecifier = uniqueFiltered[0]?.specifier
        if (defaultSpecifier) {
          uniqueFiltered = uniqueFiltered.filter((item) => item.specifier === defaultSpecifier)
          activeSpecifier.value = defaultSpecifier.split('=')[1]
        }
      }
      if (uniqueFiltered.length) {
        // console.log(_.sortBy(uniqueFiltered, 'outcomeID'))
        outcomes.value = sortArr(uniqueFiltered, 'outcomeID')
      } else {
        outcomes.value = []
      }
    }
  }
}

watch(
  () => props.activeMarket,
  () => {
    getOdds()
  },
  { immediate: true }
)

onMounted(() => {
  // console.log('🏗️ Component: Setting up MQTT subscriptions for match ID:', props.eventData.matchID)

  // Initialize outcomes from props
  localOutcomes.value = props.eventData.outcomes || []
  outcomes.value = props.eventData.outcomes || []
  getOdds()

  // Subscribe to prematch odds changes for this specific match
  const matchId = props.eventData.matchID

  if (matchId) {
    // Create a unique component ID to help with debugging
    const componentId = `prematch-fixture-${matchId}-${Date.now()}`

    // Subscribe to bet stop first (higher priority)
    const betStopTopic = `feeds/prematch/bet_stop/${matchId}`
    const unsubscribeBetStop = subscribe(betStopTopic, (data) => {
      // console.log(`⚠️ BET STOP: Received message on topic ${betStopTopic} for component ${componentId}`)
      handleBetStop(data)
    })

    // Then subscribe to odds changes
    const oddsChangeTopic = `feeds/prematch/odds_change/${matchId}`
    const unsubscribeOddsChange = subscribe(oddsChangeTopic, (data) => {
      // console.log(`📊 MQTT: Received message on topic ${oddsChangeTopic} for component ${componentId}`)
      handleOddsChange(data)
    })

    // Store unsubscribe functions for cleanup
    onBeforeUnmount(() => {
      // console.log(`🧹 Component: Cleaning up MQTT subscriptions for match ID: ${matchId}`)
      unsubscribeBetStop()
      unsubscribeOddsChange()
    })
  }
})

// Add a watch for eventData to check betslip when props change
watch(
  () => props.eventData,
  () => {
    // checkBetslipOnRefresh()
  },
  { deep: true }
)

// Function to handle odds changes
function handleOddsChange(data) {
  if (!data || !data.markets) return

  const matchId = props.eventData.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    return
  }

  if (!updatePending.value) {
    updatePending.value = true

    requestAnimationFrame(() => {
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
  const matchId = props.eventData.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`)
    return
  }

  // console.log(`⚠️ BET STOP: Processing bet stop for match ID ${matchId}`)

  outcomes.value = outcomes.value.map((outcome) => ({
    ...outcome,
    odds: 0,
    active: 0
  }))

  outcomes.value.forEach((outcome) => {
    const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ''}`
    updatedOutcomes.value[key] = {
      odds: 0,
      active: 0,
      timestamp: Date.now()
    }
  })

  const matchTime = new Date(props.eventData.startTime)
  const currentTime = new Date()

  if (matchTime < currentTime) {
    // console.log('Match time has passed, removing fixture:', props.eventData.matchID)
    emitter.emit('remove-fixture', props.eventData.matchID)
  }
}

function addToBetslip(event, odd) {
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
    type: 'prematch',
    event_id: event.gameID,
    specifier: odd.specifier
  }

  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

defineComponent({
  name: 'PrematchFixture',
  components: { Odds, EmptyOdds }
})
</script>
<style scoped>
.m-event-sport {
  border-top: 1px solid #eaecef;
  border-color: #eaecef;
  border-color: var(--brand-border-type1);
  display: block;
  padding: 0.66666667rem 0;
}
.m-event-sport:hover,
.m-event-sport:active,
.m-event-sport:visited {
  text-decoration: none;
}
.m-event-sport .m-event-meta {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #9ca0ab;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0.83333333rem;
  -webkit-box-pack: space-between;
  -webkit-justify-content: space-between;
  -ms-flex-pack: space-between;
  justify-content: space-between;
  line-height: 1.25rem;
}
.m-event-sport .m-event-meta > span {
  margin-right: 0.83333333rem;
}
.m-event-sport .m-event-meta > span:last-child {
  margin-right: 0;
}
.m-event-sport .m-event-meta .m-event-icon {
  display: inline-block;
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  margin: 0 0.33333333rem 0 -0.83333333rem;
}
.m-event-sport .m-event-meta .m-event-icon svg,
.m-event-sport .m-event-meta .m-event-icon img {
  height: 1.066rem;
  vertical-align: top;
}
.m-event-sport .m-event-meta .m-time {
  color: #353a45;
  color: var(--c-event-sport-time-text);
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  white-space: nowrap;
}
.m-event-sport .m-event-meta .m-game-id {
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  white-space: nowrap;
}
.m-event-sport .m-event-meta .m-league-name {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-event-sport .m-event-meta .event-labels {
  margin: 0 0.91666667rem 0 -0.83333333rem;
}
.m-event-sport .m-sports-table {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 0.66666667rem;
}
.m-event-sport .m-market-cell {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 55%;
}
.m-event-sport .m-market-cell .m-market .m-outcome {
  background: #d6ebdc;
  background: var(--brand-prematch-odds-bg);
  color: var(--brand-prematch-odds-text);
}
.m-event-sport .m-market-cell .m-market .m-outcome--checked {
  background-color: var(--brand-active-prematch-odds-bg);
  color: #ffffff;
}
.m-event-sport .m-market-cell .m-market .m-outcome--checked:before {
  color: #ffffff !important;
  color: var(--brand-tertiary) !important;
}
.m-event-sport .m-market-cell .m-market .m-outcome--disabled {
  background-color: #dcdee5;
  background-color: var(--c-prematch-outcome-disabled-bg);
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.m-event-sport .m-market-cell .m-market .m-outcome--up:before,
.m-event-sport .m-market-cell .m-market .m-outcome--down:before {
  color: #096b27;
  color: var(--brand-secondary);
}
.m-event-sport .m-info-cell > div {
  line-height: 1.4;
}
.m-event-sport .m-info-cell .team {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--c-event-sport-team-text);
  padding-right: 0.83333333rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-event-sport .m-event-footer {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 0.41666667rem;
}
.m-event-sport .m-event-footer .m-event-comment {
  color: #9ca0ab;
  font-size: 0.83333333rem;
}
.m-event-sport .m-market-size {
  color: #9ca0ab;
  font-size: 0.83333333rem;
  width: 45%;
}
.m-event-sport .m-market-size .media-icon {
  margin-left: 0.25rem;
}
.m-event-sport .m-market-size .media-icon + .media-icon {
  margin-left: 0.41666667rem;
}
.m-event-sport .m-market-size .sfm-icon {
  -webkit-transform: translateY(-1px);
  -ms-transform: translateY(-1px);
  transform: translateY(-1px);
}

.m-tab-active {
  background-color: var(--brand-secondary);
  color: #ffffff !important;
}

.m-sports-table .m-date-row {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 2rem;
  line-height: 2rem;
  padding: 0 0.83333333rem;
  z-index: 25 !important;
}
.m-sports-table .m-date-row .m-date {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1rem;
}
.m-sports-table .m-date-row .market-title {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  width: 55%;
}
.m-sports-table .m-date-row .market-title > div {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 0.83333333rem;
  text-align: center;
}
.m-sports-table .m-date-row .market-title .specifier-cell {
  min-width: 0;
  overflow: hidden;
}
.m-sports-table .m-sports-row {
  margin: 0 0.83333333rem;
}
.m-sports-table .m-inner-ads {
  display: block;
  margin: 0.83333333rem;
}
.m-sports-table .m-inner-ads img {
  display: block;
  width: 100%;
}

.af-select-item {
  display: inline-block;
  text-align: center;
  width: 100%;
}
.af-select-item.active {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
}
.af-select-item.hover {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}
</style>

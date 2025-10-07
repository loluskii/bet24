<template>
  <div>
    <div class="x-prematch-detail">
      <HeaderOther :headerTitle="'Details'"></HeaderOther>
      <div v-if="eventDetail && !isLoading">
        <div class="m-event-title">
          <div class="m-event-league link">
            {{ `${eventDetail.categoryName} - ` }} {{ eventDetail.tournament }}
          </div>
          <div class="m-event-title-team">
            <div class="homeTeamName">{{ eventDetail.name }}</div>
          </div>
          <div class="m-event-time-wrap">
            <div class="m-event-time-left">
              <span class="event-date">
                {{ formatDate(eventDetail.date, 'DD/MM dddd') }}
              </span>
              |
              <span class="event-time"> {{ formatDate(eventDetail.date, 'HH:mm') }}</span>
              <span class="live-in-play">Live In-Play Available</span>
              <span class="event-gameid">ID {{ eventDetail.matchID }}</span>
            </div>
          </div>
        </div>
        <div style="position: relative"></div>
        <div class="m-tab-navs-wrap">
          <ul class="m-tab-navs">
            <li
              class="m-nav-item"
              @click="isH2HShowing = false"
              :class="isH2HShowing ? '' : 'active'"
            >
              <i class="m-icon m-icon-market"></i>
              <span class="m-text">Markets</span>
            </li>
            <li
              class="m-nav-item"
              :class="!isH2HShowing ? '' : 'active'"
              @click="showFixtureAnalysis(eventDetail.matchID)"
            >
              <i class="m-icon m-icon-stat"></i>
              <span class="m-text">Stats</span>
            </li>
          </ul>
        </div>
        <div v-show="!isH2HShowing" class="m-sub-tab">
          <div v-if="eventDetail.statusCode === 0" class="m-market-group pre-match event-detail">
            <div class="m-sport-market">
              <div
                v-for="(marketGroup, index) in groupedMarkets"
                :key="index"
                :data-key="'market-' + marketGroup.marketID"
              >
                <div class="m-market m-detail-market-default">
                  <div class="m-market-title" style="flex-basis: 100%">
                    <span class="dis-icon"></span>
                    <span class="text" style="text-transform: capitalize"
                      >{{ marketGroup.marketName }}
                    </span>
                    <span class="m-icon-tips"></span>
                  </div>
                  <div class="m-table market-content">
                    <div
                      class="m-table-row"
                      v-for="(market, m) in getChunks(marketGroup.markets[0].outcomes)"
                      :key="m"
                    >
                      <template
                        v-if="marketGroup.specifier !== undefined && marketGroup.specifier === ''"
                      >
                        <template
                          v-for="(selection, odd) in sortByKey(market, 'outcomeID')"
                          :key="odd"
                        >
                          <div
                            class="m-table-cell m-outcome m-detail-outcome-default m-outcome-odds-des"
                            :class="{
                              'm-outcome--checked': isSelected(
                                createID(
                                  eventDetail.gameID,
                                  eventDetail.matchID,
                                  selection.outcomeName,
                                  selection.oddID,
                                  eventDetail.name
                                ),
                                couponStore.coupon
                              ),
                              'm-outcome-two': market.length === 2,
                              'm-outcome-three': market.length === 3,
                              'm-outcome--disabled': selection.odds < 1
                            }"
                            @click="addToBetslip(marketGroup, selection)"
                          >
                            <em style="text-transform: capitalize">{{
                              selection.displayName ?? selection.outcomeName
                            }}</em>
                            <em :class="{ 'm-icon-lock': selection.odds < 1 }">{{
                              selection.odds > 1 ? selection.odds.toFixed(2) : ''
                            }}</em>
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <div v-if="isTotalOrHandicap(marketGroup)" class="m-table">
                          <!-- <div class="m-table-row">
                            <div
                              class="m-table-cell m-outcome-combo-title m-outcome-row-specifier-combo-title"
                              :class="{
                                'm-outcome-row-three':
                                  (marketGroup.markets[0].outcomes).length + 1 === 3,
                                'm-outcome-row-four':
                                  (marketGroup.markets[0].outcomes).length + 1 === 4
                              }"
                            ></div>
                            <div
                              v-for="(name, index) in uniqueOutcomes(marketGroup.markets[0].outcomes)"
                              :key="index"
                              class="m-table-cell m-outcome-combo-title m-outcome-row-specifier-combo-title"
                              :class="{
                                'm-outcome-row-three':
                                  marketGroup.markets[0].outcomes.length + 1 === 3,
                                'm-outcome-row-four':
                                  marketGroup.markets[0].outcomes.length + 1 === 4
                              }"
                            >
                              {{ getOutcomeName(name.displayName) }}
                            </div>
                          </div> -->
                          <div
                            v-for="(mg, idx) in uniqueMarkets(marketGroup.markets)"
                            class="m-table-row"
                            :key="idx"
                          >
                            <!-- {{ mg }} -->
                            <div
                              class="m-table-cell m-table-cell m-outcome-only-odds m-outcome-combo-title m-specifier-colum-title"
                              :class="{
                                'm-outcome-three': uniqueOutcomes(mg.outcomes).length + 1 === 3,
                                'm-outcome-four': uniqueOutcomes(mg.outcomes).length + 1 === 4
                              }"
                            >
                              <em>{{ getSpecifierValue(mg.specifier) }}</em>
                            </div>
                            <template v-for="(outcome, o) in uniqueOutcomes(mg.outcomes)" :key="o">
                              <div
                                class="m-table-cell m-outcome-combo m-outcome-only-odds m-outcome m-detail-outcome-default"
                                @click="addToBetslip(mg, outcome)"
                                :class="{
                                  'm-outcome--checked': isSelected(
                                    createID(
                                      eventDetail.gameID,
                                      eventDetail.matchID,
                                      outcome.outcomeName,
                                      outcome.oddID,
                                      eventDetail.name
                                    ),
                                    couponStore.coupon
                                  ),
                                  'm-outcome-three': uniqueOutcomes(mg.outcomes).length + 1 === 3,
                                  'm-outcome-four': uniqueOutcomes(mg.outcomes).length + 1 === 4,
                                  'm-outcome--disabled': outcome.odds < 1
                                }"
                              >
                                <em :class="{ 'm-icon-lock': outcome.odds <= 1 }">{{
                                  outcome.odds > 1 ? outcome.odds.toFixed(2) : ''
                                }}</em>
                              </div>
                            </template>
                          </div>
                        </div>
                        <template
                          v-else
                          v-for="(selection, odd) in sortByKey(market, 'outcomeID')"
                          :key="odd"
                        >
                          <!-- {{ market }} -->
                          <div
                            class="m-table-cell m-outcome m-detail-outcome-default m-outcome-odds-des"
                            :class="{
                              'm-outcome--checked': isSelected(
                                createID(
                                  eventDetail.gameID,
                                  eventDetail.matchID,
                                  selection.outcomeName,
                                  selection.oddID,
                                  eventDetail.name
                                ),
                                couponStore.coupon
                              ),
                              'm-outcome-two': market.length === 2,
                              'm-outcome-three': market.length === 3,
                              'm-outcome--disabled': selection.odds < 1
                            }"
                            @click="addToBetslip(marketGroup, selection)"
                          >
                            <em style="text-transform: capitalize">{{
                              getMarketCode(selection.outcomeName)
                            }}</em>
                            <em :class="{ 'm-icon-lock': selection.odds < 1 }">{{
                              selection.odds > 1 ? selection.odds.toFixed(2) : ''
                            }}</em>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="m-sport-market-no-data">
            <div style="white-space: pre-line">
              Sorry, this game is no longer available. Betting has closed. Please choose other
              games.
            </div>
          </div>
        </div>
        <div v-show="isH2HShowing" class="m-sub-tab">
          <div class="m-h2h">
            <div id="sr-widget"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
  <ErrorDialogue v-else-if="!isLoading && !eventDetail" :message="errorMessage"></ErrorDialogue>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { defineComponent, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { getFixtureMarkets, chunks, formatDate, createID, isSelected } from '@/helpers'
// import _ from 'lodash'
import ErrorDialogue from '@/components/ErrorDialogue.vue'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { SIM_ALLOWED_MARKETS } from '@/helpers'
import { useMqttService } from '@/composables/useMqtt'

const { subscribe } = useMqttService()

const eventMarkets = ref()
const eventDetail = ref(null)
const groupedMarkets = ref([])
const isLoading = ref(false)
const route = useRoute()
const errorMessage = ref()
const couponStore = useCouponStore()
const homeTeam = ref()
const awayTeam = ref()
const isH2HShowing = ref(false)
const updatedOutcomes = ref({})
const updatePending = ref(false)
const unsubscribeFunctions = ref([])
const refetchInterval = ref(null)
const REFETCH_INTERVAL_MS = 60000 // 60 seconds

watch(
  () => [route.params.event_id, route.name],
  async ([event_id, route_name]) => {
    if (route_name === 'fixtures-detail') {
      await getEventDetail(event_id)
    }
  },
  { immediate: true }
)

function setupMqttSubscriptions(matchId) {
  const componentId = `fixture-detail-${matchId}-${Date.now()}`

  // Subscribe to odds changes
  const oddsChangeTopic = `feeds/prematch/odds_change/${matchId}`
  const unsubscribeOddsChange = subscribe(oddsChangeTopic, (data) => {
    // console.log(`📊 MQTT: Received message on topic ${oddsChangeTopic} for component ${componentId}`)
    handleOddsChange(data)
  })

  // Subscribe to bet stop
  const betStopTopic = `feeds/prematch/bet_stop/${matchId}`
  const unsubscribeBetStop = subscribe(betStopTopic, (data) => {
    // console.log(`⚠️ BET STOP: Received message on topic ${betStopTopic} for component ${componentId}`)
    handleBetStop(data)
  })

  // Store unsubscribe functions in ref
  unsubscribeFunctions.value = [unsubscribeOddsChange, unsubscribeBetStop]
}

function setupPeriodicRefetch(matchId) {
  // Clear any existing interval
  if (refetchInterval.value) {
    clearInterval(refetchInterval.value)
  }

  // Set up new interval
  refetchInterval.value = setInterval(async () => {
    if (eventDetail.value?.statusCode === 0) {
      // Only refetch if match is still available
      // console.log(`🔄 Periodic refetch for match ID: ${matchId}`)
      try {
        const res = await getFixtureMarkets(matchId)
        if (Object.keys(res).length && res.markets) {
          eventMarkets.value = res.markets
          groupedMarkets.value = groupByMarketID(res.markets)
          // console.log(`✅ Successfully refetched markets for match ID: ${matchId}`)
        }
      } catch (error) {
        console.error(`❌ Error during periodic refetch:`, error)
      }
    } else {
      // console.log(`⏹️ Match no longer available, stopping periodic refetch for match ID: ${matchId}`)
      clearInterval(refetchInterval.value)
    }
  }, REFETCH_INTERVAL_MS)

  // console.log(`⏱️ Set up periodic refetch every ${REFETCH_INTERVAL_MS/1000} seconds for match ID: ${matchId}`)
}

onBeforeUnmount(() => {
  // Clean up any active subscriptions
  if (unsubscribeFunctions.value.length > 0) {
    // console.log(`🧹 Component: Cleaning up MQTT subscriptions`)
    unsubscribeFunctions.value.forEach((unsubscribe) => unsubscribe())
    unsubscribeFunctions.value = []
  }

  // Clean up refetch interval
  if (refetchInterval.value) {
    // console.log(`🧹 Component: Cleaning up periodic refetch interval`)
    clearInterval(refetchInterval.value)
    refetchInterval.value = null
  }
})

async function getEventDetail(id) {
  isLoading.value = true
  try {
    const res = await getFixtureMarkets(id)
    if (Object.keys(res).length && res.markets) {
      eventDetail.value = res
      eventMarkets.value = res.markets
      groupedMarkets.value = groupByMarketID(res.markets)
      homeTeam.value = res.competitor1
      awayTeam.value = res.competitor2

      // Set up MQTT subscriptions after we have the event details
      if (res.matchID) {
        setupMqttSubscriptions(res.matchID)
        setupPeriodicRefetch(res.matchID)
      }
    } else {
      emitter.emit('showErrorMessage', {
        message: 'This event is no longer available',
        next_route: '/'
      })
    }
  } catch (error) {
    eventDetail.value = null
    emitter.emit('showErrorMessage', {
      message: error.message || 'Failed to load event details',
      next_route: 'home'
    })
  } finally {
    isLoading.value = false
  }
}

function isTotalOrHandicap(market) {
  return (
    (market.specifier.includes('total') &&
      uniqueOutcomes(market.markets[0].outcomes).length === 2) ||
    market.specifier.includes('hcp')
  )
}

const getMarketCode = (name) => {
  const homeTeamRegex = new RegExp(homeTeam.value, 'gi')
  const awayTeamRegex = new RegExp(awayTeam.value, 'gi')
  const drawRegex = /draw/gi
  const orRegex = /or/gi

  // Replace home team name with '1'
  name = name.replace(homeTeamRegex, '1')

  // Replace away team name with '2'
  name = name.replace(awayTeamRegex, '2')

  // Replace 'draw' with 'X'
  name = name.replace(drawRegex, 'X')

  // Replace 'or' with '/'
  name = name.replace(orRegex, '/')

  return name.trim()
}

function getSpecifierValue(specifier) {
  // Check if the specifier includes 'total=', 'hcp=', 'nr=' or 'variant=' and contains a numeric value after the '='
  if (!specifier.includes('|') && /total=|hcp=|nr=|variant=/.test(specifier)) {
    const value = specifier.split('=').pop()
    return !isNaN(parseFloat(value)) ? value : specifier.slice(-2)
  }

  // Check if specifier contains 'total' and includes '|'
  if (specifier.includes('|') && specifier.includes('total')) {
    const value = specifier.split('|')[0].split('=').pop()
    return !isNaN(parseFloat(value)) ? value : specifier.split('=')[1]
  }

  // Handle combined specifier
  const specs = specifier.split('|')
  if (specs.length > 1) {
    const combo2 = specs[1].split('=').pop()
    return combo2
  }

  // Default case
  return specifier.split('=')[0]
}

function sortByKey(array, key, ascending = true) {
  return array.slice().sort((a, b) => {
    const valA = parseInt(a[key], 10)
    const valB = parseInt(b[key], 10)

    if (isNaN(valA) || isNaN(valB)) {
      // Handle cases where parsing fails
      return 0
    }

    return ascending ? valA - valB : valB - valA
  })
}

const getChunks = (outcomes) => {
  let x = uniqueOutcomes(outcomes)
  return chunks(x)
}

const uniqueMarkets = (markets) => {
  // console.log(markets);
  let x = markets.filter(
    (market, index, self) =>
      index ===
      self.findIndex((o) => o.marketID === market.marketID && o.specifier === market.specifier)
  )
  return x
}

const uniqueOutcomes = (outcomes) => {
  let x = outcomes.filter(
    (outcome, index, self) => index === self.findIndex((o) => o.outcomeID === outcome.outcomeID)
  )
  return x
}

function groupByMarketID(data) {
  const groupedMarkets = {}
  data.forEach((marketGroup) => {
    const { marketID, marketName, specifier } = marketGroup
    if (!groupedMarkets[marketID]) {
      groupedMarkets[marketID] = {
        marketID,
        marketName,
        specifier,
        markets: [marketGroup]
      }
    } else {
      groupedMarkets[marketID].markets.push(marketGroup)
    }
  })
  return Object.values(groupedMarkets)
}

function addToBetslip(market, outcome) {
  if (outcome.odds <= 1) return
  let marketId = parseInt(market.marketID)
  if (couponStore.betslipMode && !SIM_ALLOWED_MARKETS.includes(marketId)) {
    emitter.emit(
      'showErrorMessage',
      'This market is not supported in simulation mode. Exit Simulation mode to add to betslip'
    )
    return
  }
  const id = createID(
    eventDetail.value.gameID,
    eventDetail.value.matchID,
    outcome.outcomeName,
    outcome.oddID,
    eventDetail.value.name
  )
  const data = {
    fixture: eventDetail.value,
    market_name: market.marketName,
    market_id: market.marketID,
    ele_id: id,
    outcome: outcome,
    odds: outcome.odds,
    odd_id: outcome.oddID,
    odd_name: outcome.outcomeName,
    type: 'prematch',
    event_id: eventDetail.value.gameID,
    specifier: market.specifier
  }
  // return couponStore.addToCoupon(data)
  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

const showFixtureAnalysis = (id, widgetName = 'headToHead.standalone') => {
  isH2HShowing.value = true
  const statWrapper = document.getElementById('sr-widget')
  window.SIR('addWidget', '#sr-widget', 'headToHead.standalone', {
    gamePulseBtnEnable: true,
    matchId: `${eventDetail.value.matchID}`
  })
}

function handleOddsChange(data) {
  if (!data || !data.markets) return

  const matchId = eventDetail.value.matchID
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

        if (eventMarkets.value.length > 0) {
          eventMarkets.value = eventMarkets.value.map((market) => {
            const updatedMarket = markets.find(
              (m) => m.id === market.marketID && (m.specifiers || '') === (market.specifier || '')
            )

            if (updatedMarket && updatedMarket.outcomes) {
              market.outcomes = market.outcomes.map((outcome) => {
                const newOutcome = updatedMarket.outcomes.find(
                  (o) => String(o.id) === String(outcome.outcomeID)
                )

                if (newOutcome) {
                  return {
                    ...outcome,
                    odds: newOutcome.odds,
                    active: newOutcome.active ? 1 : 0
                  }
                }
                return outcome
              })
            }
            return market
          })

          // Update grouped markets
          groupedMarkets.value = groupByMarketID(eventMarkets.value)
        }
      }

      updatePending.value = false
    })
  }
}

function handleBetStop(data) {
  const matchId = eventDetail.value.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`)
    return
  }

  // console.log(`⚠️ BET STOP: Processing bet stop for match ID ${matchId}`)

  // Suspend all markets
  if (eventMarkets.value.length > 0) {
    eventMarkets.value = eventMarkets.value.map((market) => ({
      ...market,
      outcomes: market.outcomes.map((outcome) => ({
        ...outcome,
        odds: 0,
        active: 0
      }))
    }))

    // Update grouped markets
    groupedMarkets.value = groupByMarketID(eventMarkets.value)
  }

  // Check if match time has passed
  const matchTime = new Date(eventDetail.value.date)
  const currentTime = new Date()

  if (matchTime < currentTime) {
    // console.log('Match time has passed, showing unavailable message')
    eventDetail.value.statusCode = 1 // This will trigger the "no longer available" message
  }
}

defineComponent({
  name: 'fixture-detail'
})

onMounted(() => {
  let script = document.createElement('script')
  script.text = `
    (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
    g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
    )})(window,document,"script", "https://widgets.sir.sportradar.com/9a7545262c211f21e8cdaf98d9b86856/widgetloader", "SIR", {
        theme: false, // using custom theme
        language: "en"
    });
    `
  // // script.type = 'text/javascript';
  // script.id = 'sr-tracker'
  // // script.src = 'https://widgets.sir.sportradar.com/sportradar/widgetloader';

  document.body.appendChild(script)
})
</script>

<style scoped>
.x-prematch-detail {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}

.x-prematch-detail .prematch-detail-loading {
  min-height: 15rem;
}

.x-prematch-detail .m-tab-navs {
  padding-bottom: 0.41666667rem;
}

.x-prematch-detail .m-tab-navs .m-icon-market::before {
  content: '\e66e';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-prematch-detail .m-tab-navs .m-icon-stat::before {
  content: '\e64a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-prematch-detail .m-tab-navs .m-icon-comment::before {
  content: '\e669';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-prematch-detail .m-event-title {
  margin: 0 0.83333333rem;
}

.x-prematch-detail .m-event-title .m-event-league {
  color: #353a45;
  font-size: 0.83333333rem;
  line-height: normal;
  padding-top: 0.33333333rem;
}

.x-prematch-detail .m-event-title .m-event-league.link {
  color: var(--brand-highlight-text);
  text-decoration: underline;
}

.x-prematch-detail .m-event-title .m-event-league.more-top-space {
  padding-top: 0.66666667rem;
}

.x-prematch-detail .m-event-title .m-event-title-team {
  color: #353a45;
  color: var(--text-default-dark);
  margin-top: 0.75rem;
}

.x-prematch-detail .m-event-title .m-event-title-team > div {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.066rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap {
  color: #353a45;
  color: var(--text-default-dark);
  font-size: 0.83333333rem;
  line-height: 0.91666667rem;
  padding: 0.33333333rem 0;
}

.x-prematch-detail .m-event-title .m-event-time-wrap > span {
  margin-right: 0.66666667rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .event-gameid {
  opacity: 0.5;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .live-in-play {
  margin: 0 0.33333333rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .live-in-play::before {
  content: '\e64e';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .live-in-play::before {
  font-size: 1rem;
  margin-right: 0.16666667rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .event-date .stv-icon {
  height: 1.41666667rem;
  width: 1.41666667rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .event-date::before {
  font-size: 0.83333333rem;
  margin-right: 0.16666667rem;
}

.x-prematch-detail .m-event-title .m-event-time-wrap .event-date .sfm-icon {
  -webkit-transform: translateY(-1px);
  -ms-transform: translateY(-1px);
  transform: translateY(-1px);
}

.x-prematch-detail .m-event-title .m-h2h {
  margin: 0 1.25rem;
  padding: 0.83333333rem 0;
}

.x-prematch-detail .m-event-title .event-labels {
  margin: 0.5rem 0 0 -0.83333333rem;
}

.x-prematch-detail .m-sport-market {
  overflow: hidden;
}

.x-prematch-detail .m-sport-market .m-market .market-content .m-outcome.m-outcome--disabled {
  background-color: #dcdee5;
  background-color: var(--disable-brand-secondary);
  color: #9ca0ab;
}

.x-prematch-detail .m-footer--preMatch {
  padding-bottom: 3.66666667rem;
}

.m-sport-market-no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #9ca0ab;
  min-height: 100px;
  /* padding: 5rem 2.33333333rem 10rem; */
  padding-left: 2.3rem;
  padding-right: 2.3rem;
  text-align: center;
}

.m-sport-market-no-data::before {
  content: '\e624';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-sport-market-no-data p {
  white-space: nowrap;
  color: #9ca0ab;
}

.m-sport-market-no-data .market-favor-empty-text {
  white-space: initial;
}

.m-sport-market-no-data:before {
  color: #333;
  color: var(--text-type2-secondary);
  font-size: 2.5rem;
}

@media only screen and (max-width: 320px) and (max-height: 480px) {
  .m-sport-market-no-data br {
    display: none;
  }
}

.m-tab-navs-wrap {
  width: 100%;
}

.m-tab-navs {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1.25rem 0.83333333rem;
  width: 100%;
}

.m-tab-navs > li {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  border-radius: 0.16666667rem;
  color: #353a45;
  color: var(--text-type1-primary);
  -webkit-box-flex: 1;
  -webkit-flex: auto;
  -ms-flex: auto;
  flex: auto;
  font-size: 1rem;
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin-right: 1px;
  position: relative;
  text-align: center;
  width: 33.33%;
}

.m-tab-navs > li:last-child {
  margin-right: 0;
}

.m-tab-navs > li.active {
  background-color: #1b1e25;
  background-color: var(--c-prematch-active-tab-bg);
  color: #ffffff;
  color: var(--c-prematch-active-tab-text);
}

.m-tab-navs > li.active .m-icon:before {
  color: #ffffff;
  color: var(--c-prematch-active-tab-text);
}

.m-tab-navs .m-icon:before {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  font-size: 1rem;
  line-height: 2.33333333rem;
}

.m-tab-navs .m-text {
  vertical-align: top;
}

.m-tab-navs .m-count-badge {
  background: #e41827;
  border: 1px solid #ffffff;
  border-radius: 0.54166667rem;
  color: #ffffff;
  font-size: 0.83333333rem;
  font-weight: bold;
  line-height: 0.91666667rem;
  min-width: 0.91666667rem;
  padding: 0 0.16666667rem;
  position: absolute;
  right: 0.41666667rem;
  text-align: center;
  top: -0.54166667rem;
}
</style>

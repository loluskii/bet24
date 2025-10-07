<template>
  <div>
    <div class="m-overview">
      <HeaderOther :header-title="'Live'" />
      <div class="m-live">
        <div v-if="isLoading">
          <LoadingSpinner />
        </div>
        <template v-else>
          <div
            class="nav-container"
            style="height: 85px; position: sticky; top: 0rem; z-index: 200"
          >
            <div class="m-snap-nav-wrap m-sport-type" style="overflow: scroll">
              <ul class="m-snap-nav flex">
                <li
                  v-for="(sport, s) in sportsListData"
                  :class="{ active: sport.sportID == activeSportID }"
                  :key="s"
                  class="m-sport-type-item m-snap-nav-item"
                  @click="setActiveSport(sport.sportID)"
                  :id="'live_' + sport.sportID"
                >
                  <span class="m-event-size">{{ sport.count }}</span>
                  <img
                    :src="getImageSrc(sport.sportID)"
                    loading="lazy"
                    width="22"
                    height="22"
                    style="filter: invert(1)"
                  />
                  <div class="m-sport-text">
                    {{ sport.sportName }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="Object.keys(filteredLiveData).length"
            class="m-bet-content"
            style="position: relative"
          >
            <div class="marketNavContainer" style="top: 72px">
              <div class="m-snap-nav-wrap m-mkt-type" style="overflow: hidden">
                <ul
                  class="m-snap-nav flex"
                  style="
                    transform: translate(0px, 0px) translateZ(0px);
                    transition-duration: 350ms;
                    transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
                  "
                >
                  <li
                    v-for="(market, m) in activeSportMarkets"
                    :key="m"
                    @click="selectMarket(market)"
                    :class="market.marketID === activeMarket.marketID ? 'active' : ''"
                    class="m-sport-type-item m-snap-nav-item"
                  >
                    {{ market.marketName }}
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="m-table m-live-table marketIndicatedStripe football"
              style="top: 112px; position: sticky; z-index: 24"
            >
              <div class="m-table-row m-name-row">
                <div class="m-table-cell m-name-cell">
                  <div class="m-name">
                    <template
                      v-for="(market, m) in _.sortBy(activeMarket.outcomes, 'outcomeID')"
                      :key="m"
                    >
                      <div class="market-name">
                        <span> {{ market.outcomeName }} </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <template v-for="(fixture, index) in filteredLiveData" :key="index">
              <div class="m-league">
                <div class="m-league-title">
                  <span class="text">{{ index }} - {{ fixture[0].tournament }}</span>
                  <span class="m-event-size"></span>
                </div>
                <div class="m-league-conent">
                  <div class="x-table x-live-table">
                    <LiveFixture
                      v-for="(f, i) in fixture"
                      :gameData="f"
                      :key="i"
                      :activeMarket="activeMarket"
                    ></LiveFixture>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="no-data">
            <div style="white-space: pre-line">
              Sorry, there are no games currently<br />available in this category. Please try
              later.<br />Thank you.
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import LiveFixture from '@/components/Live/LiveFixture.vue'
import { useUtilsStore, useCouponStore } from '@/stores'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useQuery } from 'vue-query'
import { getLiveHighlights } from '@/helpers'
import { defineComponent, onMounted, ref, computed, watch, onBeforeUnmount } from 'vue'
import HeaderOther from '@/components/HeaderOther.vue'
import _ from 'lodash'
import { useMqttService } from '@/composables/useMqtt'

const isEmptyResponse = ref(false)
const utilsStore = useUtilsStore()
const couponStore = useCouponStore()
const mqttService = useMqttService()
const unsubscribeFunctions = ref([])
const activeSportID = ref(utilsStore.activeLiveSportID || 1)

const getImageSrc = (sportId) => {
  const imageUrl = new URL(`../assets/images/sports/${sportId}.png`, import.meta.url)
  return imageUrl
}

const {
  data: completeLiveData,
  isLoading,
  refetch
} = useQuery('liveData', getLiveHighlights, {
  // Prevent automatic refetching which can cause recursive updates
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: false,
  // Use a longer stale time to prevent unnecessary refetches
  staleTime: 60000, // 1 minute
  // Add cacheTime to control how long data stays in cache
  cacheTime: 300000, // 5 minutes
  // Update refetch interval to 10 minutes
  refetchInterval: 60000 * 10, // 10 minutes
  // Add retry logic with exponential backoff
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return false
    }
    return failureCount < 3 // retry up to 3 times
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (err) => {
    console.error('Error fetching live data:', err)
  },
  onSuccess: (response) => {
    if (response.fixtures) {
      // Check if betslip selections exist in current event list
      // checkBetslipSelectionsExist();
    } else {
      // Instead of setting isEmptyResponse, update existing fixtures to inactive state
      if (completeLiveData.value?.fixtures) {
        completeLiveData.value.fixtures = completeLiveData.value.fixtures.map((fixture) => ({
          ...fixture,
          outcomes: fixture.outcomes.map((outcome) => ({
            ...outcome,
            odds: 0,
            active: false
          }))
        }))
      }
      isEmptyResponse.value = true
    }
  }
})

const sportsListData = computed(() => {
  if (isEmptyResponse.value) {
    return []
  } else {
    const sportCountMap = new Map()

    completeLiveData.value?.fixtures?.forEach((fixture) => {
      const key = fixture.sportName
      if (sportCountMap.has(key)) {
        const sportData = sportCountMap.get(key)
        sportData.count += 1
      } else {
        sportCountMap.set(key, {
          sportID: fixture.sportID,
          sportName: fixture.sportName,
          count: 1
        })
      }
    })

    // Convert Map to array and sort it by sportID
    const uniqueList = Array.from(sportCountMap.values()).sort((a, b) => a.sportID - b.sportID)

    return uniqueList
  }
})

const filteredLiveData = computed(() => {
  let fixtures =
    completeLiveData.value?.fixtures && !isEmptyResponse.value
      ? completeLiveData.value?.fixtures
          ?.filter((s) => s.sportID == activeSportID.value)
          .sort((a, b) => {
            // First sort by tournamentID
            if (a.tournamentID !== b.tournamentID) {
              return a.tournamentID - b.tournamentID
            }
            // If same tournament, maintain original order
            return 0
          })
      : []

  return _.groupBy(fixtures, 'categoryName')
})

const marketsGroup = computed(() => {
  let markets =
    completeLiveData.value?.fixtures && !isEmptyResponse.value
      ? completeLiveData.value?.markets
      : []
  // activeSportMarkets.value = _.sortBy(markets, 'marketID')
  // activeMarket.value = activeSportMarkets.value[0]
  return markets
})

const activeSportMarkets = computed(() => {
  let activeMarkets = marketsGroup.value.filter((s) => s.sportID == activeSportID.value)
  return activeMarkets ? _.sortBy(activeMarkets, 'marketID') : []
})

const activeMarket = computed(() => {
  return utilsStore.activeLiveMarkets
})

watch(activeSportMarkets, (newValue) => {
  // Update activeMarket when activeSportMarkets changes
  if (newValue.length) {
    utilsStore.activeLiveMarkets = newValue[0]
  } else {
    utilsStore.activeLiveMarkets = []
  }
})

function setActiveSport(sid) {
  activeSportID.value = parseInt(sid)
  // let markets = marketsGroup.value.filter((s) => s.sportID == activeSportID.value)
  // activeSportMarkets.value = _.sortBy(markets, 'marketID')
  // activeMarket.value = activeSportMarkets.value[0]
  document.getElementById('live_' + sid).scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

function selectMarket(market) {
  utilsStore.activeLiveMarkets = market
}

// Function to handle odds changes
const handleOddsChange = (data) => {
  // console.log('⚙️ LiveView: Received odds change:', data)

  if (!completeLiveData.value?.fixtures) {
    // console.log('⚙️ LiveView: No fixtures data available, skipping odds update')
    return
  }

  // Find and update the fixture with matching matchID
  const fixtureIndex = completeLiveData.value.fixtures.findIndex(
    (fixture) => String(fixture.matchID) === String(data.matchID)
  )

  if (fixtureIndex !== -1) {
    // console.log(`⚙️ LiveView: Updating odds for match ID ${data.matchID}`)

    // Update the fixture's outcomes
    completeLiveData.value.fixtures[fixtureIndex] = {
      ...completeLiveData.value.fixtures[fixtureIndex],
      outcomes: completeLiveData.value.fixtures[fixtureIndex].outcomes.map((outcome) => {
        if (String(outcome.outcomeID) === String(data.outcomeID)) {
          return {
            ...outcome,
            odds: data.odds,
            active: data.active
          }
        }
        return outcome
      })
    }
  }
}

// Function to handle bet stops
const handleBetStop = (data) => {
  // console.log('⚙️ LiveView: Received bet stop:', data)

  if (!completeLiveData.value?.fixtures) {
    // console.log('⚙️ LiveView: No fixtures data available, skipping bet stop update')
    return
  }

  // Find and update the fixture with matching matchID
  const fixtureIndex = completeLiveData.value.fixtures.findIndex(
    (fixture) => String(fixture.matchID) === String(data.matchID)
  )

  if (fixtureIndex !== -1) {
    // console.log(`⚙️ LiveView: Processing bet stop for match ID ${data.matchID}`)

    // Update all outcomes to be inactive with odds 0
    completeLiveData.value.fixtures[fixtureIndex] = {
      ...completeLiveData.value.fixtures[fixtureIndex],
      outcomes: completeLiveData.value.fixtures[fixtureIndex].outcomes.map((outcome) => ({
        ...outcome,
        odds: 0,
        active: false
      }))
    }
  }
}

// Function to set up MQTT subscriptions
const setupMqttSubscriptions = () => {
  // console.log('⚙️ LiveView: Setting up MQTT subscriptions')

  if (!completeLiveData.value?.fixtures) {
    // console.log('⚙️ LiveView: No fixtures available for MQTT subscriptions')
    return
  }

  // Get unique match IDs from fixtures
  const matchIds = [
    ...new Set(completeLiveData.value.fixtures.map((fixture) => String(fixture.matchID)))
  ]

  // Subscribe to odds changes and bet stops for each match
  matchIds.forEach((matchId) => {
    const oddsChangeUnsubscribe = mqttService.subscribe(`odds_change/${matchId}`, handleOddsChange)

    const betStopUnsubscribe = mqttService.subscribe(`bet_stop/${matchId}`, handleBetStop)

    unsubscribeFunctions.value.push(oddsChangeUnsubscribe, betStopUnsubscribe)
  })
}

onMounted(async () => {
  if (completeLiveData.value && completeLiveData.value.fixtures.length) {
    activeSportID.value = completeLiveData.value.fixtures[0].sportID
    setupMqttSubscriptions()
  }
})

onBeforeUnmount(() => {
  // Clean up MQTT subscriptions
  unsubscribeFunctions.value.forEach((unsubscribe) => unsubscribe())
  unsubscribeFunctions.value = []
})

defineComponent({
  methods: {
    // Manually trigger a refetch without making a new network request
    handleManualRefetch() {
      refetch()
    }
  }
})

// Add watcher for activeSportID to update store
watch(activeSportID, (newValue) => {
  utilsStore.activeLiveSportID = newValue
})

// Add watcher for sportsListData to set activeSportID
watch(
  sportsListData,
  (newSportsList) => {
    if (newSportsList.length > 0) {
      // Only set activeSportID if it's not already set or not in the list
      if (
        !activeSportID.value ||
        !newSportsList.some((sport) => sport.sportID === activeSportID.value)
      ) {
        activeSportID.value = newSportsList[0].sportID
      }
    }
  },
  { immediate: true }
)
</script>

<style>
.m-overview {
  background-color: #1b1e25;
  background-color: var(--brand-background-live);
  position: relative;
  min-height: 50vh;
}
.m-overview .schedule {
  font-size: 1.066rem;
  padding-right: 1rem;
}
.m-overview .m-nav-secondary .home-link {
  height: 100%;
  padding: 0 1rem;
}
.m-overview .m-loading.dark {
  background-color: #1b1e25;
  background-color: var(--brand-background-live);
}
.m-overview .m-live {
  color: #ffffff;
  color: var(--text-type2-primary);
}
.m-overview .m-live.isQuickMarketPanelOpen {
  position: relative;
  z-index: 300;
}
.m-overview .m-live.isQuickMarketPanelOpen .nav-container {
  position: relative;
  z-index: 1;
}
.m-overview .m-live .m-sport-bet-error {
  padding: 2.5rem 0 0.83333333rem;
}
.m-overview .m-live .no-live-virtual-data {
  font-family: 'Roboto-Regular';
  font-size: 1.066rem;
  padding: 10rem 1.33333333rem;
  text-align: center;
}
.m-overview .m-live .no-data {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  padding: 3.33333333rem 2.33333333rem;
  text-align: center;
}
.m-overview .m-live .no-data::before {
  content: '\e624';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-overview .m-live .no-data:before {
  color: rgba(234, 236, 239, 0.15);
  font-size: 2.5rem;
}
.m-overview .m-live .m-loading-wrap {
  margin-top: 15%;
}
.m-overview .m-live.fixed .m-sport-type {
  position: fixed;
  width: 100vw;
}
.m-overview .m-live.fixed .m-sport-type.fixBottom {
  bottom: 0;
  position: absolute;
  top: auto;
}
.m-overview .m-live.fixed .marketIndicatedStripe,
.m-overview .m-live.fixed .m-filter-bar,
.m-overview .m-live.fixed .marketNavContainer {
  position: -webkit-sticky;
  position: sticky;
}
.m-overview .m-live.fixed .marketIndicatedStripe {
  z-index: 1;
}
.m-overview .m-live.fixed .m-filter-bar {
  z-index: 2;
}
.m-overview .m-live.fixed .marketNavContainer {
  z-index: 3;
}
.m-overview .m-live .m-sport-type {
  background-color: #1b1e25;
  background-color: var(--brand-background-live);
  left: 0;
  padding: 0.83333333rem 0 0;
  position: relative;
  top: -1px;
  z-index: 25;
}
.m-overview .m-live .m-sport-type .m-sport-type-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #dcdee5;
  -webkit-box-flex: 0;
  -webkit-flex: none;
  -ms-flex: none;
  flex: none;
  font-size: 1rem;
  line-height: 1.066rem;
  min-height: 4.83333333rem;
  padding: 0.91666667rem 0.25rem 0.33333333rem;
  position: relative;
  text-align: center;
  width: 5rem;
}
.m-overview .m-live .m-sport-type .m-sport-type-item:first-child {
  margin-left: 0.83333333rem;
}
.m-overview .m-live .m-sport-type .m-sport-type-item:last-child {
  margin-right: 0.83333333rem;
}
.m-overview .m-live .m-sport-type .m-sport-type-item.active {
  border-bottom: 3px solid var(--brand-secondary);
  color: #ffffff;
}
.m-overview .m-live .m-sport-type .m-sport-type-item.active .m-sport-icon:before {
  color: #ffffff;
}
.m-overview .m-live .m-sport-type .m-sport-type-item .m-event-size {
  background: #393c43;
  border-radius: 0.16666667rem;
  color: var(--brand-live-odds-text);
  display: block;
  font-size: 0.83333333rem;
  line-height: 0.91666667rem;
  min-width: 1.66666667rem;
  position: absolute;
  right: 0.91666667rem;
  text-align: center;
  top: 0.25rem;
}
.m-overview .m-live .m-sport-type .m-sport-type-item .m-sport-icon:before {
  color: #dcdee5;
  font-size: 1.66666667rem;
  line-height: 1;
  vertical-align: top;
}
.m-overview .m-live .m-sport-type .m-sport-type-item .m-sport-text {
  margin-top: 0.25rem;
  white-space: normal;
}
.m-overview .m-live .marketNavContainer {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: var(--brand-background-live);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  position: sticky;
  z-index: 24;
}
.m-overview .m-live .m-mkt-type {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}
.m-overview .m-live .m-mkt-type .m-sport-type-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.066rem;
  padding: 0.91666667rem 1rem;
}
.m-overview .m-live .m-mkt-type .m-sport-type-item.active {
  border-bottom: 2px solid var(--brand-secondary);
}
.m-overview .m-live .m-league {
  margin: 0;
}
.m-overview .m-live .m-league .m-league-title {
  background-color: #1b1e25;
  background-color: var(--brand-background-live);
  border-bottom: 1px solid rgba(242, 243, 245, 0.15);
  border-top: 0;
  color: #ffffff;
  color: var(--text-type2-primary);
}
.m-overview .m-live .m-league .m-league-conent {
  margin-bottom: 0;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table .m-name-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-overview
  .m-live
  .m-league
  .m-league-conent
  .m-live-table
  .m-name-row
  .m-name-cell
  .m-name
  > div {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table .m-live-title-row {
  padding-bottom: 0.33333333rem;
  padding-top: 0.83333333rem;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table .m-live-title-row .m-market-size {
  color: var(--brand-secondary);
  text-align: right;
}
.m-overview
  .m-live
  .m-league
  .m-league-conent
  .m-live-table
  .m-live-title-row
  .m-market-size:after {
  color: var(--brand-secondary);
  content: '\e608';
  display: inline-block;
  font-family: 'iconfont';
  text-indent: 0.83333333rem;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table .m-live-title-row .game-id {
  color: #9ca0ab;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table.tennis .m-info-cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0.83333333rem;
  width: 26%;
}
.m-overview .m-live .m-league .m-league-conent .m-live-table.tennis .game-score,
.m-overview .m-live .m-league .m-league-conent .m-live-table.tennis .point {
  color: #dcdee5;
  opacity: 0.5;
}
.m-overview .m-live .m-filter-bar {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #1b1e25;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1.25rem 1.33333333rem 1rem 0.83333333rem;
  text-align: right;
  width: 100%;
}
.m-overview .m-live .m-filter-bar label {
  margin-left: 0.83333333rem;
}
.m-overview .m-live .m-filter-bar .auto-accept-change {
  margin-left: auto;
}
.m-overview .m-live-upcoming {
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 1.66666667rem 0;
}
.m-overview .m-live-upcoming .m-title {
  color: #000000;
  color: var(--text-default);
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.83333333rem;
  margin-bottom: 0.75rem;
  margin-left: 1.33333333rem;
}
.m-overview .m-live-upcoming .m-mkt-type {
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
  position: -webkit-sticky;
  position: sticky;
  width: 100%;
  z-index: 24;
}
.m-overview .m-live-upcoming .m-mkt-type .m-sport-type-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.066rem;
  padding: 0.91666667rem 1rem;
  color: #000000;
  color: var(--text-default);
}
.m-overview .m-live-upcoming .m-mkt-type .m-sport-type-item.active {
  border-bottom: 2px solid var(--brand-secondary);
}
.m-overview .nav-filter {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-overview .m-overlay {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  top: 7.58333333rem;
  width: 100%;
  z-index: 220;
}
.m-overview .m-filter-pop.m-filter {
  border-top: 1px solid #eaecef;
  position: fixed;
  top: 7.58333333rem;
  z-index: 221;
}
.m-overview .selected-broadcast-wrapp {
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0 0.83333333rem;
}
.m-bottom-nav {
  background-color: #353a45;
}
.m-overlay-sort-menu {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 220;
}
.m-live-table .m-name-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-live-table .m-name-row .market-name {
  min-width: 0;
  overflow: hidden;
}
.m-live-table .m-name-row .market-name .specifier-cell {
  min-width: 0;
  overflow: hidden;
}
.m-live-table .m-name-row .m-name-cell {
  background: var(--brand-background-live);
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
  color: #9ca0ab;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0 0.83333333rem;
}
.m-live-table .m-name-row .m-name-cell .m-name {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 55%;
}
.m-live-table .m-name-row .m-name-cell .m-name > div {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
</style>

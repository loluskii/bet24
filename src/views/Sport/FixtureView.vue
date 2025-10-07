<template>
  <div class="m-event-list" id="m-event-list" ref="container">
    <div class="mt-lg-4 pt-lg-4" style="width: 100%; height: 48px"></div>
    <HeaderGame :SportsName="getActiveSport"></HeaderGame>
    <ChooseBarPad :active-sport="getActiveSport" />
    <template v-if="!isLoading && !isEmptyResponse">
      <div v-show="marketsGroup?.length" class="m-sanp-nav-container" id="m-sanp-nav-container">
        <div
          class="m-snap-nav-wrap m-sport-type has-live"
          :class="{ 'm-sport-type-fixed': isTop }"
          style="overflow: auto"
        >
          <ul class="m-snap-nav flex">
            <li
              v-for="(market, m) in marketsGroup"
              :key="m"
              :class="market.marketID === activeMarket.marketID ? 'active' : ''"
              class="m-sport-type-item m-snap-nav-item"
              @click="selectMarket(market)"
            >
              {{ market.marketName }}
            </li>
          </ul>
          <!-- <i class="controls left-controls"></i> <i class="controls right-controls"></i> -->
        </div>
      </div>
      <div class="m-bet-content" style="position: relative">
        <FixtureGroupingTournament
          :fixtures-list="fixturesList"
          :active-market="activeMarket"
          v-if="fixtureGroupingType === 'tournament'"
        />
        <FixtureGroupingDefault
          :fixtures-list="fixturesList"
          :active-market="activeMarket"
          v-else
        />
        <LoadingSpinner v-show="fetchingMore"></LoadingSpinner>
      </div>
    </template>
    <div id="scroll-sentinel" style="height: 10px"></div>
    <LoadingSpinner v-show="isLoading"></LoadingSpinner>
    <LoadingError v-show="loadingError && !isLoading"></LoadingError>
    <div v-if="isEmptyResponse && !loadingError" class="no-data">
      <div style="white-space: pre-line">
        <p>Sorry, there are no games currently available</p>
        <p>in this category. Please try later.</p>
        <p>Thank you.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, watch, onMounted, computed, onUnmounted } from 'vue'
import HeaderGame from '@/components/HeaderGame.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import LoadingError from '@/components/Loaders/LoadingError.vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import { useUtilsStore } from '@/stores'
import ChooseBarPad from '@/components/ChooseBarPad.vue'
import FixtureGroupingTournament from '@/components/FixtureGrouping/FixtureGroupingTournament.vue'
import FixtureGroupingDefault from '@/components/FixtureGrouping/FixtureGroupingDefault.vue'
import {
  getFixturesByCategories,
  getFixturesByTournamentId,
  getSportUpcoming,
  getToday2,
  extractIdsFromURL,
  getDateRange,
  FEED_TOGGLE
} from '@/helpers'
import emitter from '@/plugins/emitter'

const isEmptyResponse = computed(() => {
  const list = fixturesList.value
  return (
    !isLoading.value &&
    (list === null ||
      (Array.isArray(list) && list.length === 0) ||
      (typeof list === 'object' && Object.keys(list).length === 0))
  )
})

const utilsStore = useUtilsStore()
const route = useRoute()
const fixturesList = ref(null)

const marketsGroup = ref({})
const activeMarket = ref({})

const isLoading = ref(false)
const loadingError = ref(false)

const page = ref(1)
const isPaginated = ref(false)
const fetchingMore = ref(false)
const container = ref(null)
const isLastPage = ref(false)

const fixtureGroupingType = computed(() => {
  return fixturesList.value !== null && !Array.isArray(fixturesList.value)
    ? 'tournament'
    : 'default'
})

// const filterQuery = ref()

const getSportbyName = (name) => {
  return utilsStore.sportsMenu.find((x) => x.sportName == name)
}

const getActiveSport = computed(() => {
  return getSportbyName(route.params.sport)
})

watch(
  () => [route.name, route.query.period, route.query.startDate, route.query.endDate],
  async ([routeName, period, startDate, endDate]) => {
    const { sportID } = getSportbyName(route.params.sport)
    const { tournament_id } = route.params
    const { category_id } = route.params
    switch (routeName) {
      case 'fixtures-by-tournaments':
        await getTournamentFixtures(sportID, tournament_id)
        break

      case 'fixtures-by-category':
        await getCategoryFixtures(sportID, category_id)
        break

      case 'today-fixtures':
        await fetchTodayActiveSport(sportID)
        break

      case 'fixtures-by-sports':
        if (period) {
          if (startDate && endDate) {
            await fetchActiveSportByCustomRange(sportID, startDate, endDate)
          } else {
            await fetchActiveSportByPeriod(sportID, period)
          }
        } else {
          await fixturesByActiveSport(sportID)
        }
        break

      default:
        // Handle other routes or provide a default behavior
        break
    }
    // console.log(container.value.clientHeight)
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getTournamentFixtures(sid) {
  if(!FEED_TOGGLE) return;
  const routeExtractedTIds = extractIdsFromURL(route.params.tournaments, 'tournament')

  try {
    isLoading.value = true
    const results = await Promise.allSettled(
      routeExtractedTIds.map((cat) =>
        getFixturesByTournamentId(cat.tournamentID, sid, route.query?.period)
      )
    )
    const fixtures = results.reduce((acc, res) => {
      if (res.status === 'fulfilled' && res.value.fixtures) {
        let filteredData = res.value.fixtures.filter((f) => f.activeMarkets > 0)
        acc = { ...acc, ..._.groupBy(filteredData, 'tournament') }
      }
      return acc
    }, {})

    fixturesList.value = { ...fixtures }
    marketsGroup.value =
      results[0].status === 'fulfilled' && Object.keys(results[0].value).length > 0
        ? results[0].value?.markets
        : {}
    activeMarket.value = marketsGroup.value ? marketsGroup.value[0] : []
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    isLoading.value = false
  }
}

async function getCategoryFixtures(sid, cid) {
  if(!FEED_TOGGLE) return;
  try {
    const res = await getFixturesByCategories(sid, cid)
    isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
    let filteredData = res.fixtures.filter((f) => f.activeMarkets > 0)
    fixturesList.value = _.groupBy(filteredData, 'tournament')
    marketsGroup.value = res.markets
    activeMarket.value = marketsGroup.value ? marketsGroup.value[0] : []
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function fetchActiveSportByPeriod(id, period) {
  if(!FEED_TOGGLE) return;
  try {
    isLoading.value = true
    let selectedPeriod = getDateRange(period)
    const res = await getSportUpcoming(id, selectedPeriod)
    if (res.fixtures) {
      isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
      let filteredData = res.fixtures.filter((f) => f.activeMarkets > 0)
      fixturesList.value = _.groupBy(filteredData, 'tournament')
      isLastPage.value = res.lastPage === page.value
      marketsGroup.value = res.markets
      activeMarket.value = marketsGroup.value ? marketsGroup.value[0] : []
      isLoading.value = false
    } else {
      throw Error
    }
  } catch (error) {
    isLoading.value = false
    isEmptyResponse.value = true
    console.error(error)
  }
}

async function fetchActiveSportByCustomRange(sid, start, end) {
  if(!FEED_TOGGLE) return;
  try {
    isLoading.value = true
    let selectedPeriod = { startDate: start, endDate: end }
    const res = await getSportUpcoming(sid, selectedPeriod)
    if (res.fixtures) {
      isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
      let filteredData = res.fixtures.filter((f) => f.activeMarkets > 0)
      fixturesList.value = _.groupBy(filteredData, 'tournament')
      isLastPage.value = res.lastPage === page.value
      marketsGroup.value = res.markets
      activeMarket.value = marketsGroup.value ? marketsGroup.value[0] : []
      isLoading.value = false
    } else {
      throw Error
    }
  } catch (error) {
    isLoading.value = false
    isEmptyResponse.value = true
    console.error(error)
  }
}

async function fixturesByActiveSport(id) {
  if(!FEED_TOGGLE) return;
  try {
    let selectedPeriod = getDateRange('week')
    const res = await getSportUpcoming(id, selectedPeriod)
    if (res.fixtures) {
      isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
      fixturesList.value = res.fixtures.filter((f) => f.activeMarkets > 0)
      isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
      isLastPage.value = res.lastPage === page.value
      marketsGroup.value = res.markets ? res.markets : []
      activeMarket.value = marketsGroup.value.length ? marketsGroup.value[0] : {}
    } else {
      throw Error
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    isEmptyResponse.value = true
    console.error(error)
  }
}

async function fetchTodayActiveSport(id) {
  if(!FEED_TOGGLE) return;
  try {
    const res = await getToday2(id, page.value)
    isPaginated.value = res.lastPage !== undefined && res.remainingRecords !== undefined
    let filteredData = res.fixtures.filter((f) => f.activeMarkets > 0)
    // Update fixturesList.value
    fixturesList.value =
      fixturesList.value && fixturesList.value.length
        ? [...fixturesList.value, ...filteredData]
        : [...filteredData]
    isLastPage.value = res.lastPage === page.value
    // Set markets and active market
    marketsGroup.value = res.markets
    activeMarket.value = marketsGroup.value[0]
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function selectMarket(market) {
  activeMarket.value = market
}

const isScrolled = ref(false)
const isTop = ref(false)
const divPosition = ref(null)

const observer = ref(null)

const handleScroll = async () => {
  isScrolled.value = window.scrollY > 50
  const specificDiv = document.getElementById('m-sanp-nav-container')
  divPosition.value = specificDiv ? specificDiv.getBoundingClientRect().top : 0
  isTop.value = divPosition.value <= 59
}

const observeElement = (element) => {
  // console.log('Initializing observer...')
  if (observer.value) {
    // console.log('Disconnecting existing observer...')
    observer.value.disconnect()
  }
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLastPage.value) {
      // console.log('Sentinel element is intersecting. Fetching more data...')
      fetchMoreData()
    }
  })
  if (element) {
    observer.value.observe(element)
  } else {
    // console.log('Element not found:', element)
  }
}

const fetchMoreData = async () => {
  if (fetchingMore.value || !isPaginated.value) return
  fetchingMore.value = true
  page.value++
  // console.log(`Fetching data for page ${page.value}...`)
  try {
    const { sportID } = getSportbyName(route.params.sport)
    const { period } = route.query

    // let newData = []
    switch (route.name) {
      case 'today-fixtures':
        await fetchTodayActiveSport(sportID)
        break

      case 'fixtures-by-sports':
        if (period) {
          await fetchActiveSportByPeriod(sportID, period)
        } else {
          await fixturesByActiveSport(sportID)
        }
        break

      default:
        // Handle other routes or provide a default behavior
        break
    }
  } catch (error) {
    console.error('Error fetching more data:', error)
  } finally {
    fetchingMore.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const sentinel = document.querySelector('#scroll-sentinel')
  localStorage.removeItem('categoryIds')
  observeElement(sentinel)

  // Add event listener for removing fixtures
  emitter.on('remove-fixture', (matchID) => {
    if (fixturesList.value) {
      if (Array.isArray(fixturesList.value)) {
        // For default grouping
        fixturesList.value = fixturesList.value.filter(
          (fixture) => String(fixture.matchID) !== String(matchID)
        )
      } else {
        // For tournament grouping
        Object.keys(fixturesList.value).forEach((tournament) => {
          fixturesList.value[tournament] = fixturesList.value[tournament].filter(
            (fixture) => String(fixture.matchID) !== String(matchID)
          )
          // Remove empty tournament groups
          if (fixturesList.value[tournament].length === 0) {
            delete fixturesList.value[tournament]
          }
        })
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer.value) observer.value.disconnect()
})

defineComponent({
  name: 'fixture-view',
  components: { HeaderGame, LoadingSpinner, LoadingError }
})
</script>

<style>
.m-event-list {
  background-color: inherit;
  color: #353a45;
  -webkit-overflow-scrolling: none;
  overscroll-behavior: none;
}
.m-event-list .m-topnav .title {
  font-size: 1.66666667rem;
}
.m-event-list .m-topnav .arrow-icon {
  font-family: 'iconfont';
  width: auto;
}
.m-event-list .m-topnav .arrow-icon:before {
  content: '\e6A3';
  display: inline-block;
  font-size: 0.66666667rem;
  font-family: 'iconfont';
  line-height: 1;
  position: relative;
  -webkit-transform: rotate(0);
  -ms-transform: rotate(0);
  transform: rotate(0);
  -webkit-transform-origin: center;
  -ms-transform-origin: center;
  transform-origin: center;
  -webkit-transition: -webkit-transform 0.3s ease;
  transition: -webkit-transform 0.3s ease;
  transition: transform 0.3s ease;
  transition:
    transform 0.3s ease,
    -webkit-transform 0.3s ease;
  vertical-align: middle;
}
.m-event-list .m-topnav .arrow-icon.open:before {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.m-event-list .m-topnav .trans-select {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-event-list .m-topnav .trans-select .sport-select.af-select {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 2rem;
  position: static;
}
.m-event-list .m-topnav .trans-select .sport-select.af-select .af-select-title {
  display: none;
}
.m-event-list .m-topnav .trans-select .sport-select.af-select .af-select-title .af-select-input {
  display: hidden;
}
.m-event-list .m-topnav .trans-select .sport-select.af-select .af-select-list {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: none;
  border-top: 1px solid;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  margin-top: 1.66666667rem;
  max-height: 80vh;
  overflow: auto;
  position: absolute;
  z-index: 1001;
  border-top-color: #eaecef;
  border-top-color: var(--brand-border-type1);
}

.m-event-list .m-topnav .trans-select .sport-select.af-select .af-select-list .af-select-item {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  font-size: 1.066rem;
  height: 3rem;
  line-height: 3rem;
  padding-left: 3rem;
  text-align: left;
  color: #353a45;
  color: var(--text-type1-primary);
}
.m-event-list
  .m-topnav
  .trans-select
  .sport-select.af-select
  .af-select-list
  .af-select-item.active {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: var(--brand-secondary);
}
.m-event-list
  .m-topnav
  .trans-select
  .sport-select.af-select
  .af-select-list
  .af-select-item.active:after {
  color: var(--brand-secondary);
  content: '\e611';
  float: right;
  font-family: 'iconfont';
  font-size: 1.33333333rem;
  padding-right: 1.66666667rem;
}
.m-event-list
  .m-topnav
  .trans-select
  .sport-select.af-select
  .af-select-list
  .af-select-item.hover {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}
.m-event-list .m-topnav .home-link {
  padding: 0 1rem 0 0.66666667rem;
}
.m-event-list .m-topnav .slot-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-event-list .m-topnav .slot-container > a {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-event-list .m-topnav .slot-container .search-icon {
  padding: 0 0.66666667rem 0 1.25rem;
}
.m-event-list .m-topnav .slot-container .search-icon::before {
  content: '\e613';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-event-list .m-topnav .slot-container .search-icon:before {
  font-size: 1.75rem;
  position: relative;
  top: 0.08333333rem;
}
.m-event-list .m-sport-bet-error {
  color: #353a45;
  color: var(--text-type1-primary);
  padding: 2.5rem 0 0.83333333rem;
}
.m-event-list .no-data {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  padding: 2.33333333rem;
  text-align: center;
}
.m-event-list .no-data::before {
  content: '\e624';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-event-list .no-data:before {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
  font-size: 2.5rem;
}
.m-event-list .m-loading-wrap {
  margin-top: 15%;
}
.m-event-list .m-sanp-nav-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  /* height: 4rem; */
  width: 100%;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
}
.m-event-list .m-sport-type {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  background-color: var(--background-type1-primary);
  color: #eaecef;
}
.m-event-list .m-sport-type .m-sport-type-item {
  font-size: 1.066rem;
  font-weight: normal;
  padding: 0.61666667rem 1.25rem;
  /* border-radius: 30px; */
}
.m-event-list .m-sport-type .m-sport-type-item.active {
  border-bottom: 3px solid var(--brand-primary);
}
.m-event-list .m-sport-type .m-sport-type-item:first-child {
  margin-left: 0.83333333rem;
}
.m-event-list .m-sport-type .m-sport-type-item:last-child {
  margin-right: 0.83333333rem;
}
.m-event-list .m-sport-type.m-sport-type-fixed {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  left: 0;
  position: fixed;
  right: 0;
  top: 3.66666667rem;
  -webkit-transition: top 0.3s;
  transition: top 0.3s;
  z-index: 100;
  border-bottom: 1px solid #eaecef;
}
/* .m-event-list .m-sport-type.m-sport-type-fixed.has-live {
  top: 7rem;
} */
.m-event-list .m-sport-type.m-sport-type-fixed.nav-down {
  top: 7.33333333rem;
}
.m-event-list .m-sport-type.m-sport-type-fixed.nav-down.has-live {
  top: 10.66666667rem;
}
.m-event-list .m-sport-type.m-sport-type-fixed.choose-open {
  z-index: -1;
}
.m-event-list .m-outright-bar {
  border-bottom: solid 0.08333333rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
}
.m-event-list .m-outright-bar .m-match-type-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  font-weight: bold;
  padding: 0.66666667rem 1.25rem;
  width: 100%;
}
.m-event-list .m-outright-bar .m-match-type-item.active {
  border-bottom: 4px solid var(--brand-text-secondary);
}
.m-event-list .m-outright-bar .m-match-type-item.m-snap-nav-item--disabled {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
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

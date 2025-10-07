<template lang="">
  <div class="m-sports" id="m-sports">
    <div class="m-sports-title" :class="{ fixed: isTop }">
      <span class="m-title-sport">Sports </span>
      <div class="m-snap-nav-wrap m-sport-type">
        <ul
          class="m-snap-nav flex"
          style="
            transform: translate(0px, 0px) translateZ(0px);
            transition-duration: 350ms;
            transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
            width: 100%;
            display: flex;
            align-items: center;
          "
        >
          <li
            v-for="(sport, index) in sportsListData"
            :class="sport.sportID === activeSportID ? 'active' : ''"
            @click="setActiveSport(sport.sportID)"
            :key="index"
            :id="'highlights_' + sport.sportID"
            class="m-sport-type-item m-snap-nav-item"
          >
            <!-- <img
              :src="getImageSrc(sport.sportID)"
              style="height: 20px; margin-right: 0.4rem"
              alt=""
              srcset=""
            /> -->
            <Transition name="bounce">
              <span>{{ sport.sportName }}</span>
            </Transition>
          </li>
        </ul>
      </div>
    </div>
    <div
      :class="{ 'nav-fixed': isTop }"
      class="m-pre-opts m-tabs m-tabs-mini m-tabs-no-animation"
      style="overflow: hidden"
    >
      <div
        class="m-tabs-nav"
        style="
          transform: translate(0px, 0px);
          transition-duration: 0s;
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          width: 100%;
        "
      >
        <div
          class="m-tabs-tab"
          @click="setActiveTab('highlights')"
          :class="[highlightsActiveTab ? 'm-tabs-tab-active' : '']"
        >
          Highlights
        </div>
        <div
          class="m-tabs-tab"
          @click="setActiveTab('today')"
          :class="[todayActiveTab ? 'm-tabs-tab-active' : '']"
        >
          Today
        </div>
        <div
          class="m-tabs-tab"
          @click="setActiveTab('countries')"
          :class="[countriesActiveTab ? 'm-tabs-tab-active' : '']"
        >
          Countries
        </div>
      </div>
      <div class="m-tabs-content">
        <div v-show="highlightsActiveTab" class="m-tabs-tabpane">
          <div class="m-highlights-wrap" style="position: relative">
            <Highlights
              :highlightsData="highlightsData"
              :marketsGroup="marketsGroup"
              :activeMarket="activeMarket"
              @select-market="getFixturesByMarkets"
              v-if="!isLoading && !loadingError"
            ></Highlights>

            <LoadingSpinner v-show="isLoading"></LoadingSpinner>
            <LoadingError v-show="loadingError"></LoadingError>
          </div>
        </div>
        <div v-show="todayActiveTab" class="m-tabs-tabpane">
          <Today
            v-if="!isLoading && !loadingError"
            :todaysData="todaysData"
            :marketsGroup="marketsGroup"
            :activeMarket="activeMarket"
            @select-market="getFixturesByMarkets"
          ></Today>
          <LoadingSpinner v-show="isLoading"></LoadingSpinner>
          <LoadingError v-show="loadingError"></LoadingError>
        </div>
        <div v-show="countriesActiveTab" class="m-tabs-tabpane">
          <Countries
            v-if="countriesData.length"
            :countriesData="countriesData"
            :activeSportID="activeSportID"
          ></Countries>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUtilsStore } from '@/stores/utils.store'
import Highlights from '@/components/Highlights/Highlights.vue'
import Today from '@/components/Highlights/Today.vue'
import Countries from '@/components/Highlights/Countries.vue'
import LoadingError from '@/components/Loaders/LoadingError.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

import { getHighlights2, getToday2, getCategoriesBySport, FEED_TOGGLE } from '@/helpers'
import { defineComponent, onMounted, ref, onUnmounted, computed } from 'vue'
import _ from 'lodash'
import emitter from '@/plugins/emitter'

const utilsStore = useUtilsStore()

const highlightsData = ref([])
const todaysData = ref([])
const countriesData = ref([])

// const sportsListData = ref([])
const prevSportID = ref(1)
const activeSportID = ref(1)

const marketsGroup = ref({})
const activeMarket = ref({})

const todayActiveTab = ref(false)
const highlightsActiveTab = ref(true)
const countriesActiveTab = ref(false)

const isLoading = ref(false)
const loadingError = ref(false)

function setActiveTab(tab) {
  switch (tab) {
    case 'highlights':
      highlightsActiveTab.value = true
      todayActiveTab.value = false
      countriesActiveTab.value = false
      getHighlightGames()
      break
    case 'today':
      todayActiveTab.value = true
      countriesActiveTab.value = false
      highlightsActiveTab.value = false
      getTodayGames()
      break
    case 'countries':
      countriesActiveTab.value = true
      highlightsActiveTab.value = false
      todayActiveTab.value = false
      break

    default:
      break
  }
}

const sportsListData = computed(() => {
  return utilsStore.sportsMenu
})
const getImageSrc = (sportId) => {
  const imageUrl = new URL(`../../assets/images/sports/${sportId}.png`, import.meta.url)
  return imageUrl
}

async function setActiveSport(sid) {
  // set the active sport id
  prevSportID.value = activeSportID.value
  activeSportID.value = sid
  await getHomeData()
  document.getElementById('highlights_' + sid).scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

async function getHighlightGames() {
  if(!FEED_TOGGLE) return;
  isLoading.value = true
  if (!Object.keys(highlightsData.value).length || prevSportID.value !== activeSportID.value) {
    const response = await getHighlights2(activeSportID.value, 1)
    if (response.fixtures) {
      let filteredData = response.fixtures.filter((f) => f.activeMarkets > 0)
      highlightsData.value = _.groupBy(filteredData, (fixture) => fixture.date.split(' ')[0])
      marketsGroup.value = response.markets
      setMarkets()
    } else {
      highlightsData.value = []
      marketsGroup.value = []
    }
  }
  isLoading.value = false
}

async function getTodayGames() {
  if(!FEED_TOGGLE) return;
  isLoading.value = true
  if (!Object.keys(todaysData.value).length || prevSportID.value !== activeSportID.value) {
    const response = await getToday2(activeSportID.value, 1)
    if (response.fixtures) {
      let filteredData = response.fixtures.filter((f) => f.activeMarkets > 0)
      todaysData.value = _.groupBy(filteredData, (fixture) => fixture.date.split(' ')[0])
      marketsGroup.value = response.markets
      setMarkets()
    } else {
      todaysData.value = []
      // marketsGroup.value = []
    }
  }
  isLoading.value = false
}

async function getCountriesList() {
  if(!FEED_TOGGLE) return;
  countriesData.value = (await getCategoriesBySport(activeSportID.value)).sports || []
}

function setMarkets() {
  // marketsGroup.value = sportsListData.value.find((obj) => obj.sport_id === activeSportID.value)
  activeMarket.value = marketsGroup.value[0]
}

function getFixturesByMarkets(market) {
  activeMarket.value = market
}

async function getHomeData() {
  if(!FEED_TOGGLE) return;
  isLoading.value = true
  loadingError.value = false
  Promise.all([getHighlightGames(), getCountriesList()])
    .then(() => {
      isLoading.value = false
    })
    .catch((error) => {
      // Handle errors for any of the promises
      isLoading.value = false
      loadingError.value = true
      console.error('An error occurred:', error)
    })
}

const isScrolled = ref(false)
const isTop = ref(false)
const divPosition = ref(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  const specificDiv = document.getElementById('m-sports')
  divPosition.value = specificDiv ? specificDiv.getBoundingClientRect().top : 0

  if (divPosition.value <= 59) {
    isTop.value = true
  } else {
    isTop.value = false
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await getHomeData()

  // Add event listener for removing fixtures
  emitter.on('remove-fixture', (matchID) => {
    // Remove from highlights data
    Object.keys(highlightsData.value).forEach((date) => {
      highlightsData.value[date] = highlightsData.value[date].filter(
        (fixture) => String(fixture.matchID) !== String(matchID)
      )
      // Remove empty date groups
      if (highlightsData.value[date].length === 0) {
        delete highlightsData.value[date]
      }
    })

    // Remove from today's data
    Object.keys(todaysData.value).forEach((date) => {
      todaysData.value[date] = todaysData.value[date].filter(
        (fixture) => String(fixture.matchID) !== String(matchID)
      )
      // Remove empty date groups
      if (todaysData.value[date].length === 0) {
        delete todaysData.value[date]
      }
    })
  })
})

onUnmounted(() => {
  // Remove scroll event listener when the component is unmounted
  window.removeEventListener('scroll', handleScroll)
})

defineComponent({
  components: {
    Today,
    Highlights,
    Countries,
    LoadingError,
    LoadingSpinner
  }
})
</script>

<style scoped>
.m-sports-title {
  top: 3.66666667rem;
  position: sticky;
  /* background-color: #f1f1f1; */
  background-color: rgb(0,14,34);
  /* z-index: 220; */
}

.header-appear {
  background-color: red;
  position: sticky;
  top: 0px;
}

.m-sports .m-sports-title .m-sport-type .m-sport-type-item.active {
  padding: 5px 15px;
  /* border: 1px solid; */
  /* border-radius: 25px; */
  /* background-color: rgb(6,0,25,0.8); */
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
/* .bounce-leave-active {
  animation: bounce-in 0.2s reverse;
} */
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>

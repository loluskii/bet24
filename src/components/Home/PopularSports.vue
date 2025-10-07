<template>
  <div class="m-popular featuredMatch">
    <div class="tournaments">
      <div
        class="topTournamentCard"
        @click.prevent="
          $router.push({
            name: 'today-fixtures',
            params: { sport: 'Soccer' }
          })
        "
      >
        <div class="image"></div>
        <div class="text">today's football</div>
      </div>
      <div
        class="topTournamentCard"
        @click.prevent="
          $router.push({
            name: 'fixtures-by-sports',
            params: { sport: 'Soccer' },
            query: { period: '3hrs' }
          })
        "
      >
        <div class="image">
          <img src="@/assets/images/3hrs.jpeg" style="height: 24px" alt="" srcset="" />
        </div>
        <div class="text">football in 3 hours</div>
      </div>
      <template v-for="(match, index) in featuredTournaments" :key="index">
        <div
          class="topTournamentCard"
          @click.prevent="
            $router.push({
              name: 'fixtures-by-tournaments',
              params: {
                sport: 'Soccer',
                categories: `sr:category:${match.categoryID}`,
                tournaments: `sr:tournament:${match.tournamentID}`
              }
            })
          "
        >
          <!-- <div class="image">
            <img
              :src="match.tournament.image_path"
              style="height: 24px; margin-right: 15px"
              alt=""
              srcset=""
            />
          </div> -->
          <div class="text">{{ match.tournamentName }}</div>
        </div>
      </template>
    </div>

    <div class="featured-match-placeholder">
      <div class="featured-widget with-nav" style="">
        <div role="tablist" aria-label="featured widgets tabs" class="featured-nav-list">
          <div class="featured-header-left">
            <span role="heading" aria-label="featured widgets title" class="featured-title"
              >Featured</span
            >
            <div role="group" aria-label="featured widget tablist container" class="tabList">
              <div
                class="m-snap-nav-wrap"
                role="tablist"
                aria-label="featured widget tabs"
                style="overflow: hidden"
              >
                <ul class="m-snap-nav flex">
                  <li
                    class="featured-nav-item m-snap-nav-item"
                    :class="activeFeaturedTab == 'featuredMatches' ? 'active' : ''"
                    @click="setActiveTab('featuredMatches')"
                    role="tab"
                    aria-label="featured matches"
                  >
                    <span
                      class="feature-nav-span"
                      :class="activeFeaturedTab == 'featuredMatches' ? 'active' : ''"
                      >Matches</span
                    >
                  </li>
                  <li
                    class="featured-nav-item m-snap-nav-item"
                    @click="setActiveTab('featuredGames')"
                    :class="activeFeaturedTab == 'featuredGames' ? 'active' : ''"
                    role="tab"
                    aria-label="featured games"
                  >
                    <span
                      class="feature-nav-span"
                      :class="activeFeaturedTab == 'featuredGames' ? 'active' : ''"
                      >Casino</span
                    >
                  </li>
                  <li
                    class="featured-nav-item m-snap-nav-item"
                    @click="setActiveTab('codes')"
                    :class="activeFeaturedTab == 'codes' ? 'active' : ''"
                    role="tab"
                    aria-label="codes"
                  >
                    <span
                      class="feature-nav-span"
                      :class="activeFeaturedTab == 'codes' ? 'active' : ''"
                      >Codes</span
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="featured-header-right">
            <a
              v-show="activeFeaturedTab == 'codes'"
              href="/CodeHub"
              class="codeHub-Icon"
              role="link"
              aria-label="see more featured code list"
              ><svg
                data-v-4834e13a=""
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="var(--brand-highlight-text)"
                class="svg-icon-base"
                style="height: 1.66667rem; width: 1.66667rem"
              >
                <path
                  d="M21.162 10.058c0-.338.002-3.732-.028-4.074A3.246 3.246 0 0017.88 3.01c-1.226-.002-2.473 0-3.68 0h-1.84c-.516 0-1.038-.002-1.547-.005-1.32-.007-2.683-.014-4.026.026A3.68 3.68 0 005.1 3.51a3.063 3.063 0 00-1.219 1.292c-.246.497-.372 1.083-.375 1.743-.009 3.23-.007 6.514-.002 9.69l.002 1.204c.003.335.033.626.092.889a3.55 3.55 0 001.24 2.013c.548.433 1.195.668 1.837.668.052 0 .101-.003.153-.005.496-.03 4.99-.023 5.482-.016.26.004.53.007.794.007.65-.003.797-.37.806-.68a.704.704 0 00-.175-.52c-.139-.146-.357-.223-.626-.225-.42-.005-4.83-.003-5.243-.003h-.842c-1.265-.004-2.057-.766-2.067-1.987a928.92 928.92 0 01-.002-11.135c.002-.572.208-1.093.583-1.46.373-.366.882-.556 1.472-.549 2.377.026 4.793.021 7.128.016 1.17-.002 2.379-.004 3.567-.002 1.273.002 2.013.75 2.03 2.05 0 .05 0 3.146.002 3.198.002.32.007.651.044.977.045.375.31.617.668.617.021 0 .043 0 .061-.003.42-.033.666-.307.661-.736a5.867 5.867 0 01-.01-.494z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width=".4"
                ></path>
                <path
                  d="M17.048 9.117H6.851a.719.719 0 01-.717-.717c0-.394.32-.717.717-.717h10.197a.717.717 0 110 1.434zM9.537 15.03H6.85a.719.719 0 01-.717-.717c0-.394.32-.717.717-.717h2.686c.393 0 .717.321.717.717a.72.72 0 01-.717.717zm11.301 4.798l-2.54-3.023a3.665 3.665 0 10-6.64-2.142 3.665 3.665 0 005.592 3.119l2.491 2.967a.716.716 0 001.097-.921zm-7.891-5.165a2.38 2.38 0 012.376-2.377 2.38 2.38 0 012.377 2.377 2.38 2.38 0 01-2.377 2.376 2.38 2.38 0 01-2.376-2.377z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width=".4"
                ></path>
              </svg>
            </a>
          </div>
        </div>
        <div v-show="activeFeaturedTab == 'featuredMatches'" class="featuredMatch">
          <template v-if="!isLoading || featuredTournaments.length > 0">
            <div class="featuredMatchCategoryBox">
              <div
                class="m-snap-nav-wrap featuredMatchCategoryNav m-popular-list"
                style="overflow: hidden"
              >
                <ul class="m-snap-nav flex" style="width: 100%">
                  <li
                    v-for="(top, index) in featuredTournaments"
                    :key="index"
                    class="m-popular-item featuredMatchCategoryNavItem m-snap-nav-item"
                    @click="setActiveTournament(top)"
                  >
                    <div
                      class="featuredMatchCategory"
                      :class="activeFeaturedTournament == top.tournamentID ? 'active' : ''"
                    >
                      <div class="wrapper">
                        <div class="img">
                          <img :src="getImageURL(top.tournamentName)" />
                        </div>
                        <div class="name">{{ top.tournamentName }}</div>
                      </div>
                    </div>
                  </li>
                </ul>
                <i class="controls left-controls"></i>
                <i class="controls right-controls"></i>
              </div>
            </div>
            <div class="HorizonSwipe" id="featuredMatchCardBox" style="overflow: auto">
              <template v-for="tournament in sortedTournamentGames">
                <FeaturedMatchCard
                  v-for="(game, g) in tournament.fixtures"
                  ref="gamesList"
                  :key="g"
                  :matchDetails="game"
                  :markets="tournament.markets"
                ></FeaturedMatchCard>
              </template>
            </div>
          </template>
          <LoadingSpinner v-else></LoadingSpinner>
        </div>
        <FeaturedGamesContainer
          v-show="activeFeaturedTab == 'featuredGames'"
          :featuredCasinogames="featuredCasinogames"
          :featuredCasino="featuredCasino"
          :activeCasinoCategory="activeCasinoCategory"
          @set-active-category="setActiveCategory"
          :casinoIsLoading="casinoIsLoadingGames"
        ></FeaturedGamesContainer>
        <Codes v-show="activeFeaturedTab == 'codes'" :codes="codes" />
      </div>
    </div>
  </div>
</template>
<script setup>
import FeaturedMatchCard from './FeaturedMatchCard.vue'
import Codes from './Codes.vue'
import { ref, onMounted, computed, onBeforeUnmount, onActivated, onDeactivated, watch } from 'vue'
import {
  getTopBets,
  getFixturesByTournamentId,
  slugify,
  getTopGameCategories,
  gamesByTopCategory,
  getCodeHubItems,
  getNext7Days,
  FEED_TOGGLE
} from '@/helpers'
import { useQuery } from 'vue-query'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import FeaturedGamesContainer from './FeaturedGamesContainer.vue'
import { useMqttService } from '@/composables/useMqtt'
import { useUtilsStore } from '@/stores/utils.store'

const { subscribe } = useMqttService()
const unsubscribeFunctions = ref({}) // Store unsubscribe functions by match ID
const componentId = `popular-sports-${Date.now()}` // Unique ID for this component instance
const shouldRefresh = ref(false)

const utilsStore = useUtilsStore()
const featuredTournaments = computed(() => utilsStore.featuredTournaments)
const featuredTournamentGames = computed(() => utilsStore.featuredTournamentGames)
const isLoading = computed(() => utilsStore.featuredIsLoading)
const activeFeaturedTournament = computed(() => utilsStore.activeFeaturedTournament)

const activeFeaturedTab = ref('featuredMatches')

const activeCasinoCategory = ref(null)
const featuredCasinogames = ref([])
const featuredCasino = ref([])
const codes = ref([])

function scrollGamesIntoView() {
  document.getElementById('featuredMatchCard_' + activeFeaturedTournament.value).scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

function setActiveTab(tab) {
  activeFeaturedTab.value = tab
}

const sortedTournamentGames = computed(() => {
  return featuredTournamentGames.value.length
    ? [...featuredTournamentGames.value].sort((a, b) => a.tournamentID - b.tournamentID)
    : []
})

function getImageURL(name) {
  if (name == 'Championship') {
    return new URL('../../assets/images/EFL_Championship_Logo.png', import.meta.url)
  } else if (name == 'Bundesliga') {
    return new URL('../../assets/images/Bundesliga.png', import.meta.url)
  } else {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Top%20Leagues%2F${name}.png?alt=media`
  }
}

const setActiveTournament = (tournament) => {
  utilsStore.setActiveFeaturedTournament(tournament.tournamentID)
  scrollGamesIntoView()
}

const setActiveCategory = async (category) => {
  if (!category?.id) {
    console.warn('Invalid category provided to setActiveCategory')
    return
  }

  activeCasinoCategory.value = category.id

  try {
    const games = await gamesByTopCategory(category.id)
    featuredCasinogames.value = games.data ? games.data.splice(0, 5) : []
  } catch (error) {
    console.error('Error fetching games for category:', error)
    featuredCasinogames.value = []
  }
}

async function getCasinoGames() {
  if(!FEED_TOGGLE) return;
  const res = await getTopGameCategories()
  featuredCasino.value = res.data
  activeCasinoCategory.value = res.data[0].id
  const games = await gamesByTopCategory(activeCasinoCategory.value)
  featuredCasinogames.value = games.data ? games.data.splice(0, 5) : []
}

async function getCodes() {
  if(!FEED_TOGGLE) return;
  let payload = {
    from: getNext7Days()[0],
    to: getNext7Days()[7],
    betType: 0
  }
  const res = await getCodeHubItems(payload)
  codes.value = res.data.data
}

function assignTournaments(tournament, games, tournamentID) {
  if (!games?.fixtures?.length || !games?.markets?.length) {
    // Early return if no valid data
    const index = featuredTournaments.value.findIndex((x) => x.tournament_id === tournament.id)
    if (index !== -1) {
      featuredTournaments.value.splice(index, 1)
    }
    return
  }

  // Take only first 5 fixtures
  const gamesList = games.fixtures.slice(0, 5)

  // Create tournament games object
  const tournamentGames = {
    tournamentID,
    fixtures: gamesList,
    markets: games.markets
  }

  // Add to featured games
  featuredTournamentGames.value.push(tournamentGames)

  // Batch MQTT subscriptions
  const matchIds = gamesList.filter((fixture) => fixture.matchID).map((fixture) => fixture.matchID)

  if (matchIds.length > 0) {
    setupMqttSubscriptions(matchIds)
  }
}

function setupMqttSubscriptions(matchIds) {
  // Only clear our own component's subscriptions
  const subscriptionKey = `${componentId}-${matchIds.join(',')}`
  if (unsubscribeFunctions.value[subscriptionKey]) {
    unsubscribeFunctions.value[subscriptionKey].forEach((unsubscribe) => unsubscribe())
  }

  // Create subscriptions for each match ID
  const subscriptions = matchIds.map((matchId) => {
    // Subscribe to odds changes
    const oddsChangeTopic = `feeds/prematch/odds_change/${matchId}`
    const unsubscribeOddsChange = subscribe(oddsChangeTopic, (data) => {
      utilsStore.handleOddsChange(data)
    })

    // Subscribe to bet stop
    const betStopTopic = `feeds/prematch/bet_stop/${matchId}`
    const unsubscribeBetStop = subscribe(betStopTopic, (data) => {
      utilsStore.handleBetStop(data)
    })

    return [unsubscribeOddsChange, unsubscribeBetStop]
  })

  // Flatten the array of subscription pairs
  unsubscribeFunctions.value[subscriptionKey] = subscriptions.flat()
}

onBeforeUnmount(() => {
  // Clean up all MQTT subscriptions
  Object.values(unsubscribeFunctions.value).forEach((subscriptions) => {
    subscriptions.forEach((unsubscribe) => unsubscribe())
  })
  unsubscribeFunctions.value = {}
})

// Update onMounted
onMounted(async () => {
  // Only fetch if we don't have data or it's stale
  if (!utilsStore.hasFeaturedData || utilsStore.isFeaturedStale) {
    await utilsStore.fetchFeaturedGames().then(() => {
      setActiveTournament(featuredTournaments.value[0])
    })
  }
})

const { data: casinoData, isLoading: isCasinoLoading } = useQuery(
  'casinoGames',
  getTopGameCategories,
  {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 60000,
    cacheTime: 300000,
    enabled: FEED_TOGGLE
  }
)

const { data: codesData, isLoading: isCodesLoading } = useQuery(
  'codes',
  () => {
    const payload = {
      from: getNext7Days()[0],
      to: getNext7Days()[7],
      betType: 0
    }
    return getCodeHubItems(payload)
  },
  {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 60000,
    cacheTime: 300000,
    enabled: FEED_TOGGLE
  }
)

// Update computed properties
const casinoIsLoadingGames = computed(() => isCasinoLoading.value)

// Watch for casino data changes
watch(
  casinoData,
  (newData) => {
    if (newData?.data) {
      featuredCasino.value = newData.data
      if (newData.data.length > 0) {
        const firstCategory = newData.data[0]
        activeCasinoCategory.value = firstCategory.id
        setActiveCategory(firstCategory)
      }
    }
  },
  { immediate: true }
)

// Watch for codes data changes
watch(
  codesData,
  (newData) => {
    if (newData?.data?.data) {
      codes.value = newData.data.data
    }
  },
  { immediate: true }
)

// Update the getFeaturedGames function
async function getFeaturedGames() {
  if(!FEED_TOGGLE) return;
  if (!topBetsData.value) return

  // Use Set for faster unique tournament filtering
  const uniqueTournamentIds = new Set()
  const uniqueTournaments = []

  // Single pass to filter unique tournaments
  for (const tournament of topBetsData.value.data) {
    if (!uniqueTournamentIds.has(tournament.tournamentID)) {
      uniqueTournamentIds.add(tournament.tournamentID)
      uniqueTournaments.push(tournament)
    }
  }

  // Sort tournaments and update featuredTournaments immediately
  featuredTournaments.value = uniqueTournaments.sort((a, b) => a.tournamentID - b.tournamentID)

  // Set active tournament
  activeFeaturedTournament.value = featuredTournaments.value[0]?.tournamentID

  // Process tournaments in parallel with concurrency limit
  const CONCURRENCY_LIMIT = 3
  const chunks = []
  for (let i = 0; i < featuredTournaments.value.length; i += CONCURRENCY_LIMIT) {
    chunks.push(featuredTournaments.value.slice(i, i + CONCURRENCY_LIMIT))
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (tournament) => {
        try {
          const games = await getFixturesByTournamentId(tournament.tournamentID, tournament.sportID)
          assignTournaments(tournament, games, tournament.tournamentID)
        } catch (error) {
          console.error(`Error processing tournament ${tournament.tournamentID}:`, error)
          const index = featuredTournaments.value.findIndex(
            (t) => t.tournamentID === tournament.tournamentID
          )
          if (index !== -1) {
            featuredTournaments.value.splice(index, 1)
          }
        }
      })
    )
  }
}

// Update onActivated
onActivated(async () => {
  // Only fetch if we don't have data or it's stale
  if (!utilsStore.hasFeaturedData || utilsStore.isFeaturedStale) {
    await utilsStore.fetchFeaturedGames()
  }
})

// Update onDeactivated
onDeactivated(() => {
  // Clean up MQTT subscriptions
  Object.values(unsubscribeFunctions.value).forEach((subscriptions) => {
    subscriptions.forEach((unsubscribe) => unsubscribe())
  })
  unsubscribeFunctions.value = {}
})
</script>
<style scoped>
.home .m-popular {
  min-height: 4rem;
}
.home .m-popular .m-snap-nav {
  padding-bottom: 0.33333333rem;
}
.home .m-popular .m-popular-item {
  display: block;
  -webkit-box-flex: 0 !important;
  -webkit-flex: 0 0 auto !important;
  -ms-flex: 0 0 auto !important;
  flex: 0 0 auto !important;
  font-size: 1rem;
  /* margin-right: 0.33333333rem; */
  /* padding: 5px 10px; */
  min-width: 4rem;
  border-radius: 30px;
  /* border: 1px solid var(--brand-primary); */
  height: auto;
}

.home .m-popular .m-popular-item a {
  line-height: normal;
  color: var(--brand-primary);
  white-space: nowrap;
}
.home .m-popular .m-popular-item:first-child {
  margin-left: 0.83333333rem;
}
.home .m-popular .m-popular-item:last-child {
  margin-right: 0.83333333rem;
}
.home .m-popular .m-popular-item .m-color-bar {
  background: #353a45;
  height: 0.25rem;
}
.home .m-popular .m-popular-item .m-color-bar--red {
  background: #e41827;
}
.home .m-popular .m-popular-item .m-color-bar--green {
  background: var(--brand-highlight-text);
}
.home .m-popular .m-popular-item a img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.home .m-second-banner {
  display: block;
}
.home .m-second-banner img {
  display: block;
  max-height: 64px;
  width: 100%;
}
.home .m-sports .m-title,
.home .m-live .m-title {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.75rem;
  margin: 0 0.83333333rem;
}
.home .m-sports .m-today-tab {
  border-bottom: 1px solid #f2f3f5;
  border-color: #f2f3f5;
  border-color: var(--c-prematch-tab-border);
}
.home .m-sports .m-today-tab .m-tabs-nav {
  border-bottom: none;
  min-width: 100%;
}
.home .m-sports .m-today-tab .m-tabs-tab {
  color: #353a45;
  color: var(--c-sports-prematch-market-title-text);
  -webkit-box-flex: initial;
  -webkit-flex: initial;
  -ms-flex: initial;
  flex: initial;
  font-size: 1.066rem;
  margin: 0;
  padding: 0.33333333rem 0.91666667rem;
  width: auto;
}
.home .m-sports .m-today-tab .m-tabs-ink-bar {
  height: 3px;
}
.home .m-sports .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: relative;
}
.home .m-sports .nav-fixed .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: fixed;
  top: 7.75rem;
  -webkit-transition: top 0.3s ease !important;
  transition: top 0.3s ease !important;
  width: 100%;
  z-index: 100;
}
.home .m-sports .nav-fixed .market-wrapper:after {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  content: '';
  height: 4rem;
  left: 0;
  position: absolute;
  top: -4rem;
  width: 100%;
}
.home .m-sports .nav-fixed.nav-up .market-wrapper {
  top: 11.41666667rem;
}
.home .m-sports .nav-up .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: fixed;
  top: 11.41666667rem;
  z-index: 200;
}
.home .m-sport-bet-error {
  padding: 0.83333333rem;
}
.home .view-all {
  margin: 0 2rem 0 0.83333333rem;
  padding: 1.41666667rem 0;
  text-align: right;
}
.home .view-all a {
  font-size: 1rem;
  line-height: 1.066rem;
  position: relative;
}
.home .view-all a::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.home .view-all a::before {
  display: inline-block;
  font-size: 1rem;
  position: absolute;
  right: -1.33333333rem;
  top: 0;
}
.featured-match-placeholder {
  min-height: 14.58333333rem;
  position: relative;
  width: 100%;
}
#featuredMatchCardBox {
  padding: 0.8rem 1.1rem;
}

.featured-widget {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-family: 'roboto', sans-serif;
  background-color: #ffffff;
  background-color: var(--background-type1-secondary);
}
.featured-widget.with-nav {
  height: 18.91666667rem;
}
.featured-widget .featured-nav-list {
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  height: 2.91666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 0.5rem 1rem 0 1rem;
  position: relative;
  width: 100%;
}
.featured-widget .featured-nav-list .featured-header-left {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}
.featured-widget .featured-nav-list .featured-header-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0.5rem 0 0.5rem 0.16666667rem;
  background-color: #ffffff;
  background-color: var(--c-featured-match-bg);
}
.featured-widget .featured-nav-list .featured-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-right: solid 0.5px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
  padding-right: 1rem;
  border-right-color: #9ca0ab;
  border-right-color: var(--line-type1-secondary);
  color: #353a45;
  color: var(--text-type1-primary);
}
.featured-nav-item .feature-nav-span {
  font-size: 1.16666667rem;
  font-weight: normal;
  margin-right: 0.5rem;
  color: #353a45;
  color: var(--c-prematch-sport-item-text);
}
.featured-nav-item .feature-nav-span.active {
  color: var(--brand-highlight-text);
  font-weight: bold;
}
.featured-active {
  background-color: #ffffff;
  background-color: var(--c-featured-match-bg);
}
.featured-active::before {
  bottom: 0;
  content: '';
  display: block;
  position: absolute;
  width: 10%;
}
.feature-list {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.feature-list.active {
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
  font-weight: bold;
}
.tabList {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}
.codeHub-Icon {
  text-align: center;
  background-color: #ffffff;
  background-color: var(--c-featured-match-bg);
}
.booking-code {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 300;
}
.HorizonSwipe {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.HorizonSwipe::-webkit-scrollbar {
  display: none;
}
.HorizonSwipe > * {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.featuredMatchCategory {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid;
  border-color: #dcdee5;
  border-color: var(--c-featured-match-category-border);
  border-radius: 1.16666667rem;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  max-width: 3.33333333rem;
  overflow: hidden;
  padding: 0.33333333rem 0.83333333rem;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  width: auto;
}
.featuredMatchCategory::after {
  content: '';
  display: none;
  bottom: 6px;
  height: 0;
  left: 50%;
  position: absolute;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  width: 0;
  border-bottom: 8px solid transparent;
  border-right: 10px solid var(--c-featured-match-arrow-color);
  border-top: 8px solid transparent;
}
.featuredMatch {
  overflow: hidden;
}
.featuredMatch #featuredMatchCardBox > * {
  margin-right: 0.66666667rem;
}
@media only screen and (max-width: 320px) {
  .featuredMatch #featuredMatchCardBox > * {
    margin-right: 0.33333333rem;
  }
}
.featuredMatch .featuredMatchCategoryBox {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  margin-top: 0.66666667rem;
  overflow-x: auto;
}
.featuredMatch .featuredMatchCategoryBox .featuredMatchCategoryNav {
  width: 100%;
}
.featuredMatch .featuredMatchCategoryBox .featuredMatchCategoryNav .featuredMatchCategoryNavItem {
  padding: 0 0 0.4rem 0;
}

.featuredMatchCategory::before {
  content: '';
  display: none;
  bottom: 0px;
  height: 0;
  left: 50%;
  position: absolute;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  width: 0;
  border-bottom: 4px solid transparent;
  border-right: 6px solid var(--c-featured-match-category-border-active);
  border-top: 4px solid transparent;
}
.featuredMatchCategory .wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 1.66666667rem;
}
.featuredMatchCategory .wrapper .img {
  width: 1.86666667rem;
  height: 1.86666667rem;
  border-radius: 50%;
  background-color: #fbfbfb;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  min-width: 0;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  opacity: 0.5;
  border: none;
}
.featuredMatchCategory .wrapper .img.is-dark {
  opacity: 1;
  padding: 0.08333333rem;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
}
.featuredMatchCategory .wrapper img {
  width: 100%;
  -o-object-fit: contain;
  object-fit: contain;
}
.featuredMatchCategory .wrapper .icon {
  color: unset;
  color: var(--c-featured-match-category-icon);
  line-height: 1.2;
  margin-right: 0.2rem;
  opacity: 0.5;
  -webkit-transform: scale(1.2);
  -ms-transform: scale(1.2);
  transform: scale(1.2);
  -webkit-transform-origin: 0;
  -ms-transform-origin: 0;
  transform-origin: 0;
}
@media only screen and (max-width: 320px) {
  .featuredMatchCategory .wrapper .icon {
    margin-right: 0;
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0;
    -ms-transform-origin: 0;
    transform-origin: 0;
  }
}
.featuredMatchCategory .wrapper .name {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  display: none;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 0.33333333rem;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}
.featuredMatchCategory.active {
  border-color: var(--c-featured-match-category-border-active);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
  position: relative;
}
.featuredMatchCategory.active::after {
  display: block;
}
.featuredMatchCategory.active::before {
  display: block;
}
.featuredMatchCategory.active .wrapper {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}
.featuredMatchCategory.active .wrapper .img,
.featuredMatchCategory.active .wrapper .icon {
  opacity: 1;
}
.featuredMatchCategory.active .wrapper .name {
  display: inline-block;
  opacity: 1;
  pointer-events: auto;
}
.featuredMatch #featuredMatchCardBox > * {
  margin-right: 0.66666667rem;
}

.tournaments {
  padding: 0 15px 10px 15px;
  overflow: auto;
  display: flex;
}

.tournaments::-webkit-scrollbar {
  display: none;
}

.topTournamentCard {
  background-color: white;
  padding: 5px;
  border-top: 3px solid orangered;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  margin-right: 15px;
}

.topTournamentCard:last-of-type {
  margin-right: 0;
}

.topTournamentCard .text {
  font-weight: bolder;
  font-size: 14px;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Additional Colors */
.topTournamentCard:nth-child(3n + 1) {
  border-top-color: var(--brand-primary); /* Burnt Orange */
}

.topTournamentCard:nth-child(3n + 2) {
  border-top-color: var(--brand-secondary); /* Spanish Orange */
}

.topTournamentCard:nth-child(3n + 3) {
  border-top-color: var(--brand-tertiary); /* Beer */
}
</style>

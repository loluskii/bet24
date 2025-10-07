<template>
  <div class="casino">
    <HeaderCasino />
    <Winners />
    <div class="carousel">
      <Carousel></Carousel>
    </div>
    <div class="games-container">
      <template v-if="viewMode === 'games-group-view'">
        <Providers v-if="viewType === 'provider'" :providers="providers" />
        <Categories v-else :categories="categories" />
      </template>
      <template v-if="viewMode === 'games-list-view'">
        <div class="title-bg d-flex align-items-center">
          <span @click="goBack" class="m-icon m-icon--back mr-3"></span>
          <h3 class="h4 text-white fw-bold mb-0 text-capitalize">
            {{ viewHeaderTitle }}
          </h3>
        </div>
        <div class="games-containers" ref="myElement">
          <div class="games-grid mt-3">
            <div class="row row-cols-2 g-3 mb-3 pb-5">
              <div
                class="col h-100"
                v-for="(game, index) in displayedGames"
                :key="index"
                @click="redirectToGamePlay(game)"
              >
                <div class="h-100">
                  <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
                </div>
              </div>
            </div>

            <!-- Load More section -->
            <div class="load-more-container" v-if="hasMoreGames">
              <div class="load-more-overlay"></div>
              <button
                class="btn btn-primary load-more-btn"
                @click="loadMore"
                :disabled="isLoadingMore"
              >
                {{ isLoadingMore ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <div
      v-else-if="!isLoading && !gamesList.length && viewMode === 'games-list-view'"
      class="no-data"
    >
      <div style="white-space: pre-line">
        Sorry, there are no games currently<br />available in this category. Please try later.<br />Thank
        you.
      </div>
    </div>
    <div v-else-if="!isLoading && !providers && viewMode === 'games-group-view'" class="no-data">
      <div style="white-space: pre-line">
        Sorry, there are no {{ viewHeaderTitle }} currently<br />available. Please try later.<br />Thank
        you.
      </div>
    </div>
  </div>
</template>

<script setup>
import GameByProviderCategory from '@/components/Casino/GameByProviderCategory.vue'
import Providers from '../../components/Casino/Providers.vue'
import Carousel from '@/components/Home/Carousel.vue'
import { ref, onBeforeMount, watch, computed, onMounted, provide } from 'vue'
import Winners from '../../components/Casino/Winners.vue'
import {
  getGamesByProviders,
  gamesByTopCategory,
  getProviders,
  getTopGameCategories,
  getCasinoBonusGames
} from '@/helpers'
import { useAuthStore } from '@/stores'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { slugify } from '@/helpers'
import emitter from '@/plugins/emitter'
import $ from 'jquery'
import { useRouter, useRoute } from 'vue-router'
import Categories from '../../components/Casino/Categories.vue'
import HeaderCasino from '../../components/HeaderCasino.vue'
import GameCard from '@/components/Casino/GameCard.vue'
import { useUsersStore, useUtilsStore } from '../../stores'

const myElement = ref()
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()
const viewMode = ref(null)
const viewType = ref()
const viewHeaderTitle = ref('Providers')
const providers = ref([])
const categories = ref([])
const gamesList = ref([])
const categoryName = ref(null)
const displayLimit = ref(50)
const isLoadingMore = ref(false)
const userStore = useUsersStore()
const utilsStore = useUtilsStore()
const authStore = useAuthStore()

const displayedGames = computed(() => {
  return gamesList.value.slice(0, displayLimit.value)
})

const hasMoreGames = computed(() => {
  return displayLimit.value < gamesList.value.length
})

const activeBonus = computed(() => {
  return userStore.casinoActiveBonus
})

watch(
  () => [
    route.name,
    route.params.category,
    route.params.provider,
    route.query.category_id,
    route.query.providerId,
    route.query.gameIds
  ],
  async ([routeName, categoryName, providerName, gameCategoryId, gameProviderId, gameIds]) => {
    // Check the route name
    isLoading.value = true
    switch (routeName) {
      case 'casino-providers':
        handleProvidersView()
        break
      case 'casino-category':
        handleCategoriesView()
        break
      case 'games-by-category':
        handleGamesByCategoryView(categoryName, gameCategoryId)
        break
      case 'games-by-provider':
        handleGamesByProviderView(providerName, gameProviderId)
        break
      case 'casino-bonus':
      case 'bonus-games':
        handleBonusGames(gameIds)
        break
      case 'casino-jackpots':
        handleCasinoJackpots(gameIds)
        break
      default:
        break
    }
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function handleProvidersView() {
  try {
    viewType.value = 'provider'
    viewMode.value = 'games-group-view'
    viewHeaderTitle.value = 'Providers'
    const res = await getProviders()
    providers.value = res.data
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    providers.value = []
  }
}

async function handleCategoriesView() {
  try {
    viewMode.value = 'games-group-view'
    viewHeaderTitle.value = 'Categories'
    const res = await getTopGameCategories()
    categories.value = res.data
    isLoading.value = false
    viewType.value = 'category'
  } catch (error) {
    categories.value = []
    isLoading.value = false
  }
}

async function handleGamesView(name, id, fetchFunction, type) {
  viewMode.value = 'games-list-view'
  viewHeaderTitle.value = name.replace(/_/g, ' ')
  categoryName.value = name.replace(/_/g, ' ')
  const res = await fetchFunction(id)
  gamesList.value = res.data.sort((a, b) => b.priority - a.priority) || []
  viewType.value = type
  isLoading.value = false
}

async function handleGamesByCategoryView(name, id) {
  await handleGamesView(name, id, gamesByTopCategory, 'category')
}

async function handleGamesByProviderView(name, id) {
  gamesList.value = [] // Ensure gamesList is cleared before fetching
  await handleGamesView(name, id, getGamesByProviders, 'provider')
}

async function handleFilteredGamesView(title) {
  viewMode.value = 'games-list-view'
  viewHeaderTitle.value = title
  categoryName.value = title
  const res = await getCasinoBonusGames(userStore.currentUser.id)
  gamesList.value = Object.values(res.data)
  // ? res.data.filter((game) => gameIdSet.has(game.gameId))
  // : [];
  viewType.value = 'category'
  isLoading.value = false
}

async function handleBonusGames() {
  await handleFilteredGamesView('Bonus Games')
}

async function handleCasinoJackpots(gameIds) {
  await handleFilteredGamesView('Jackpot Games', gameIds)
}

const getImagePath = (game) => {
  try {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${encodeURIComponent(
      game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    )}.png?alt=media`
  } catch (error) {
    console.error('Error generating image path:', error)
    return `https://placehold.co/150x175?text=${encodeURIComponent(game.title)}`
  }
}

async function redirectToGamePlay(game) {
  utilsStore.previousRoute = route.fullPath
  const gameIsBonus =
    activeBonus.value && activeBonus.value.gameId && activeBonus.value.gameId.includes(game.gameId)
  // console.log(gameIsBonus)
  if (userStore.currentUser) {
    if (route.name !== 'casino-bonus' && route.name !== 'bonus-games') {
      if (gameIsBonus) {
        emitter.emit('showCasinoDialog', {
          bonus: activeBonus.value,
          game: game
        })
      } else {
        return router.push({
          name: 'game-play',
          params: {
            game_name: slugify(game.title),
            game_id: game.id
          }
        })
      }
    } else {
      if (gameIsBonus) {
        emitter.emit('showCasinoDialog', {
          bonus: activeBonus.value,
          game: game
        })
      } else {
        return router.push({
          name: 'game-play',
          params: {
            game_name: slugify(game.title),
            game_id: game.id
          }
        })
      }
    }
  }
}

const loadMore = async () => {
  isLoadingMore.value = true
  // Simulate loading delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  displayLimit.value += 50
  isLoadingMore.value = false
}

onMounted(() => {
  $('body').removeClass('no-scroll')
  console.log('dfdf')
})
</script>

<style scoped>
@import url('@/assets/css/casino.css');

.title-bg {
  font-size: 28px;
  line-height: 1.4;
  font-weight: 500;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  font-family: var(--stb-font-helper);
  color: rgb(var(--stb-white-1000));
  padding: 22px 0;
  min-height: 80px;
  z-index: 1;
}

.title-bg:after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgb(var(--stb-unique-color-1));
  background-color: rgb(var(--stb-green-1000));
  background-image: url(/assets/static/general/ornament-title.svg);
  background-repeat: repeat-x;
  background-position: center;
  background-size: 40px 70px;
}

.no-data {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  font-size: 1rem;
  padding: 2.33333333rem;
  text-align: center;
  background-color: transparent;
}

.casino {
  background-color: #000;
  min-height: 100vh;
}

.games-container {
  height: 100%;
  width: 100%;
  padding: 0 15px;
}

.head-top {
  padding: 0 15px;
}

.game-group {
  background-color: #373737;
  border-radius: 10px;
  margin: 10px 15px 0px;
}

.games-grid {
  height: 100%;
  max-height: calc(100vh - (var(--distance-from-top) + 50px));
  overflow-y: auto;
  width: 100%;
  padding-bottom: 100px; /* Add space for the load more section */
}

.games-grid .row {
  margin: 0 -8px;
}

.games-grid .col {
  padding: 0 8px;
  margin-bottom: 16px;
  display: flex;
}

.games-grid .col > div {
  width: 100%;
}

.title-bg {
  padding: 15px;
  margin-bottom: 0;
  background-color: #121212;
  border-bottom: 1px solid #333;
}

.game-group .group {
  /* /* display: flex; */
  /* flex-direction: column; */
  /* align-items: center; */
  padding: 10px 25px;
  font-size: 2.8vw;
  border-radius: 10px;
  border: 1px solid #333;
  /* margin-left: 5px; */
  /* margin-right: 5px; */
  color: #fff;
  text-align: center;
  /* background-color: #373737; */
  /* white-space: nowrap; */
}

.game-provider {
  padding: 0 15px;
}

.game-provider > span {
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  /* border-right: 1px solid white;
  border-bottom: 1px solid white; */
  background-color: #333;
  color: #fff;
  justify-content: center;
  align-items: center;
  height: 40px;
  /* width: 40px; */
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.game-search {
  padding: 10px;
  font-size: 2.8vw;
  border-radius: 10px;
  border: 1px solid #4f4f4f;
  color: #fff;
  text-align: center;
  margin-left: 10px;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
}

.game-group .group.active {
  background-color: var(--brand-secondary);
  -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.5);
  /* color: var(--brand-secondary); */
}

.games-container .grid-container {
  display: grid;
  /* display: flex; */
  overflow-x: scroll;
  white-space: no;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding: 20px 0px 0px;
}

.games-container .categories-list {
  display: flex;
  flex-wrap: nowrap;
  /* Prevent wrapping */
  overflow: auto;
  /* Enable horizontal scrolling if items overflow */
  gap: 10px;
  /* Space between items */
}

.games-container .categories-list::-webkit-scrollbar {
  display: none;
}

.games-container .categories-list .category {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border-radius: 10px;
  color: #b3bec1;
  white-space: nowrap;
  flex: 0 0 auto;
  margin-right: 15px;
}

.games-container .categories-list .category img {
  height: 25px;
  margin-bottom: 5px;
  padding-right: 10px;
}

.games-container .categories-list .category.active {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  background-color: #333;
  color: white;
  border-radius: 10px;
  padding: 5px 15px;
}

.games-container .categories-list .category img {
  height: 30px;
  width: 100%;
  object-fit: cover;
}

.load-more-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-bottom: 20px;
  z-index: 10;
}

.load-more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 30%,
    rgba(0, 0, 0, 0.9) 70%,
    rgba(0, 0, 0, 1) 100%
  );
  pointer-events: none;
}

.load-more-btn {
  position: relative;
  z-index: 2;
  min-width: 120px;
  padding: 8px 24px;
  border-radius: 20px;
  background-color: #2563eb;
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.load-more-btn:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
  transform: none;
}
</style>

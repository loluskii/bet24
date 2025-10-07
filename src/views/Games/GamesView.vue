<template>
  <div class="casino">
    <HeaderCasino></HeaderCasino>
    <Winners />
    <div class="carousel">
      <Carousel></Carousel>
    </div>
    <div v-if="!isLoading" class="games-container pb-5">
      <div class="head-top d-flex align-items-center">
        <div class="categories-list">
          <div
            class="category"
            :class="!activeTopCategory ? 'active' : ''"
            @click="getGameByTopCategory()"
            id="discover"
          >
            <img src="@/assets/images/casino/all.png" class="img-fluid" alt="" srcset="" />
            <span>Discover</span>
          </div>
          <div
            class="category"
            :class="activeTopCategory?.id === 'bonus' ? 'active' : ''"
            @click="getBonusGames()"
            id="bonus_games"
          >
            <img src="@/assets/images/casino/bonus.png" class="img-fluid" alt="" srcset="" />
            <span>Bonus Games</span>
          </div>
          <div
            class="category"
            @click="openQtechLobby()"
            id="qtech_games"
          >
            <img
              src="@/assets/images/casino/bonus.png"
              class="img-fluid"
              alt=""
              srcset=""
            />
            <span>QTech Lobby</span>
          </div>
          <template v-for="(top, index) in topGameCategories" :key="index">
            <div
              class="category"
              :class="activeTopCategory?.id == top.id ? 'active' : ''"
              @click="getGameByTopCategory(top)"
              v-if="top.priority >= 0"
              :id="'category_' + top.id"
            >
              <img :src="getImageSrc(top.slug)" class="img-fluid" alt="" srcset="" />
              <span>{{ top.name }}</span>
            </div>
          </template>
        </div>
      </div>
      <div v-if="!isLoading" ref="myElement" class="games-grid mt-3">
        <div v-if="currentView === 'grouped_category'" class="grouped-games-section">
          <!-- Jackpots -->
          <!-- <template v-if="jackpots">
            <div
              class="header d-flex justify-content-between align-items-center"
            >
              <h1 class="h5 text-white fw-normal">Jackpots</h1>
              <span
                @click="$router.push({ name: 'casino-jackpots' })"
                class="text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
                >Show More
              </span>
            </div>
            <Jackpots :jackpots="jackpots" :games="gamesList"></Jackpots>
          </template> -->
          <!-- Jackpots -->

          <!-- First two categories -->
          <template v-for="(top, index) in topGameCategories.slice(0, 2)" :key="index">
            <div
              class="group"
              v-if="top.priority >= 0"
              :data-category-id="top.id"
              v-intersection="handleIntersection"
            >
              <div class="header d-flex justify-content-between align-items-center">
                <h1 class="h5 text-white fw-normal">{{ top.name }}</h1>
                <span
                  class="text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
                  @click="showMore(top)"
                  >Show More
                </span>
              </div>
              <template v-if="gamesList[top.id] && gamesList[top.id].length">
                <div class="grid-container mb-3 pb-3" ref="scrollComponent">
                  <div
                    class=""
                    v-for="(game, index) in gamesList[top.id]"
                    :key="index"
                    @click="redirectToGamePlay(game)"
                  >
                    <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
                  </div>
                </div>
              </template>
              <template v-else-if="!gamesList[top.id]">
                <div class="grid-container mb-3 pb-3">
                  <div class="" v-for="i in 4" :key="i">
                    <GameCard loading />
                  </div>
                </div>
              </template>
              <div v-else class="no-data">
                <div class="text-center py-4">
                  <i class="x-icon-game text-muted mb-3" style="font-size: 2rem"></i>
                  <div class="text-muted" style="white-space: pre-line">
                    Sorry, there are no games currently<br />available in this category. Please try
                    later.<br />Thank you.
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Providers Section -->
          <div class="group d-none">
            <div class="header d-flex justify-content-between align-items-center">
              <h1 class="h5 text-white fw-normal">Top Providers</h1>
              <span
                @click="$router.push({ name: 'casino-providers' })"
                class="text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
                >Show More
              </span>
            </div>
            <div class="providers-container mb-3 pb-3">
              <div
                class="provider-card"
                v-for="(provider, index) in providers"
                :key="index"
                @click="
                  $router.push({
                    name: 'games-by-provider',
                    params: { provider: slugify(provider.name) },
                    query: { providerId: provider.id }
                  })
                "
              >
                <div class="provider-image">
                  <img :src="getProviderImage(provider)" :alt="provider.name" />
                </div>
                <div class="provider-info">
                  <div class="provider-name">{{ provider.name }}</div>
                  <div class="provider-type">{{ provider.type || 'Casino' }}</div>
                </div>
              </div>
              <div v-if="isLoadingProviders" class="provider-card" v-for="i in 5" :key="i">
                <div class="provider-image placeholder"></div>
                <div class="provider-info">
                  <div class="provider-name placeholder"></div>
                  <div class="provider-type placeholder"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Remaining categories -->
          <template v-for="(top, index) in topGameCategories.slice(2)" :key="index">
            <div
              class="group"
              v-if="top.priority >= 0"
              :data-category-id="top.id"
              v-intersection="handleIntersection"
            >
              <div class="header d-flex justify-content-between align-items-center">
                <h1 class="h5 text-white fw-normal">{{ top.name }}</h1>
                <span
                  class="text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
                  @click="showMore(top)"
                  >Show More
                </span>
              </div>
              <template v-if="gamesList[top.id] && gamesList[top.id].length">
                <div class="grid-container mb-3 pb-3" ref="scrollComponent">
                  <div
                    class=""
                    v-for="(game, index) in gamesList[top.id]"
                    :key="index"
                    @click="redirectToGamePlay(game)"
                  >
                    <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
                  </div>
                </div>
              </template>
              <template v-else-if="!gamesList[top.id]">
                <div class="grid-container mb-3 pb-3">
                  <div class="" v-for="i in 4" :key="i">
                    <GameCard loading />
                  </div>
                </div>
              </template>
              <div v-else class="no-data">
                <div class="text-center py-4">
                  <i class="x-icon-game text-muted mb-3" style="font-size: 2rem"></i>
                  <div class="text-muted" style="white-space: pre-line">
                    Sorry, there are no games currently<br />available in this category. Please try
                    later.<br />Thank you.
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="currentView === 'single_category'" class="grouped-games-section">
          <div class="group">
            <div class="header d-flex justify-content-between align-items-center mb-3">
              <h1 class="card-title h2 fw-bold text-white">
                {{ activeTopCategory.name }}
              </h1>
            </div>
            <div class="grid-container mb-3 pb-3" v-if="gamesList.length" ref="scrollComponent">
              <div
                class=""
                v-for="(game, index) in gamesList"
                :key="index"
                @click="redirectToGamePlay(game)"
              >
                <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
              </div>
            </div>
            <div v-else-if="!singleCategoryLoading && !gamesList.length" class="no-data">
              <div style="white-space: pre-line">
                Sorry, there are no games currently<br />available in this category. Please try
                later.<br />Thank you.
              </div>
            </div>
            <LoadingSpinner v-else></LoadingSpinner>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="games-container placeholder-glow">
      <div class="head-top d-flex align-items-center">
        <div class="categories-list">
          <div class="category" v-for="i in 4" :key="i"></div>
        </div>
      </div>
      <!-- <div class="game-provider"></div> -->
      <div class="games-grid mt-3">
        <div class="grouped-games-section">
          <div v-for="x in 3" :key="x" class="group">
            <div class="header d-flex justify-content-between align-items-center">
              <div class="placeholder h4" style="width: 120px"></div>
              <div class="placeholder" style="width: 80px; height: 24px"></div>
            </div>
            <div class="grid-container">
              <div class="" v-for="i in 2" :key="i">
                <GameCard loading />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorState.categoriesError" class="error-message">
      Failed to load categories. Please try again later.
    </div>

    <div v-if="errorState.gamesError" class="error-message">
      Failed to load games. Please try again later.
    </div>

    <div v-if="errorState.qtechLobbyError" class="error-message">
      Failed to load QTech Lobby
    </div>
  </div>
</template>

<script setup>
import Winners from '../../components/Casino/Winners.vue'
import Jackpots from '../../components/Casino/Jackpots.vue'
import HeaderCasino from '@/components/HeaderCasino.vue'
import Carousel from '@/components/Home/Carousel.vue'
import { ref, onBeforeMount, computed } from 'vue'
import {
  getTopGameCategories,
  gamesByTopCategory,
  getGameLobbyUrl,
  getProviders,
  FEED_TOGGLE
} from "@/helpers";
import router from "@/router";
import { useAuthStore, useUsersStore, useUtilsStore } from "@/stores";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner.vue";
import { getJackpots, slugify } from "@/helpers";
import emitter from "@/plugins/emitter";
import { useRoute } from "vue-router";
import GameCard from "@/components/Casino/GameCard.vue";
import { getCasinoBonusGames } from "@/helpers";

const topGameCategories = ref([])
const gamesList = ref({})
const activeTopCategory = ref(null)
const scrollComponent = ref(null)
const authStore = useAuthStore()
const userStore = useUsersStore()
const isLoading = ref(true)
const singleCategoryLoading = ref(true)
const myElement = ref(null)
const currentView = ref('grouped_category')
const bonus = ref(null)
const jackpots = ref([])
const route = useRoute()
const utilsStore = useUtilsStore()
const errorState = ref({
  categoriesError: false,
  gamesError: false,
  jackpotsError: false,
  qtechLobbyError: false
});
const providers = ref([]);
const isLoadingProviders = ref(false);

// Intersection Observer directive
const vIntersection = {
  mounted: (el, binding) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value(entry.target)
        }
      })
    })
    observer.observe(el)
  }
}

const handleIntersection = async (element) => {
  const categoryId = element.getAttribute('data-category-id')
  if (categoryId && !gamesList.value[categoryId]) {
    await loadGamesForCategory(categoryId)
  }
}

const loadGamesForCategory = async (categoryId) => {
  try {
    const response = await gamesByTopCategory(categoryId)
    gamesList.value[categoryId] =
      response.data?.slice(0, 12).sort((a, b) => b.priority - a.priority) || []
  } catch (error) {
    console.error(`Error loading games for category ${categoryId}:`, error)
    gamesList.value[categoryId] = []
  }
}

const getImageSrc = (prov) => {
  try {
    let name = prov.split('-')
    let imageName = name[1] !== 'games' ? prov : name[0]
    return new URL(`../../assets/images/casino/${imageName}.png`, import.meta.url)
  } catch (error) {
    console.error('Error loading category image:', error)
    return new URL(`../../assets/images/casino/virtuals.png`, import.meta.url)
  }
}

const openQtechLobby = async () => {
  isLoading.value = true
  try {
    const { username, id, authCode } = userStore.currentUser || {};
    let payload = {
      gameId: 0,
      clientId: import.meta.env.VITE_CLIENT_ID,
      username: username || 'Demo',
      userId: id || 0,
      demo: id ? false : true,
      isMobile: true,
      homeUrl: import.meta.env.VITE_SITE_URL,
      authCode: authCode || '111111',
      balanceType: "real",
      type: 'lobby'
    };

    const res = await getGameLobbyUrl(payload);
    isLoading.value = false
    window.location.href = res.url
  } catch (error) {
    console.error(error);
    isLoading.value = false
    errorState.qtechLobbyError = true
  }
}

const showMore = (top) => {
  utilsStore.previousRoute = route.fullPath
  return router.push({
    name: 'games-by-category',
    params: { category: slugify(top.name) },
    query: { category_id: top.id }
  })
}

const activeBonus = computed(() => {
  return userStore.casinoActiveBonus
})

async function getCategories() {
  isLoading.value = true
  errorState.value.categoriesError = false

  try {
    const response = await getTopGameCategories()
    const categories = response.data

    topGameCategories.value = categories
      .map((category) => ({
        ...category,
        isLoading: false,
        hasError: false
      }))
      .sort((a, b) => b.priority - a.priority)

    // Load first category immediately
    if (topGameCategories.value.length > 0) {
      await loadGamesForCategory(topGameCategories.value[0].id)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    errorState.value.categoriesError = true
  } finally {
    isLoading.value = false
  }
}

async function getGameByTopCategory(category) {
  singleCategoryLoading.value = true
  errorState.value.gamesError = false
  gamesList.value = [] // Clear the list to show loading state

  try {
    if (category) {
      const element = document.getElementById('category_' + category.id)
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })

      currentView.value = 'single_category'
      activeTopCategory.value = category
      const res = await gamesByTopCategory(category.id)
      gamesList.value = res.data || []
    } else {
      document.getElementById('discover')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
      currentView.value = 'grouped_category'
      activeTopCategory.value = null
      await getCategories()
    }
  } catch (error) {
    console.error('Error fetching games by category:', error)
    errorState.value.gamesError = true
  } finally {
    singleCategoryLoading.value = false
  }
}

const getJK = async () => {
  try {
    const res = await getJackpots()
    jackpots.value = res.data.jackpots ?? null
  } catch (error) {
    console.error('Error fetching jackpots:', error)
    errorState.value.jackpotsError = true
  }
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

const handleImageError = (event, game) => {
  // Replace the failed image with a placeholder
  let name = encodeURIComponent(game.title)
  event.target.src = `https://placehold.co/150x175?text=${name}` // Specify your placeholder image path
  event.target.alt = `${game.title}`
}

async function redirectToGamePlay(game) {
  utilsStore.previousRoute = route.fullPath
  try {
    if (
      activeBonus.value &&
      activeBonus.value.gameId &&
      activeBonus.value.gameId.includes(game.gameId)
    ) {
      emitter.emit('showCasinoDialog', { bonus: activeBonus.value, game })
      return
    }

    await router.push({
      name: 'game-play',
      params: { game_name: slugify(game.title), game_id: game.id }
    })
  } catch (error) {
    console.error('Error redirecting to game:', error)
  }
}

const updateCSSVar = () => {
  if (myElement.value) {
    const distanceFromTop = myElement.value.getBoundingClientRect().top + window.scrollY
    // Assign the distance to a CSS variable
    document.documentElement.style.setProperty('--distance-from-top', `${distanceFromTop}px`)
  }
}

const getTopProviders = async () => {
  isLoadingProviders.value = true
  try {
    const response = await getProviders()
    providers.value = Object.values(response.data).slice(0, 5)
  } catch (error) {
    console.error('Error fetching providers:', error)
    providers.value = []
  } finally {
    isLoadingProviders.value = false
  }
}

const getProviderImage = (provider) => {
  try {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Providers%2F${encodeURIComponent(
      provider.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    )}.png?alt=media`
  } catch (error) {
    console.error('Error generating provider image path:', error)
    return `https://placehold.co/200x112?text=${encodeURIComponent(provider.name)}`
  }
}

async function getBonusGames() {
  singleCategoryLoading.value = true
  errorState.value.gamesError = false
  gamesList.value = [] // Clear the list to show loading state

  try {
    const element = document.getElementById('bonus_games')
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })

    currentView.value = 'single_category'
    activeTopCategory.value = { id: 'bonus', name: 'Bonus Games' }

    const res = await getCasinoBonusGames(userStore.currentUser.id)
    gamesList.value = Object.values(res.data) || []
  } catch (error) {
    console.error('Error fetching bonus games:', error)
    errorState.value.gamesError = true
  } finally {
    singleCategoryLoading.value = false
  }
}

onBeforeMount(async () => {
  Promise.all([getJK(), getCategories(), getTopProviders()])
  updateCSSVar()
  // $("body").addClass("no-scroll");
})
</script>

<style scoped>
@import url('@/assets/css/casino.css');

.x-icon-search::before {
  content: '\e613';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.card-img-top {
  width: 100%;
  height: 105px;
  object-fit: cover;
}

.x-icon-search:before {
  color: #ffffff;
  /* font-size: 1.5rem; */
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
  background-color: #121212;
  min-height: 100vh;
}

.games-container {
  height: 100%;
  width: 100%;
  /* padding: 15px; */
}

.head-top {
  padding: 15px;
}

.game-group {
  background-color: #373737;
  border-radius: 10px;
  margin: 10px 15px 0px;
}

.games-grid {
  height: 100%;
  max-height: calc(100vh - (var(--distance-from-top) + 50px));
  overflow: scroll !important;
  width: 100%;
  padding: 0 15px;
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
  background-color: #333;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
}

.game-provider > span {
  font-size: 15px;
  font-weight: bold;
  border-radius: 10px;
  padding: 0 15px;
  /* border-right: 1px solid white;
  border-bottom: 1px solid white; */

  justify-content: center;
  align-items: center;
  height: 40px;
  /* width: 40px; */
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.head-top .divider {
  margin: 0 10px;
  font-size: 18px;
  border: 0.2px solid white;
  height: 32px;
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 0px 0px 0px;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.games-container .grid-container::-webkit-scrollbar {
  display: none;
}

.games-container .grid-container > div {
  scroll-snap-align: start;
  /* width: 150px; */
  flex: 0 0 auto;
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

.games-container .grid-container::-webkit-scrollbar,
.categories-list::-webkit-scrollbar {
  display: none;
}

.games-container .categories-list .category {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #b3bec1;
  white-space: nowrap;
  flex: 0 0 auto;
  background-color: #2c2c2c;
  padding: 5px 15px;
}

.games-container .categories-list .category img {
  height: 25px;
  margin-bottom: 5px;
  /* padding-right: 10px; */
}

.games-container .categories-list .category.active {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  background-color: #494949;
  color: white;
  border-radius: 10px;
  padding: 5px 15px;
  border: 1px solid var(--brand-highlight-text);
}

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 1rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 15px;
  font-size: 0.95rem;
}

.placeholder-glow .category {
  background-color: #2c2c2c;
  border-radius: 10px;
  height: 60px;
  width: 80px;
  margin-right: 10px;
}

.placeholder-glow .game-provider {
  height: 50px;
  margin: 15px;
  border-radius: 10px;
}

.placeholder-glow .group {
  margin-bottom: 20px;
}

.placeholder-glow .header {
  margin-bottom: 15px;
}

.header {
  /* padding: 0 15px; */
  margin-bottom: 15px;
}

.header h1 {
  font-size: 1.25rem;
  margin: 0;
}

.header span {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header span:hover {
  background-color: #494949;
}

.game-provider {
  background-color: #333;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px;
  border-radius: 10px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-provider:hover {
  background-color: #494949;
}

.game-provider > span {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0 15px;
}

.game-provider .icon {
  width: 24px;
  height: 24px;
}

.providers-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 0 15px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* margin: 0 -15px; */
  width: 100%;
}

.providers-container::-webkit-scrollbar {
  display: none;
}

.provider-card {
  flex: 0 0 70%;
  scroll-snap-align: start;
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #2c2c2c;
}

.provider-card:hover {
  transform: translateY(-2px);
  border-color: #3a3a3a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.provider-image {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  background: #2c2c2c;
  overflow: hidden;
}

.provider-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.provider-card:hover .provider-image img {
  transform: scale(1.05);
}

.provider-info {
  padding: 16px;
  background: #1a1a1a;
}

.provider-name {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.provider-type {
  color: #9ca0ab;
  font-size: 0.9rem;
  font-weight: 500;
}

.provider-card .placeholder {
  background: #2c2c2c;
  animation: placeholder-glow 2s ease-in-out infinite;
  border-radius: 4px;
}

.provider-card .provider-info .placeholder {
  height: 20px;
  margin-bottom: 8px;
}

.provider-card .provider-info .placeholder:last-child {
  width: 60%;
  margin-bottom: 0;
}

@keyframes placeholder-glow {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.5;
  }
}
</style>

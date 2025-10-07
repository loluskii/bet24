<template>
  <div class="casino">
    <HeaderOther :headerTitle="'Jackpots'" />
    <Winners />
    <div class="carousel">
      <Carousel></Carousel>
    </div>
    <div v-if="!isLoading" class="games-container pb-5">
      <div v-if="!isLoading" ref="myElement" class="games-grid mt-3">
        <div v-if="currentView === 'list'" class="grouped-games-section">
          <!-- Jackpots -->
          <div class="header d-flex justify-content-between align-items-center">
            <h1 class="h5 text-white fw-normal">Jackpots</h1>
            <!-- <span
              class="text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
              >Show More
            </span> -->
          </div>
          <div class="grid-containe mb-3 pb-3">
            <div
              class="card bg-dark rounded-lg mb-3"
              @click="showJackpot(j)"
              v-for="(j, index) in jackpots"
              :key="index"
            >
              <img src="https://placehold.co/175" class="card-img-top" alt="..." />
              <div class="card-body d-flex flex-column p-2">
                <div class="text-truncate fw-bold" style="color: var(--brand-highlight-text)">
                  {{ j.name }}
                </div>
              </div>
            </div>
          </div>
          <!-- Jackpots -->
        </div>
        <div v-if="currentView === 'single'" class="grouped-games-section">
          <div class="group">
            <div class="title-bg d-flex align-items-center mb-3">
              <span @click="currentView = 'list'" class="m-icon m-icon--back mr-3"></span>

              <h3 class="h4 text-white fw-bold text-capitalize">
                {{ activeJackpot.name }}
              </h3>
            </div>
            <div class="grid-containe mb-3 pb-3">
              <div class="card bg-dark rounded-lg mb-3">
                <img
                  :src="`https://placehold.co/175`"
                  class="card-img-top"
                  alt="..."
                  style="height: 150px"
                />
              </div>
            </div>
            <table class="table table-dark table-striped table-bordered">
              <thead>
                <td>Tier</td>
                <td>Amount</td>
              </thead>
              <tbody>
                <tr v-for="(tier, t) in activeJackpot.tiers" :key="t">
                  <td>{{ tier.tier + 1 }}</td>
                  <td>{{ tier.amount.toLocaleString('en') }}</td>
                </tr>
              </tbody>
            </table>
            <h3 class="h4 text-white fw-bold text-capitalize my-3">Games</h3>
            <div class="row mb-3 pb-3" v-if="jackpotGames.length" ref="scrollComponent">
              <div
                class="col-6"
                v-for="(game, index) in jackpotGames"
                :key="index"
                @click="redirectToGamePlay(game)"
              >
                <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
              </div>
            </div>
            <div v-else-if="!jackpotGames.length" class="no-data">
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
      <div class="game-provider placeholder p-4 rounded"></div>
      <div class="games-grid mt-3">
        <div class="grouped-games-section">
          <div v-for="x in 4" :key="x" class="group">
            <div class="header d-flex justify-content-between align-items-center">
              <h1 class="fw-normal placeholder h4 p-2 rounded" style="width: 50px"></h1>
              <span
                style="width: 50px"
                class="placeholder p-2 rounded text-decoration-none text-uppercase bg-dark small text-white px-2 py-1 rounded"
              >
              </span>
            </div>
            <div class="grid-container mb-3 pb-3" ref="scrollComponent">
              <div
                class="card bg-dark rounded-3 placeholder"
                v-for="i in 3"
                :key="i"
                style="width: 150px"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Winners from '../../components/Casino/Winners.vue'
import HeaderCasino from '@/components/HeaderCasino.vue'
import Carousel from '@/components/Home/Carousel.vue'
import { ref, onBeforeMount, computed } from 'vue'
import { gamesByTopCategory } from '@/helpers'
import router from '@/router'
import { useAuthStore } from '@/stores'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { getJackpots, slugify } from '@/helpers'
import emitter from '@/plugins/emitter'
import Game from '@/components/Casino/Game.vue'
import HeaderOther from '../../components/HeaderOther.vue'
import { useRoute } from 'vue-router'
import { useUtilsStore } from '@/stores'
import GameCard from '@/components/Casino/GameCard.vue'

const route = useRoute()
const gamesList = ref([])
const jackpotGames = ref([])
const jackpots = ref([])
const activeJackpot = ref({})
const currentView = ref('list')
const isLoading = ref(false)
const authStore = useAuthStore()
const utilsStore = useUtilsStore()
// const jId = ref(rout e.query?.jId)

const getJK = async () => {
  const res = await getJackpots()
  jackpots.value = res.data.jackpots
  if (route.query?.jId) {
    let jackpot = res.data.jackpots.find((j) => j.mainJackpotID == route.query?.jId)
    if (jackpot) {
      showJackpot(jackpot)
    }
  }
}

const getAllGames = async () => {
  try {
    const gamesResponse = await gamesByTopCategory()
    gamesList.value = gamesResponse.data.sort((a, b) => b.priority - a.priority)
  } catch (error) {
    gamesList.value = []
  }
}

const showJackpot = (j) => {
  currentView.value = 'single'
  activeJackpot.value = j
  let activeJackpotGames = j.games.split(',')
  const jackpotGamesSet = new Set(activeJackpotGames)
  jackpotGames.value = gamesList.value
    ? gamesList.value.filter((obj) => jackpotGamesSet.has(obj.gameId))
    : []
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

const redirectToGamePlay = async (game) => {
  try {
    await router.push({
      name: 'game-play',
      params: { game_name: slugify(game.title), game_id: game.id }
    })
  } catch (error) {
    console.error('Error redirecting to game:', error)
  }
}

onBeforeMount(async () => {
  Promise.all([getJK(), getAllGames()])
})
</script>

<style scoped>
@import url('@/assets/css/casino.css');

.m-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  /* margin-right: 1.58333333rem; */
}
.m-icon :before {
  font-size: 1.33333333rem !important;
}
.m-icon.m-icon--back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

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
  /* display: flex; */
  overflow-x: scroll;
  white-space: nowrap;
  grid-template-columns: repeat(12, 1fr); /* Set total items in a single row */
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  padding: 20px 0px 0px;
}

.games-container .categories-list {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow: auto; /* Enable horizontal scrolling if items overflow */
  gap: 10px; /* Space between items */
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
</style>

<template>
  <div class="title-bg d-flex align-items-center">
    <span @click="goBack" class="m-icon m-icon--back mr-3"></span>

    <h3 class="h4 text-white fw-bold mb-0 text-capitalize">
      {{ titleText }}
    </h3>
  </div>

  <!-- <CategoryProvider /> -->
  <div class="games-container" ref="myElement">
    <div class="games-grid mt-3">
      <div class="row mb-3 pb-5" style="overflow-x: hidden">
        <div
          class="col-6 mb-3"
          v-for="(game, index) in displayedGames"
          :key="index"
          @click="redirectToGamePlay(game)"
        >
          <GameCard :image="getImagePath(game)" :title="game.title" :type="game.type" />
        </div>
      </div>
    </div>

    <!-- Load More section with increased height to overlap games -->
    <div class="load-more-container" v-if="hasMoreGames">
      <div class="load-more-overlay"></div>
      <button class="btn btn-primary load-more-btn" @click="loadMore" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import CategoryProvider from './CategoryProvider.vue'
import { useUsersStore, useUtilsStore } from '@/stores'
import Game from '@/components/Casino/Game.vue'
import { useRouter } from 'vue-router'
import GameCard from '@/components/Casino/GameCard.vue'

const props = defineProps(['games', 'titleText', 'type'])

const isLoading = ref(false)
const myElement = ref(null)
const currentView = ref('providers')
const usersStore = useUsersStore()
const router = useRouter()
const { previousRoute } = useUtilsStore()

const itemsPerLoad = 35
const displayLimit = ref(itemsPerLoad)

// Computed property for displayed games
const displayedGames = computed(() => {
  return props.games.slice(0, displayLimit.value)
})

const goBack = () => {
  if (props.type === 'provider') {
    router.push({ name: 'casino-providers' })
  } else {
    router.push(previousRoute)
  }
}

// Check if more games are available
const hasMoreGames = computed(() => {
  return displayLimit.value < props.games.length
})

// Load more function
const loadMore = async () => {
  isLoading.value = true
  // Simulate loading delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  displayLimit.value += itemsPerLoad
  isLoading.value = false
}

const updateCSSVar = () => {
  // console.log(myElement.value);
  if (myElement.value) {
    const distanceFromTop =
      myElement.value.getBoundingClientRect().top + document.documentElement.scrollTop
    // Assign the distance to a CSS variable
    document.documentElement.style.setProperty('--distance-from-top', `${distanceFromTop}px`)
  } else {
    console.log('sdfsdf')
  }
}

onMounted(() => {
  updateCSSVar()
  // document.body.classList.add("no-scroll");
})

// Add the getImagePath function
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

// Add redirectToGamePlay function
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

.title-bg {
  font-size: 20px;
  /* line-height: 1.4; */
  font-weight: 500;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  text-transform: uppercase;
  /* text-align: center; */
  font-family: var(--stb-font-helper);
  color: rgb(var(--stb-white-1000));
  /* padding: 22px 0; */
  /* min-height: 80px; */
  z-index: 1;
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
  background-color: #000;
  min-height: 100vh;
}

.games-container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  /* padding: 15px; */
}

.head-top {
  padding: 15px 0;
}

.game-group {
  background-color: #373737;
  border-radius: 10px;
  margin: 10px 15px 0px;
}

.games-grid {
  height: 100%;
  max-height: calc(100vh - (var(--distance-from-top) + 80px));
  width: 100%;
  padding-bottom: 100px; /* Add space for the load more section */
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

.game-search {
  margin-top: 10px;
  padding: 10px;
  font-size: 2.8vw;
  border-radius: 10px;
  border: 1px solid #333;
  color: #fff;
  text-align: center;
  margin-left: 10px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
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
  height: 150px; /* Increased height to overlap more of the games */
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
  pointer-events: none; /* Allows clicking through to the button */
}

.load-more-btn {
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}

.load-more-btn {
  position: relative;
  z-index: 2;
  min-width: 120px;
  padding: 8px 24px;
  border-radius: 20px;
  background-color: #2563eb; /* Adjust color to match your theme */
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background-color: #1d4ed8; /* Darker shade for hover */
  transform: translateY(-1px);
}

.load-more-btn:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
  transform: none;
}
</style>

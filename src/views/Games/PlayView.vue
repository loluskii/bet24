<template>
  <div class="game-play">
    <HeaderCasinoPlay @open-leave-modal="showRecommendedGames = true"></HeaderCasinoPlay>
    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <iframe
      v-if="!isLoading"
      title="casino"
      style="border-style: none; width: 100%; height: calc(100% - 60px)"
      :src="gameURL"
    />
    <div class="recommended-games">
      <!-- Leave Confirmation Popup -->
      <leaveCasinoPopup
        :show-popup="showRecommendedGames"
        @exit="exitGame"
        @continue="showRecommendedGames = false"
        :games-list="gamesList"
        @select-game="moveToNewGame"
      />
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, onBeforeMount, computed } from 'vue'
import { getCasinoStartUrl, gamesByTopCategory, slugify, getSmatVirtualStartUrl } from '@/helpers'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'
import emitter from '@/plugins/emitter'
import HeaderCasinoPlay from '../../components/HeaderCasinoPlay.vue'
import leaveCasinoPopup from '../../components/Casino/leaveCasinoPopup.vue'
import { useUtilsStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const gameURL = ref('')
const isLoading = ref(false)
const { currentUser } = useUsersStore()
const utilsStore = useUtilsStore()
const showRecommendedGames = ref(false)
const gamesList = ref([])
const confirmLeave = ref(null)
const bonus = ref(null)
const previousRoute = ref(null)

watch(
  () => [route.params.game_id],
  async ([game_id]) => {
    await getCasinoURL()
  },
  { immediate: true }
)

async function getCasinoURL() {
  isLoading.value = true

  try {
    const { game_id } = route.params
    const { bonusId, balanceType, bonusType } = route.query
    const { username, id, authCode } = currentUser || {}

    let payload = {
      gameId: parseInt(game_id),
      clientId: import.meta.env.VITE_CLIENT_ID,
      username,
      userId: id,
      demo: false,
      isMobile: true,
      homeUrl: import.meta.env.VITE_SITE_URL,
      authCode,
      balanceType: 'real'
    }

    if (bonusId && balanceType === 'bonus') {
      Object.assign(payload, {
        isBonus: true,
        bonusType,
        bonusId,
        balanceType: 'bonus'
      })
    }

    const res =
      game_id === 'smat_virtual'
        ? await getSmatVirtualStartUrl({
            clientId: payload.clientId,
            userId: id,
            token: authCode
          })
        : await getCasinoStartUrl(payload, 'real')

    gameURL.value = res.url
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function moveToNewGame(game) {
  showRecommendedGames.value = false
  return router.push({
    name: 'game-play',
    params: { game_name: slugify(game.title), game_id: game.id }
  })
}

async function getRecommendedGames() {
  const res = await gamesByTopCategory(11)
  let recommended = res.data && res.data.filter((g) => g.id.toString() !== route.params.gameId)
  gamesList.value = recommended.slice(0, 10)
}

const exitGame = () => {
  if (utilsStore.previousRoute && utilsStore.previousRoute.includes('Play')) {
    return router.push('/Games')
  } else if (utilsStore.previousRoute && !utilsStore.previousRoute.includes('Play')) {
    return router.push(utilsStore.previousRoute)
  }
  return router.push('/')
}

onMounted(async () => {
  await getCasinoURL()
  router.beforeEach((to, from, next) => {
    previousRoute.value = from.fullPath // Store the previous route
    next()
  })
})

onBeforeMount(async () => {
  await getRecommendedGames()
})

onBeforeRouteLeave((to, from, next) => {
  if (route.params.game_id === 'smat_virtual' || showRecommendedGames.value) {
    next()
  } else {
    showRecommendedGames.value = true
  }
})
</script>

<style scoped>
.game-play {
  background-color: black;
  height: 100vh;
  position: relative;
}
</style>

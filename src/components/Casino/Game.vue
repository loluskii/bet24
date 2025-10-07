<template>
  <div class="card bg-dark rounded-3 mb-3" style="min-width: 150px" @click="redirectToGamePlay">
    <img
      :src="getImagePath()"
      class="card-img-top"
      alt="..."
      @error="handleImageError($event, game)"
    />
    <div class="card-body d-flex flex-column p-2">
      <div
        class="text-truncate fw-bold"
        style="max-width: 150px; color: var(--brand-highlight-text)"
      >
        {{ game.title }}
      </div>
      <div class="text-muted">{{ game.type }}</div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore, useUsersStore } from '@/stores'
import { computed } from 'vue'
import { slugify } from '@/helpers'
import emitter from '@/plugins/emitter'
import { useRouter, useRoute } from 'vue-router'
import { useUtilsStore } from '@/stores'

const props = defineProps(['game'])
const authStore = useAuthStore()
const userStore = useUsersStore()
const router = useRouter()
const route = useRoute()
const utilsStore = useUtilsStore()

const activeBonus = computed(() => {
  return userStore.casinoActiveBonus
})

const getImagePath = () => {
  try {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${encodeURIComponent(props.game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())}.png?alt=media`
  } catch (error) {
    console.error('Error generating image path:', error)
    return `https://placehold.co/150x175?text=${encodeURIComponent(props.game.title)}`
  }
}

const handleImageError = (event) => {
  // Replace the failed image with a placeholder
  let name = encodeURIComponent(props.game.title)
  event.target.src = `https://placehold.co/150x175?text=${name}` // Specify your placeholder image path
  event.target.alt = `${props.game.title}`
}

async function redirectToGamePlay() {
  utilsStore.previousRoute = route.fullPath
  if (userStore.currentUser) {
    if (
      activeBonus.value &&
      activeBonus.value.gameId &&
      activeBonus.value.gameId.includes(props.game.gameId)
    ) {
      emitter.emit('showCasinoDialog', {
        bonus: activeBonus.value,
        game: props.game
      })
    } else {
      return router.push({
        name: 'game-play',
        params: {
          game_name: slugify(props.game.title),
          game_id: props.game.id
        }
      })
    }
  }
}
</script>

<style scoped>
@import url('@/assets/css/casino.css');
.card-img-top {
  width: 100%;
  height: 105px;
  object-fit: cover;
}
</style>

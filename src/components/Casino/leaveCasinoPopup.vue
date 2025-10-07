<template>
  <div>
    <!-- Modal for Leave Confirmation -->
    <div
      v-if="showPopup"
      class="modal fade show d-block"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-sm m-0 h-100">
        <div class="modal-content position-absolute bottom-0">
          <div class="modal-body text-center">
            <!-- Confirmation Message -->
            <p class="mb-0 fw-bold" style="font-size: 16px">You may also like these games...</p>
            <!-- Carousel -->
            <div class="game-carousel pb-0">
              <div class="game-carousel-inner">
                <div
                  v-for="game in gamesList"
                  :key="game.id"
                  class="card bg-dark rounded-3 mb-3"
                  style="width: 150px"
                  @click="redirectToGamePlay(game)"
                >
                  <img
                    :src="getImagePath(game)"
                    class="card-img-top"
                    alt="..."
                    @error="handleImageError($event, game)"
                    style="height: 130px; min-width: 148px; object-fit: fill"
                  />
                  <div class="card-footer d-flex flex-column p-2 text-left">
                    <div
                      class="text-truncate fw-bold"
                      style="max-width: 150px; color: var(--brand-highlight-text)"
                    >
                      {{ game.title }}
                    </div>
                    <div class="text-muted">{{ game.type }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Buttons -->
          </div>
          <div class="d-flex justify-content-between">
            <button class="btn btn-lg btn-secondary w-25 py-3 rounded-0" @click="exitGame">
              Exit
            </button>
            <button
              class="btn btn-lg fw-bold w-75 py-3 rounded-0 text-white"
              style="background-color: var(--brand-secondary)"
              @click="continueGame"
            >
              Stay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores'
import { slugify } from '@/helpers'
import emitter from '@/plugins/emitter'
import { computed } from 'vue'

const props = defineProps(['showPopup', 'gamesList'])
const emit = defineEmits(['exit', 'continue', 'select-game'])
const usersStore = useUsersStore()
const router = useRouter()

const getImagePath = (game) => {
  try {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${encodeURIComponent(game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())}.png?alt=media`
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

function exitGame() {
  emit('exit')
}

function continueGame() {
  emit('continue')
}

const activeBonus = computed(() => {
  return usersStore.casinoActiveBonus
})

async function redirectToGamePlay(game) {
  emit('select-game', game)
}
</script>
<style scoped>
@import url('@/assets/css/casino.css');
body {
  font-family: Arial, Helvetica, sans-serif !important;
}
.modal-content {
  border-radius: 0px;
  bottom: 0;
  border: none;
}
.carousel-item img {
  height: 150px;
  object-fit: cover;
}

.game-carousel {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  padding: 10px 0;
}

/* Inner items container */
.game-carousel-inner {
  display: flex;
  gap: 15px;
}

/* Individual carousel items */
.game-carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  text-align: center;
  width: 150px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  /* height: 200px; */
}

/* Game image */
.game-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* Game caption */
.game-caption {
  padding: 8px;
  font-size: 14px;
  font-weight: bold;
}

/* Add these properties to handle text truncation */
.game-caption h5 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

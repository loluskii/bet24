<template>
  <div
    class="grid-container mb-3 pb-3"
    :style="props.jackpots.length < 2 ? 'grid-template-columns: auto;' : ''"
  >
    <div
      class="card bg-dark rounded-lg"
      :style="
        props.jackpots.length < 2 ? 'width: 100%; grid-template-columns: auto;' : 'width: 300px'
      "
      @click="goToJackpotView(j)"
      v-for="(j, index) in props.jackpots"
      :key="index"
    >
      <img
        :src="getImagePath()"
        class="card-img-top"
        alt="..."
        @error="handleImageError($event, j.image)"
      />
      <div class="card-body d-flex flex-column p-2">
        <div class="text-truncate fw-bold" style="color: var(--brand-highlight-text)">
          {{ j.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['jackpots', 'games'])

const jackpots = ref([])
const router = useRouter()
// const

function goToJackpotView(j) {
  return router.push({
    name: 'casino-jackpots',
    query: { jId: j.mainJackpotID }
  })
}
function getImagePath() {
  return `https://placehold.co/175?text=${name}`
}
const handleImageError = (event, game = null) => {
  // Replace the failed image with a placeholder
  let name = encodeURIComponent(game.title)
  event.target.src = `https://placehold.co/150x175?text=${name}` // Specify your placeholder image path
  event.target.alt = `${game.title}`
}

onMounted(() => {})
</script>

<style scoped>
@import url('@/assets/css/casino.css');
.card-img-top {
  width: 100%;
  height: 105px;
  object-fit: cover;
}
</style>

<template>
  <div class="casino-game-card" :class="{ skeleton: loading }">
    <div class="game-image-wrapper">
      <div v-if="loading" class="skeleton-image"></div>
      <img v-else :src="image" :alt="title" class="game-image" @error="handleImageError" />
    </div>
    <div class="game-info mt-2">
      <div v-if="loading" class="skeleton-title"></div>
      <div v-else class="game-title">{{ title }}</div>
      <div v-if="loading" class="skeleton-provider"></div>
      <div v-else class="game-provider">{{ type }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  image: String,
  title: String,
  type: String,
  loading: Boolean
})

const handleImageError = (event) => {
  event.target.src = `https://placehold.co/150x175?text=${encodeURIComponent(props.title)}`
}
</script>

<style scoped>
.casino-game-card {
  background: #181a20;
  border-radius: 16px;
  padding: 0.75rem 0.75rem 1rem 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.casino-game-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.18);
}

.game-image-wrapper {
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 12px;
  overflow: hidden;
  background: #23242a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
  padding-top: 0.5rem;
}

.game-title {
  color: var(--brand-highlight-text);
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.game-provider {
  color: #b0b0b0;
  font-size: 0.95rem;
  margin-bottom: 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Skeleton styles */
.skeleton {
  pointer-events: none;
  animation: skeleton-bg 1.2s infinite linear alternate;
}

.skeleton-image,
.skeleton-title,
.skeleton-provider {
  background: #23242a;
  border-radius: 6px;
  margin-bottom: 0.3rem;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 16/10;
  flex-shrink: 0;
}

.skeleton-title {
  width: 70%;
  height: 18px;
}

.skeleton-provider {
  width: 50%;
  height: 14px;
}

@keyframes skeleton-bg {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
</style>

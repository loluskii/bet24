<template lang="">
  <!-- Home Carousel -->
  <div id="carousel" data-html2canvas-ignore="" class="main-banner" v-if="banners.length">
    <div data-ride="carousel" class="carousel slide">
      <div role="listbox" class="carousel-inner">
        <div
          v-for="(image, index) in banners"
          :key="index"
          class="item"
          :class="currentIndex === index ? 'active' : ''"
          @click="goToSlide(image)"
        >
          <img :src="image.image" />
        </div>
      </div>
    </div>
  </div>
  <!-- Home Carousel -->
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUtilsStore } from '../../stores'

const props = defineProps(['type'])
const utilsStore = useUtilsStore()

const banners = computed(() => {
  return utilsStore.banners.filter((b) => b.position === 'slider')
})

const currentIndex = ref(0)
const intervalId = ref(null)
const autoScrollDelay = ref(3000)
const images = ref([])
function startAutoSlider() {
  intervalId.value = setInterval(() => {
    nextSlide()
  }, autoScrollDelay.value)
}
function stopAutoSlider() {
  clearInterval(intervalId.value)
}
function nextSlide() {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function goToSlide(image) {
  if (image.link) {
    window.location.href = image.link
  }
}

onMounted(async () => {
  startAutoSlider()
})

onBeforeUnmount(() => {
  if (banners.value.length) {
    stopAutoSlider()
  }
})
</script>
<style scoped>
.carousel {
  position: relative;
  z-index: 5;
}

.carousel .carousel-inner {
  position: relative;
  overflow: hidden;
  z-index: 6;
  width: 100%;
  height: 100%;
}

.carousel .carousel-inner > .item {
  display: none;
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-transition: 0.6s ease-in-out left;
  transition: 0.6s ease-in-out left;
}

.carousel .carousel-inner > .item a,
.carousel .carousel-inner > .item a:hover,
.carousel .carousel-inner > .item a:active {
  display: block;
  width: 100%;
  height: 100%;
}

.carousel .carousel-inner > .item > img,
.carousel .carousel-inner > .item > a > img {
  display: block;
  width: 100%;
  height: 100%;
}

.carousel .carousel-inner > .item > img[src=''],
.carousel .carousel-inner > .item > a > img[src=''] {
  visibility: hidden;
}

.carousel .carousel-inner > .active,
.carousel .carousel-inner > .next,
.carousel .carousel-inner > .prev {
  display: block;
}

.carousel .carousel-inner > .active {
  left: 0;
}

.carousel .carousel-inner > .next,
.carousel .carousel-inner > .prev {
  position: absolute;
  top: 0;
  width: 100%;
}

.carousel .carousel-inner > .next {
  left: 100%;
}

.carousel .carousel-inner > .prev {
  left: -100%;
}

.carousel .carousel-inner > .next.left,
.carousel .carousel-inner > .prev.right {
  left: 0;
}

.carousel .carousel-inner > .active.left {
  left: -100%;
}

.carousel .carousel-inner > .active.right {
  left: 100%;
}

.carousel ol,
.carousel li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.carousel .carousel-indicators {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  z-index: 7;
  left: 50%;
  bottom: 5%;
  width: 40%;
  padding-left: 0.39285714rem;
  margin-left: -20%;
  text-align: center;
}

.carousel .carousel-indicators li {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  border-radius: 100%;
  height: 0.32142857rem;
  width: 0.32142857rem;
  min-height: 9px;
  min-width: 9px;
  border: 1px solid #dcdee5;
  background-color: #dcdee5;
  margin-right: 5px;
}

.carousel .carousel-indicators li.active {
  border-color: #e41827;
  background-color: #e41827;
}

.carousel .carousel-control {
  position: absolute;
  z-index: 10;
  top: 0;
  height: 100%;
  width: 5%;
  font:
    bold 50px/10 'Microsoft Yahei',
    sans-serif;
  text-align: center;
  color: #dcdee5;
}

.carousel .carousel-control .disabled {
  opacity: 0.3;
}

.carousel .carousel-control:focus,
.carousel .carousel-control:hover {
  color: #ffffff;
}

.carousel .carousel-control.left {
  left: 0;
}

.carousel .carousel-control.right {
  right: 0;
}

.main-banner {
  height: 5.33333333rem;
  position: relative;
}

.main-banner .carousel {
  height: 5.33333333rem;
}

.main-banner .carousel .carousel-control {
  display: none;
}

.main-banner .carousel .carousel-indicators {
  display: none;
}

.main-banner .carousel .carousel-indicators li {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid transparent;
  opacity: 0.7;
}

.main-banner .carousel .carousel-indicators li.active {
  opacity: 1;
}
</style>

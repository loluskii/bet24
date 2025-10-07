<template lang="">
  <div class="head-top d-flex align-items-center">
    <div class="categories-list">
      <template v-for="(top, index) in topGameCategories" :key="index">
        <div
          class="category"
          :class="activeTopCategory == top.id ? 'active' : ''"
          @click="
            $router.push({
              name: 'games-by-category',
              params: { category: slugify(top.name) },
              query: { category_id: top.id }
            })
          "
          v-if="top.slug !== 'all'"
        >
          <img :src="getImageSrc(top.slug)" class="img-fluid" alt="" srcset="" />
          <span>{{ top.name }}</span>
        </div>
      </template>
    </div>
    <div class="game-search">
      <span class="x-icon-search"></span>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { getTopGameCategories, slugify } from '@/helpers'
import { useAuthStore, useUsersStore } from '@/stores'
import { useRoute } from 'vue-router'

const route = useRoute()
const topGameCategories = ref([])
const gamesList = ref([])
const scrollComponent = ref(null)
const authStore = useAuthStore()
const userStore = useUsersStore()
const isLoading = ref(true)
const myElement = ref(null)
const currentView = ref('grouped_category')
const providers = ref([])

const activeTopCategory = computed(() => {
  return route.query?.category_id
})

const getImageSrc = (cat) => {
  const imageUrl = new URL(`../../assets/images/casino/${cat}.png`, import.meta.url)
  return imageUrl
}

async function getCategories() {
  try {
    const response = await getTopGameCategories()
    isLoading.value = false
    topGameCategories.value = response.data
  } catch (error) {
    console.error('Error fetching categories or games:', error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await getCategories()
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

.x-icon-search:before {
  color: #ffffff;
  /* font-size: 1.5rem; */
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
  padding: 15px 0;
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

.categories-list {
  display: flex;
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow: auto; /* Enable horizontal scrolling if items overflow */
  gap: 10px; /* Space between items */
}

.categories-list::-webkit-scrollbar {
  display: none;
}

.categories-list .category {
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

.categories-list .category img {
  height: 25px;
  margin-bottom: 5px;
  padding-right: 10px;
}

.categories-list .category.active {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  background-color: #333;
  color: white;
  border-radius: 10px;
  padding: 5px 15px;
}
</style>

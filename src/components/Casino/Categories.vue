<template>
  <div class="container px-0">
    <div class="title-bg">
      <h3 class="h3 text-white fw-bold mb-0">{{ titleText }}</h3>
    </div>
    <div class="row mt-3 mb-5 pb-2">
      <div class="col-12 mb-3" v-for="category in props.categories" :key="category.name">
        <div
          class="provider-card"
          @click="
            $router.push({
              name: 'games-by-category',
              params: { category: slugify(category.name) },
              query: { category_id: category.id }
            })
          "
        >
          <div class="card rounded-0 border-0">
            <div class="card-body p-2">
              <img :src="getImageSrc(category.slug)" class="mr-3" alt="" srcset="" height="25" />
              <span class="provider-name">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { slugify } from '@/helpers'

const props = defineProps(['categories'])

const titleText = ref('Categories')

const getImageSrc = (prov) => {
  let name = prov.split('-')
  let imageName = name[0]
  if (name[1] !== 'games') {
    imageName = prov
  }
  const imageUrl = new URL(`../../assets/images/casino/${imageName}.png`, import.meta.url)
  return imageUrl
}
</script>

<style scoped>
@import url('@/assets/css/casino.css');

.title-bg {
  font-size: 28px;
  line-height: 1.4;
  font-weight: 500;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  font-family: var(--stb-font-helper);
  color: rgb(var(--stb-white-1000));
  padding: 22px 0;
  min-height: 80px;
  z-index: 1;
  white-space: nowrap;
}

.title-bg:after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #9ca0ab;
  background-image: url(/ornament-title.svg);
  background-repeat: repeat-x;
  background-position: center;
  background-size: 40px 70px;
}

.no-data {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  font-size: 1rem;
  padding: 2.33333333rem;
  text-align: center;
  background-color: transparent;
}
.provider-card {
  border: 1px solid #333;
}
.provider-card .card {
  background-color: #121212;
  margin: 8px;
  border: 1px solid #333;
}

.provider-card .provider-name {
  color: whitesmoke;
  font-size: 14px;
}
</style>

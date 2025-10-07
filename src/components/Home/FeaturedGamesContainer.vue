<template>
  <div class="featuredGame" style="position: relative">
    <div class="featuredGameCategoryBox">
      <div class="m-snap-nav-wrap featuredGameCategoryNav" style="overflow: hidden">
        <ul class="m-snap-nav flex">
          <li
            v-for="(category, index) in featuredCasino"
            :key="index"
            class="featuredGameCategoryNavItem m-snap-nav-item"
            :class="activeCasinoCategory == category.id ? 'active' : ''"
            @click="setActiveCategory(category)"
          >
            <div
              class="featuredMatchCategory"
              :class="activeCasinoCategory == category.id ? 'active' : ''"
            >
              <div class="wrapper">
                <div class="img">
                  <img :src="getImageSrc(category.slug)" />
                </div>
                <div class="name">{{ category.name }}</div>
              </div>
            </div>
          </li>
        </ul>
        <i class="controls left-controls"></i>
        <i class="controls right-controls"></i>
      </div>
    </div>
    <template v-if="!casinoIsLoading && featuredCasinogames.length">
      <div class="cardsContainer">
        <template v-for="(game, index) in featuredCasinogames" :key="index">
          <div
            v-if="game.status && game.gameId !== null"
            class="featuredGameCard"
            @click="redirectToGamePlay(game)"
          >
            <div class="top">
              <div class="card-footer">
                <div class="display-name">
                  <div class="featured-game-name">
                    {{ game.title }}
                  </div>
                </div>
              </div>
              <img :src="getImagePath(game)" loading="eager" class="label" />
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="!featuredCasinogames.length">
      <div class="no-data">
        <div style="white-space: pre-line">
          Sorry, there are no games currently<br />available in this category. Please try later.<br />Thank
          you.
        </div>
      </div>
    </template>
    <LoadingSpinner v-else></LoadingSpinner>
  </div>
</template>

<script setup>
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const emit = defineEmits(['set-active-category'])
import { slugify } from '@/helpers'
import { useUtilsStore, useAuthStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const utilsStore = useUtilsStore()
const authStore = useAuthStore()
const props = defineProps({
  featuredCasinogames: Array,
  featuredCasino: Array,
  activeCasinoCategory: Number,
  casinoIsLoading: Boolean
})

const setActiveCategory = (category) => {
  return emit('set-active-category', category)
}

const getImageSrc = (prov) => {
  try {
    let name = prov.split('-')
    let imageName = name[1] !== 'games' ? prov : name[0]
    return new URL(`../../assets/images/casino/${imageName}.png`, import.meta.url)
  } catch (error) {
    console.error('Error loading category image:', error)
    return new URL(`../../assets/images/casino/virtuals.png`, import.meta.url)
  }
}

const getImagePath = (game) => {
  try {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${encodeURIComponent(game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())}.png?alt=media`
  } catch (error) {
    console.error('Error generating image path:', error)
    return `https://placehold.co/150x175?text=${encodeURIComponent(game.title)}`
  }
}

async function redirectToGamePlay(game) {
  utilsStore.previousRoute = route.fullPath
  return router.push({
    name: 'game-play',
    params: { game_name: slugify(game.title), game_id: game.id }
  })
}
</script>

<style scoped>
.no-data {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  font-size: 1rem;
  padding: 2.33333333rem;
  text-align: center;
  background-color: transparent;
}
.featuredGame .m-loading-wrap {
  min-height: 11rem;
  position: relative;
}
.featuredGame {
  background-color: #ffffff;
  background-color: var(--c-featured-match-bg);
  overflow: hidden;
}
.featuredGame .featuredGameCategoryBox {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  margin-top: 0.66666667rem;
  overflow-x: auto;
}
.featuredGame .featuredGameCategoryBox .featuredGameCategoryNav {
  width: 100%;
}
.featuredGame .featuredGameCategoryBox .featuredGameCategoryNav .featuredGameCategoryNavItem {
  padding: 0 0 0.4rem 0;
}
.featuredGame .cardsContainer {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  overflow: auto;
  padding: 0 0.5rem 1.5rem 0.5rem;
}
.featuredGame ::-webkit-scrollbar {
  display: none;
}

/* Game Card */

.featuredGameCard {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-shadow:
    0px 2px 4px 2px rgba(0, 0, 0, 0.1),
    2px 2px 4px 0px rgba(0, 0, 0, 0.1);
  box-shadow:
    0px 2px 4px 2px rgba(0, 0, 0, 0.1),
    2px 2px 4px 0px rgba(0, 0, 0, 0.1);
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  height: 10.41666667rem !important;
  margin: 0.5rem 0.33333333rem 0 0.33333333rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 10.83333333rem !important;
}

.featuredGameCard .top {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #d6d6d6;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 100%;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 0.33333333rem;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.featuredGameCard .top .label {
  height: 100%;
  width: 100%;
}
.featuredGameCard .top .card-footer {
  background: rgba(0, 0, 0, 0.6);
  bottom: 0;
  position: absolute;
  text-align: center;
  width: 100%;
}
.featuredGameCard .top .card-footer .notifications-container {
  background-color: rgba(29, 89, 35, 0.85);
  bottom: 1.91666667rem;
  height: 20px;
  left: 0;
  overflow: hidden;
  position: absolute;
  width: 100%;
}
.featuredGameCard .top .card-footer .notifications-container .notification {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0.75rem;
  height: 20px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0 0.41666667rem;
  position: relative;
}
.featuredGameCard .top .card-footer .display-name {
  height: 1.91666667rem;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 90%;
}
.featuredGameCard .top .card-footer .display-name .featured-game-name {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0.91666667rem;
  font-weight: bold;
  height: 100%;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  padding: 0 4px;
}
.featuredGameCard .top .card-footer .currency-amount {
  color: #ffc752;
  font-weight: bold;
  margin-left: 0.25rem;
}
.featuredGameCard .top .card-footer .nick-name {
  color: #ffffff;
  display: inline-block;
  max-width: 4.16666667rem;
  overflow: hidden;
  white-space: nowrap;
}
.featuredGameCard .top .card-footer .won {
  color: #ffffff;
  margin-left: 0.25rem;
}
.featuredGameCard .top .placeholder-image {
  height: 40%;
  width: 32%;
}
.featuredGameCard .top .broken {
  height: 40%;
  width: 32%;
}

/*  */
.featuredMatchCategory {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid;
  border-color: #dcdee5;
  border-color: var(--c-featured-match-category-border);
  border-radius: 1.066rem;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 0.66666667rem;
  max-width: 3.33333333rem;
  overflow: hidden;
  padding: 0.33333333rem 0.83333333rem;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  width: auto;
}
.featuredMatchCategory::after {
  content: '';
  display: none;
  bottom: 6px;
  height: 0;
  left: 50%;
  position: absolute;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  width: 0;
  border-bottom: 8px solid transparent;
  border-right: 10px solid var(--c-featured-match-arrow-color);
  border-top: 8px solid transparent;
}
.featuredMatchCategory::before {
  content: '';
  display: none;
  bottom: 0px;
  height: 0;
  left: 50%;
  position: absolute;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  width: 0;
  border-bottom: 4px solid transparent;
  border-right: 6px solid var(--c-featured-match-category-border-active);
  border-top: 4px solid transparent;
}
.featuredMatchCategory .wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 1.66666667rem;
}
.featuredMatchCategory .wrapper .img {
  width: 1.66666667rem;
  height: 1.66666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  min-width: 0;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  opacity: 0.5;
}
.featuredMatchCategory .wrapper .img.is-dark {
  opacity: 1;
  padding: 0.08333333rem;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
}
.featuredMatchCategory .wrapper img {
  width: 100%;
  -o-object-fit: contain;
  object-fit: contain;
}
.featuredMatchCategory .wrapper .icon {
  color: unset;
  color: var(--c-featured-match-category-icon);
  line-height: 1.2;
  margin-right: 0.2rem;
  opacity: 0.5;
  -webkit-transform: scale(1.2);
  -ms-transform: scale(1.2);
  transform: scale(1.2);
  -webkit-transform-origin: 0;
  -ms-transform-origin: 0;
  transform-origin: 0;
}
@media only screen and (max-width: 320px) {
  .featuredMatchCategory .wrapper .icon {
    margin-right: 0;
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0;
    -ms-transform-origin: 0;
    transform-origin: 0;
  }
}
.featuredMatchCategory .wrapper .name {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  display: none;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 0.33333333rem;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}
.featuredMatchCategory.active {
  border-color: var(--c-featured-match-category-border-active);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
  position: relative;
}
.featuredMatchCategory.active::after {
  display: block;
}
.featuredMatchCategory.active::before {
  display: block;
}
.featuredMatchCategory.active .wrapper {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}
.featuredMatchCategory.active .wrapper .img,
.featuredMatchCategory.active .wrapper .icon {
  opacity: 1;
}
.featuredMatchCategory.active .wrapper .name {
  display: inline-block;
  opacity: 1;
  pointer-events: auto;
}
</style>

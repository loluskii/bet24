<template lang="">
  <div class="m-snap-nav-wrap m-sports-choose">
    <ul class="m-snap-nav flex" style="width: 100%">
      <li class="m-sports-choose-item m-snap-nav-item">
        <a @click.prevent="$router.push({ name: 'sports', query: { sport: 'Soccer' } })">
          <div class="sport-icon">
            <img src="@/assets/images/sports/1.png" loading="eager" width="20" height="20" />
          </div>
          <span class="sport-text" data-cms-key="sports" data-cms-page="wap_home">Sports </span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a @click.prevent="$router.push({ name: 'live' })">
          <div class="sport-icon">
            <img src="@/assets/images/live.png" loading="eager" width="20" height="20" />
          </div>
          <span class="sport-text" data-cms-key="sports" data-cms-page="wap_home">Live </span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a @click.prevent="$router.push({ name: 'casino-games' })"
          ><div class="sport-icon">
            <img src="@/assets/images/games.png" loading="eager" width="20" height="20" />
          </div>
          <span class="sport-text" data-cms-key="games" data-cms-page="wap_home">Casino</span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a href="#" @click.prevent="openVirtual"
          ><div class="sport-icon">
            <img src="@/assets/images/virtuals.png" loading="eager" width="20" height="20" />
          </div>
          <span class="sport-text" data-cms-key="live" data-cms-page="wap_home">Virtuals</span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a href="#" @click.prevent="playAviator"
          ><div class="sport-icon">
            <img src="@/assets/images/aviator.png" loading="eager" width="24" height="24" />
          </div>
          <span class="sport-text" data-cms-key="live" data-cms-page="wap_home">Aviator</span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a href="#" @click.prevent="goToLiveScore"
          ><div class="sport-icon">
            <img
              src="@/assets/images/score.png"
              style="padding-bottom: 5px; height: 25px"
              loading="eager"
            />
          </div>
          <span class="sport-text" data-cms-key="live" data-cms-page="wap_home">Livescore</span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a href="#" @click.prevent="goToStatistics"
          ><div class="sport-icon">
            <img src="@/assets/images/presentation.png" style="height: 25px" loading="eager" />
          </div>
          <span class="sport-text" data-cms-key="live" data-cms-page="wap_home">Statistics</span>
        </a>
      </li>
      <li class="m-sports-choose-item m-snap-nav-item">
        <a href="/Promotions"
          ><div class="sport-icon">
            <img src="@/assets/images/promotions.png" style="height: 25px" loading="eager" />
          </div>
          <span class="sport-text" data-cms-key="live" data-cms-page="wap_home">Promotions</span>
        </a>
      </li>
      <li
        v-for="(sport, index) in sportsList?.slice(1)"
        :key="index"
        class="m-sports-choose-item m-snap-nav-item"
      >
        <a href="" @click.prevent="setActiveSport(sport.sportID)"
          ><div class="sport-icon">
            <img :src="getImageSrc(sport.sportID)" loading="lazy" width="22" height="22" />
          </div>
          <span class="sport-text"> {{ sport.sportName }} </span>
        </a>
      </li>
    </ul>
    <i class="controls left-controls"></i>
    <i class="controls right-controls"></i>
  </div>
</template>
<script setup>
import { useUtilsStore, useUsersStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { slugify } from '@/helpers'
import MD5 from 'crypto-js/md5'
import emitter from '@/plugins/emitter'

// const { sports, sport_id } = useUtilsStore()
const utilsStore = useUtilsStore()
const router = useRouter()
const usersStore = useUsersStore()
// const token = ref('111111')
// const group = ref(import.meta.env.VITE_APP_KEY)
// const mode = ref(0)

const getImageSrc = (sportId) => {
  const imageUrl = new URL(`../../assets/images/sports/${sportId}.png`, import.meta.url)
  return imageUrl
}

const token = computed(() => {
  return usersStore.currentUser ? usersStore.details.authCode : '111111'
})

const mode = computed(() => {
  return usersStore.currentUser ? 1 : 0
})

const group = computed(() => {
  return usersStore.currentUser ? usersStore.details.group : import.meta.env.VITE_APP_KEY
})

const sportsList = computed(() => {
  return utilsStore.sportsMenu
})

const activeSportID = computed(() => {
  return utilsStore.sportID
})

const getActiveSport = computed(() => {
  return sportsList.value.find((x) => x.sportID == activeSportID.value)
})

function setActiveSport(id) {
  utilsStore.sportID = id
  router.push({
    name: 'sports',
    query: { sport: slugify(getActiveSport.value.sportName) }
  })
}

const hashStr = computed(() => {
  return MD5(
    `${token.value}10100${import.meta.env.VITE_SITE_URL}${mode.value}${
      group.value
    }mobile${import.meta.env.VITE_XPRESS_PRIVATE_KEY}`
  ).toString()
})

const generatedURL = computed(() => {
  return `${import.meta.env.VITE_XPRESS_LAUNCH_URL}?token=${
    token.value
  }&game=10100&backurl=${import.meta.env.VITE_SITE_URL}&mode=${
    mode.value
  }&group=${group.value}&clientPlatform=mobile&h=${hashStr.value}`
})

const goToLiveScore = () => {
  return window.open(`https://ls.sir.sportradar.com/bematrics`, 'stats', 'width=1078,height=768')
}

const goToStatistics = () => {
  return window.open(`https://s5.sir.sportradar.com/bematrics`, 'stats', 'width=1078,height=768')
}

function openVirtual() {
  window.location.href = `${import.meta.env.VITE_XPRESS_LAUNCH_URL}?token=${
    token.value
  }&game=10100&backurl=${import.meta.env.VITE_SITE_URL}&mode=${
    mode.value
  }&group=${group.value}&clientPlatform=mobile&h=${hashStr.value}`
}

async function playAviator() {
  return router.push({
    name: 'game-play',
    params: { game_name: slugify('Aviator'), game_id: 1583 }
  })
}

function playSmatVirtual() {
  if (usersStore.currentUser) {
    return router.push({
      name: 'game-play',
      params: { game_name: slugify('SmatVirtual'), game_id: 'smat_virtual' }
    })
  } else {
    return router.push('/sign-in')
  }
}

onMounted(() => {
  // if (usersStore.details) {
  //   token.value = usersStore.details.authCode
  //   mode.value = 1
  //   group.value = usersStore.details.group
  // }
})
</script>
<style scoped>
.x-main-mid .m-bscast > div {
  height: auto;
}

.home .m-sports-choose-item a,
.home .m-sports-choose-item a:hover,
.home .m-sports-choose-item a:active,
.home .m-sports-choose-item a:visited {
  background: none;
}
.home .m-popular-item a,
.home .m-popular-item a:hover,
.home .m-popular-item a:active,
.home .m-popular-item a:visited {
  background: none;
}
.home .m-sports-choose-item a,
.home .m-popular-item a,
.home .m-sports-choose-item a:hover,
.home .m-popular-item a:hover,
.home .m-sports-choose-item a:active,
.home .m-popular-item a:active,
.home .m-sports-choose-item a:visited,
.home .m-popular-item a:visited {
  color: #353a45;
  color: var(--c-sports-banner-text);
  display: block;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-decoration: none;
}
.home .m-sports-choose {
  min-height: 5rem;
  background-color: var(--background-type1-primary);
}
.home .m-sports-choose .m-sports-choose-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--c-sports-banner-text);
  display: block;
  -webkit-box-flex: 0 !important;
  -webkit-flex: 0 0 auto !important;
  -ms-flex: 0 0 auto !important;
  flex: 0 0 auto !important;
  padding: 0;
  position: relative;
  text-align: center;
  width: 4.91666667rem;
}
.home .m-sports-choose .m-sports-choose-item > a {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  align-items: center;
  min-height: 5rem;
  padding: 0.83333333rem 0 0.33333333rem;
  width: 100%;
}
.home .m-sports-choose .m-sports-choose-item .m-live-icon::before {
  content: '\e62b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.home .m-sports-choose .m-sports-choose-item .sport-icon {
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  margin: 0 auto;
  text-align: center;
  width: 1.66666667rem;
  margin-bottom: 5px;
}
.home .m-sports-choose .m-sports-choose-item .sport-icon img {
  vertical-align: top;
  filter: invert(1)
}
.home .m-sports-choose .m-sports-choose-item .sport-icon:before {
  color: #353a45;
  display: inline-block;
  font-size: 1.66666667rem;
  font-weight: 500;
  height: 1.66666667rem;
  width: 1.66666667rem;
}
.home .m-sports-choose .m-sports-choose-item .sport-text {
  display: block;
  font-size: 0.83333333rem;
  line-height: 1;
  margin: 0 auto;
  white-space: normal;
}
.home .m-popular {
  min-height: 4rem;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#f2f3f5));
  background-image: -webkit-linear-gradient(top, #ffffff, #f2f3f5);
  background-image: linear-gradient(to bottom, #ffffff, #f2f3f5);
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(var(--c-popular-bg-linear-color-one)),
    to(var(--c-popular-bg-linear-color-two))
  );
  background-image: -webkit-linear-gradient(
    top,
    var(--c-popular-bg-linear-color-one),
    var(--c-popular-bg-linear-color-two)
  );
  background-image: linear-gradient(
    to bottom,
    var(--c-popular-bg-linear-color-one),
    var(--c-popular-bg-linear-color-two)
  );
}
.home .m-popular .m-snap-nav {
  padding-bottom: 0.33333333rem;
}
.home .m-second-banner {
  display: block;
}
.home .m-second-banner img {
  display: block;
  max-height: 64px;
  width: 100%;
}

.home .m-sports .m-title,
.home .m-live .m-title {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.75rem;
  margin: 0 0.83333333rem;
}
.home .m-sports .m-today-tab {
  border-bottom: 1px solid #f2f3f5;
  border-color: #f2f3f5;
  border-color: var(--c-prematch-tab-border);
}
.home .m-sports .m-today-tab .m-tabs-nav {
  border-bottom: none;
  min-width: 100%;
}
.home .m-sports .m-today-tab .m-tabs-tab {
  color: #353a45;
  color: var(--c-sports-prematch-market-title-text);
  -webkit-box-flex: initial;
  -webkit-flex: initial;
  -ms-flex: initial;
  flex: initial;
  font-size: 1.066rem;
  margin: 0;
  padding: 0.33333333rem 0.91666667rem;
  width: auto;
}
.home .m-sports .m-today-tab .m-tabs-ink-bar {
  height: 3px;
}
.home .m-sports .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: relative;
}
.home .m-sports .nav-fixed .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: fixed;
  top: 7.75rem;
  -webkit-transition: top 0.3s ease !important;
  transition: top 0.3s ease !important;
  width: 100%;
  z-index: 100;
}
.home .m-sports .nav-fixed .market-wrapper:after {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  content: '';
  height: 4rem;
  left: 0;
  position: absolute;
  top: -4rem;
  width: 100%;
}
.home .m-sports .nav-fixed.nav-up .market-wrapper {
  top: 11.41666667rem;
}
.home .m-sports .nav-up .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: fixed;
  top: 11.41666667rem;
  z-index: 200;
}
.home .m-sport-bet-error {
  padding: 0.83333333rem;
}
.home .view-all {
  margin: 0 2rem 0 0.83333333rem;
  padding: 1.41666667rem 0;
  text-align: right;
}
.home .view-all a {
  font-size: 1rem;
  line-height: 1.066rem;
  position: relative;
}
.home .view-all a::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.home .view-all a::before {
  display: inline-block;
  font-size: 1rem;
  position: absolute;
  right: -1.33333333rem;
  top: 0;
}
.home .featured-match-placeholder {
  min-height: 14.58333333rem;
  position: relative;
  width: 100%;
}
</style>

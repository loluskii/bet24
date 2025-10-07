<template>
  <div class="m-nav-secondary m-topnav withHome" style="position: fixed; top: 0rem; z-index: 1001">
    <div class="m-nav-left">
      <span data-op="nav-sec-back" @click="$router.go(-1)" class="m-icon m-icon--back"></span>
      <div class="trans-select">
        <div tabindex="0" class="sport-select af-select">
          <div data-op="label-odds-option" class="af-select-title">
            <span class="af-select-input">Football</span>
            <span class="af-select-icon-item"><em class="icon">^</em></span>
          </div>
          <div
            v-show="sportsListDropdown"
            class="af-select-list animate-core"
            :class="sportsListDropdown ? 'af-select-list-open' : ''"
            style="width: 100%; left: 0px; top: 26px"
          >
            <span
              v-for="(sport, index) in sportsList"
              :key="index"
              @click="setActiveSport(sport.sportID)"
              class="af-select-item af-select-item"
              :class="activeSport == sport.sportID ? 'active' : ''"
              >{{ sport.sportName }}</span
            >
          </div>
        </div>
        <span class="title" @click="toggleSportsDropdown">
          {{ SportsName.sportName }}
          <span class="arrow-icon"></span
        ></span>
      </div>
    </div>
    <div class="info-container">
      <div class="m-nav-right">
        <router-link :to="{ name: 'home' }">
          <div class="home-link">
            <div class="home-icon"></div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, defineProps, computed } from 'vue'
import { useUtilsStore } from '@/stores'
import { useRouter } from 'vue-router'

const sportsListDropdown = ref(false)
const utilsStore = useUtilsStore()
// const emit = defineEmits(['sport-change'])
const router = useRouter()

const sportsList = computed(() => {
  return utilsStore.sportsMenu
})

const activeSport = computed(() => {
  return utilsStore.sportID
})

const getActiveSport = computed(() => {
  const active = utilsStore.sportID
  return utilsStore.sportsMenu.find((x) => x.sportID == active)
})

const toggleSportsDropdown = () => {
  sportsListDropdown.value = !sportsListDropdown.value
}

function setActiveSport(id) {
  utilsStore.sportID = id
  toggleSportsDropdown()
  // emit('sport-change')
  router.push({
    name: 'fixtures-by-sports',
    params: { sport: getActiveSport.value.sportName }
  })
}

defineProps({
  SportsName: Object,
  hasDropdown: Boolean
})

defineComponent({
  name: 'header-game'
})
</script>

<style scoped>

.m-nav-secondary {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: rgb(222, 226 ,230);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #121212;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 1.33333333rem;
  height: 3.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 1.33333333rem 0 1.66666667rem;
  width: 100%;
}
.m-nav-secondary .m-nav-left {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-left .m-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #121212;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  margin-right: 1.58333333rem;
}
.m-nav-secondary .m-nav-left .m-icon:before {
  font-size: 1.33333333rem !important;
}
.m-nav-secondary .m-nav-left .m-icon--back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close:before {
  font-size: 1.5rem !important;
}
.m-nav-secondary.withHome {
  padding: 0 0 0 1.66666667rem;
}
.m-nav-secondary a:visited,
.m-nav-secondary a:active,
.m-nav-secondary a:link,
.m-nav-secondary a:hover {
  color: #121212;
  color: var(--text-type2-primary);
  text-decoration: none;
}
.m-nav-secondary .title {
  font-size: 1.66666667rem;
  line-height: 2rem;
}
.m-nav-secondary .title.small-font-height {
  font-size: 1.066rem;
  line-height: 1.5rem;
}
.m-nav-secondary .m-login-balance {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span {
  padding: 0 0.66666667rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span:last-of-type:before {
  border-left: 1px solid #ffffff;
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}
.m-nav-secondary .info-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-right .m-icon-search {
  color: #121212;
  color: var(--brand-tertiary);
  height: 2rem;
  line-height: 2rem;
  padding: 0.41666667rem 0.83333333rem;
}
.m-nav-secondary .m-nav-right .m-icon-search::before {
  content: '\e613';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-right .m-icon-search:before {
  font-size: 1.5rem;
}
.m-nav-secondary .home-link {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0 1.5rem 0 1.33333333rem;
}
.m-nav-secondary .home-link .home-icon::before {
  content: '\e6cb';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .home-link .home-icon:before {
  font-size: 1.5rem;
}
</style>

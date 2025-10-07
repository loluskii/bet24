<template>
  <div class="m-sports-menu">
    <HeaderOther :headerTitle="'Sports'" />
    <div class="sports-menu-fixed">
      <div class="m-snap-nav-wrap m-sports-choose" style="overflow: auto">
        <ul class="m-snap-nav flex">
          <li
            v-for="(sport, index) in sportsMenu"
            :class="{ active: sport.sportID === activeSport.sportID }"
            @click="setActiveSport(sport)"
            :key="index"
            :id="'sports_list_' + sport.sportID"
            class="m-sports-choose-item m-snap-nav-item"
          >
            <div class="sprot-icon">
              <img
                :src="getImageSrc(sport.sportID)"
                style="height: 20px; margin-right: 0.4rem"
                alt=""
              />
            </div>
            <div class="sport-text">
              {{ sport.sportName }}
            </div>
          </li>
        </ul>
        <i class="controls left-controls"></i>
        <i class="controls right-controls"></i>
      </div>
    </div>

    <template v-if="!isLoading">
      <div class="m-top-menu">
        <a
          href="#"
          @click.prevent="navigateTo('fixtures-by-sports', { period: 'today' })"
          class="m-menu-item space-right"
        >
          Today Games
        </a>
        <a href="#" class="m-menu-item"> All {{ activeSport.sportName }} </a>
      </div>

      <div class="m-countries-panel m-sports-countries" style="position: relative">
        <div class="m-countries-block">
          <div class="m-countries-block-title" data-cms-key="a_z">A-Z</div>
          <div class="m-country-list">
            <template v-if="countriesData.length > 0">
              <div
                v-for="(country, index) in countriesData"
                :key="country.categoryID"
                class="m-league"
              >
                <div
                  v-if="country.categoryName"
                  class="m-league-title hide"
                  @click="showChild(index, country)"
                >
                  <span class="icon-triangle"></span>
                  <span class="text">{{ country.categoryName }}</span>
                  <span class="m-event-size">{{ country.total }}</span>
                </div>
                <div :id="'child_' + index" class="m-league-conent d-none">
                  <ul class="m-country-row" v-if="country.isOpen">
                    <li
                      class="not-top-league"
                      v-for="tournament in country.tournamentsData"
                      :key="tournament.tournamentID"
                    >
                      <a
                        href="#"
                        @click.prevent="
                          navigateTo('fixtures-by-tournaments', {
                            sport: activeSport.sportName,
                            categories: `sr:category:${country.categoryID}`,
                            tournaments: `sr:tournament:${tournament.tournamentID}`
                          })
                        "
                      >
                        <div class="m-item-left">
                          {{ tournament.tournamentName }}
                        </div>
                        <div class="m-item-right">{{ tournament.total }}</div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
            <div v-else class="empty">
              <p style="white-space: pre-line">
                Sorry, there are no games currently<br />available in this category. Please try
                later.<br />Thank you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <LoadingSpinner v-else />
  </div>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUtilsStore } from '../stores'
import { FEED_TOGGLE, getCategoriesBySport, getTournamentsByCategories, slugify, unslugify } from '../helpers'

const utilsStore = useUtilsStore()
const route = useRoute()
const router = useRouter()

const activeSport = ref({
  sportName: 'Soccer',
  sportID: 1
})

const countriesData = ref([])
const sportsMenu = computed(() => utilsStore.sportsMenu)
const isLoading = ref(false)
const isTournamentsLoading = ref(false)

// const getActiveSport = computed(() => {
//   return sportsMenu.value.find((sport) => sport.sportID === activeSport.value.sportID)
// })

const getImageSrc = (sportID) => {
  return new URL(`../assets/images/sports/${sportID}.png`, import.meta.url).href
}

const showChild = async (index, country) => {
  const childElement = document.getElementById(`child_${index}`)
  if (!country.isOpen) {
    if (isTournamentsLoading.value) return
    isTournamentsLoading.value = true
    const res = await getTournamentsByCategories(country.categoryID)
    isTournamentsLoading.value = false
    country.tournamentsData = res.sports
    country.isOpen = true
    childElement?.classList.remove('d-none')
  } else {
    country.isOpen = false
    childElement?.classList.add('d-none')
  }
}

const getCountriesList = async () => {
  if(!FEED_TOGGLE)return
  isLoading.value = true
  const sports = await getCategoriesBySport(activeSport.value.sportID)
  countriesData.value = sports.sports || []
  isLoading.value = false
}

const setActiveSport = async (sport) => {
  activeSport.value = sport
  router.replace({ query: { sport: slugify(sport.sportName) } })
  await getCountriesList()
  document.getElementById(`sports_list_${sport.sportID}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

const navigateTo = (routeName, query = {}) => {
  router.push({
    name: routeName,
    params: {
      sport: slugify(activeSport.value.sportName),
      ...query
    }
  })
}

const getSportCategories = async () => {
  if(!FEED_TOGGLE)return
  isLoading.value = true
  try {
    const sports = await getCategoriesBySport(activeSport.value.sportID)
    countriesData.value = sports.sports || []
    if (route.query.sport) {
      setActiveSport(
        sportsMenu.value.find((sport) => sport.sportName === unslugify(route.query.sport))
      )
    }
  } catch (error) {
    console.error('Error fetching sport categories:', error)
    countriesData.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(getSportCategories)
</script>

<style>
.m-sports-menu {
  position: relative;
  height: 100%;
}
.m-sports-menu .m-sports-choose {
  border-bottom: 1px solid #eaecef;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 0 !important;
  -webkit-flex: none !important;
  -ms-flex: none !important;
  flex: none !important;
  min-height: 5rem;
  padding: 1.066rem 0.33333333rem 0.75rem;
  position: relative;
  width: 5rem;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item:first-child {
  margin-left: 0.83333333rem;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item:last-child {
  margin-right: 0.83333333rem;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item.active {
  border-bottom: 0.25rem solid var(--brand-highlight-text);
  border-bottom-color: var(--brand-highlight-text);
  border-bottom-color: var(--c-sport-menu-tab-active);
}
.m-sports-menu .m-sports-choose .m-sports-choose-item .sport-text {
  color: #000000;
  color: var(--text-default);
  font-size: 1rem;
  line-height: 1.066rem;
  margin-top: 0.25rem;
  white-space: normal;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item .sprot-icon {
  display: block;
  text-align: center;
}
.m-sports-menu .m-sports-choose .m-sports-choose-item .sprot-icon:before {
  color: var(--brand-secondary);
  /* color: var(--c-sport-menu-sport-icon); */
  font-size: 1.5rem;
  line-height: 1;
  vertical-align: top;
}
.m-sports-menu .m-top-menu {
  margin: 1.66666667rem 0.5rem 0 0.5rem;
}
.m-sports-menu .m-top-menu:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
.m-sports-countries {
  margin: 1.66666667rem 0;
}
.m-sports-countries .m-countries-block .m-countries-block-title {
  line-height: 1.75rem;
  margin-bottom: 0.75rem;
}
.m-sports-countries .m-country-list {
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 0.83333333rem;
  overflow: hidden;
  padding: 0;
}
.m-sports-countries .m-country-list .m-league {
  margin: 0.5px 0;
}
.m-sports-countries .m-country-list .m-league .m-league-title {
  border-radius: 0;
}
.m-sports-countries .m-country-list .m-league .m-league-title .m-event-size {
  display: none;
}
.m-daily-menu {
  margin-top: 1.66666667rem;
}
.m-daily-menu .m-menu-row {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.33333333rem 0.83333333rem 0;
}
.m-daily-menu .m-menu-row .m-menu-title {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.m-menu-item {
  font-size: 1.066rem;
  font-weight: 500;
  color: #096b27;
  color: var(--c-sport-menu-item-text);
  display: block;
  float: left;
  width: calc(50% - 0.5rem);
  height: 3.16666667rem;
  line-height: 3.16666667rem;
  text-align: left;
  border-radius: 2px;
  background-color: #ffffff;
  margin-bottom: 0.33333333rem;
  padding: 0 1.08333333rem;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid #eeeeee;
}

.space-right {
  margin-right: 0.5rem;
}

.empty {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  padding-top: 4.16666667rem;
  text-align: center;
}
</style>

<template>
  <div class="choose-bar-pad">
    <div class="m-choose-bar-wrap" product="3">
      <div class="overly" v-if="filterIsOpen"></div>
      <div class="m-choose-bar" id="m-choose-bar">
        <div tabindex="0" class="m-choose-time" @click="toggleFilter('period')">
          <div
            class="m-title"
            :class="{
              used: route.name === 'today-fixtures' || route.query.period
            }"
          >
            {{
              activePeriodFilter
                ? activePeriodFilter.name
                : route.query.period === 'today'
                  ? 'Today'
                  : route.query.period
                    ? route.query.period
                    : 'Daily'
            }}
          </div>
          <div v-if="filterIsOpen && filterName === 'period'" class="m-list">
            <ul>
              <!-- <li
                :class="{
                  checked: route.name === 'today-fixtures' || activePeriodFilter?.key === 'today'
                }"
                @click="$router.push({ name: 'today-fixtures' })"
              >
                Today
              </li> -->
              <template v-for="(period, index) in periodFilters" :key="index">
                <li
                  @click="setPeriod(period.name, period.key)"
                  :class="{
                    checked:
                      (period.key === 'today' && route.name === 'today-fixtures') ||
                      period.key === route.query.period
                  }"
                >
                  {{ period.name }}
                </li>
              </template>
              <!-- <li class="">3 hours</li>
              <li class="">6 hours</li>
              <li class="">24 hours</li>
              <li class="">72 hours</li> -->
              <li
                @click="customDate"
                :class="{
                  checked: route.query.period === 'custom'
                }"
              >
                <span>Custom date</span>
              </li>
            </ul>
          </div>
        </div>
        <div tabindex="0" class="m-choose-league">
          <div class="m-title" :class="{ used: isLeagueActive }" @click="toggleFilter('league')">
            Leagues
          </div>
          <div
            v-show="filterIsOpen && filterName === 'league'"
            class="m-list"
            style="min-height: calc(80vh - 94px) !important"
          >
            <LoadingSpinner v-if="isCategoriesLoading" />
            <div v-else class="m-regions">
              <div class="m-regions-list">
                <div class="m-scroll-wrap">
                  <ul class="m-category" v-if="categoryList">
                    <template v-for="(league, index) in categoryList" :key="index">
                      <li
                        v-show="league.categoryName !== undefined"
                        class="tournament"
                        :class="{
                          checked: activeCategory && activeCategory.categoryID == league.categoryID
                        }"
                        @click="setActiveCategory(league)"
                      >
                        <span class="category-name">{{ league.categoryName }} </span
                        ><span class="select-tournamet-size">
                          <em v-if="getSelectedTournamentCountByCategory(league) > 0">{{
                            getSelectedTournamentCountByCategory(league)
                          }}</em> </span
                        ><span class="event-size">{{ league.total }}</span>
                      </li>
                    </template>
                  </ul>
                </div>
                <div class="m-scroll-wrap">
                  <ul class="m-tournament">
                    <LoadingSpinner v-if="isTournamentsLoading" />
                    <template v-else v-for="(t, index) in tournamentsList" :key="index">
                      <li class="tournament" @click="selectTournament(t)">
                        <div role="checkbox" tabindex="0" class="af-checkbox checkbox">
                          <label
                            ><input
                              type="checkbox"
                              name=""
                              :checked="tournamentIsSelected(t)"
                              style="accent-color: var(--brand-primary)"
                            />
                            <span
                              class="check-stroke-wrapper sportybet"
                              style="width: 16px; height: 16px"
                              ><svg viewBox="-1.5 -1.5 15 14">
                                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                              </svg>
                            </span>
                          </label>
                        </div>
                        <span class="tournament-name">{{ t.tournamentName }}</span
                        ><span class="event-size">{{ t.total }}</span>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
            <div class="m-regions-opt">
              <span class="m-regions-reset" @click="resetSelection">Reset</span>
              <span class="m-regions-apply" @click="viewFixturesByTournaments">View</span>
            </div>
            <!---->
          </div>
        </div>
        <!-- <div tabindex="0" class="m-choose-sort" @click="toggleFilter('sort')">
          <div class="m-title">
            <span>Sort</span>
          </div>
          <div class="m-list" v-show="filterIsOpen && filterName === 'sort'">
            <ul>
              <li class="checked">
                <span>Default</span>
              </li>
              <li class="">
                <span>Time</span>
              </li>
              <li class="">
                <span>League</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, computed, onUnmounted } from 'vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUtilsStore } from '@/stores'
import {
  getCategoriesBySport,
  getDateRange,
  getTournamentsByCategories,
  extractIdsFromURL,
  slugify
} from '@/helpers'
import { useRoute, useRouter } from 'vue-router'
import $ from 'jquery'
import emitter from '@/plugins/emitter.js'

const props = defineProps({
  activeSport: Object
})
const periodFilters = [
  { name: 'Today', key: 'today' },
  { name: 'Tomorrow', key: 'tomorrow' },
  { name: 'Today & Tomorrow', key: 'today_tomorrow' },
  { name: 'This Week', key: 'week' }
]

const utilsStore = useUtilsStore()
const filterIsOpen = ref(false)
const filterName = ref('')
const route = useRoute()
const router = useRouter()

const categoryList = ref([])
const tournamentsList = ref([])
const activeCategory = ref(null)

const isCategoriesLoading = ref(false)
const isTournamentsLoading = ref(false)

const selectedTournaments = ref([])

const activePeriodFilter = computed(() => {
  if (route.name === 'today-fixtures' || route.query.period === 'today') {
    return { name: 'Today', key: 'today' }
  }
  if (route.name === 'fixtures-by-sports' && route.query.startDate && route.query.endDate) {
    return { name: 'Custom Date', key: 'custom' }
  }
  return periodFilters.find((x) => x.key === route.query.period)
})

const isLeagueActive = computed(() => {
  return route.name === 'fixtures-by-tournaments'
})

const getSportbyName = (name) => {
  return utilsStore.sportsMenu.find((x) => x.sportName == name)
}

const getActiveSport = computed(() => {
  return getSportbyName(route.params.sport)
})

const setPeriod = (name, key) => {
  return route.name !== 'today-fixtures' || name !== 'today'
    ? router.push({
        name: 'fixtures-by-sports',
        query: { ...route.query, period: key }
      })
    : router.push({ name: 'today-fixtures' })
}

function toggleFilter(name) {
  if (filterIsOpen.value) {
    filterIsOpen.value = false
    filterName.value = name
    document.getElementById('m-choose-bar').classList.remove('m-choose-bar-show')
    $('body').removeClass('no-scroll')
  } else {
    filterIsOpen.value = true
    filterName.value = name
    document.getElementById('m-choose-bar').classList.add('m-choose-bar-show')
    $('body').addClass('no-scroll')
    if (
      (name === 'league' && categoryList.value.length === 0) ||
      (name === 'league' && activePeriodFilter.value?.key)
    ) {
      isCategoriesLoading.value = true
      let dates = getDateRange(activePeriodFilter.value?.key)
      getCategoriesBySport(getActiveSport.value.sportID, dates).then((res) => {
        isCategoriesLoading.value = false
        categoryList.value = res.sports
        if (route.name === 'fixtures-by-tournaments') {
          const cids = extractIdsFromURL(route.params.categories, 'category')
          const tids = extractIdsFromURL(route.params.tournaments, 'tournament')
          activeCategory.value = categoryList.value.find((x) => x.categoryID == cids[0].categoryID)
          if (!activeCategory.value) {
            activeCategory.value = categoryList.value[0]
          }
          selectedTournaments.value = tids
          // console.log(activeCategory.value)
          setActiveCategory(activeCategory.value)
        }
      })
    }
  }
}

function selectTournament(tournament) {
  if (selectedTournaments.value.length >= 10) {
    emitter.emit('showDialogueToaster', 'The selected tournaments cannot be greater than 10!')
    return
  }

  const index = selectedTournaments.value.findIndex(
    (x) => x.tournamentID === tournament.tournamentID
  )
  if (index !== -1) {
    selectedTournaments.value.splice(index, 1)
  } else {
    let t = {
      ...tournament,
      categoryID: activeCategory.value.categoryID,
      categoryName: activeCategory.value.categoryName
    }
    selectedTournaments.value.push(t)
  }
}

function getSelectedTournamentCountByCategory(category) {
  return selectedTournaments.value.filter((x) => x.categoryID === category.categoryID).length
}

function tournamentIsSelected(tournament) {
  return selectedTournaments.value.find((x) => x.tournamentID == tournament.tournamentID)
}

const setActiveCategory = async (category) => {
  isTournamentsLoading.value = true
  activeCategory.value = category
  let dates = getDateRange(activePeriodFilter.value?.key)
  const res = await getTournamentsByCategories(category.categoryID, dates)
  isTournamentsLoading.value = false
  tournamentsList.value = res.sports
}

function resetSelection() {
  toggleFilter()
  selectedTournaments.value = []
  return router.push({ name: 'today-fixtures' })
}

function viewFixturesByTournaments() {
  toggleFilter('league')
  let selected = selectedTournaments.value.filter((x) => x.categoryID !== undefined)
  const categoryIDs = [...new Set(selected.map((item) => item.categoryID))]
  const tournamentIDs = selected.map((item) => item.tournamentID)

  const categories = categoryIDs.map((id) => `sr:category:${id}`).join('_')
  const tournaments = tournamentIDs.map((id) => `sr:tournament:${id}`).join('_')

  let periodValue = route.name === 'today-fixtures' ? 'today' : route.query.period
  if (periodValue) {
    return router.push({
      name: 'fixtures-by-tournaments',
      params: {
        sport: props.activeSport.sportName,
        categories: categories,
        tournaments: tournaments
        // sort: 'sort:league'
      },
      query: { period: periodValue }
    })
  } else {
    // Combine the strings
    return router.push({
      name: 'fixtures-by-tournaments',
      params: {
        sport: props.activeSport.sportName,
        categories: categories,
        tournaments: tournaments
        // sort: 'sort:league'
      }
    })
  }
}

const customDate = () => {
  // toggleFilter('')
  emitter.emit('showCustomDatePicker')
}

const getCustomRangeData = (data) => {
  emitter.emit('showCustomDatePicker')
  return router.push({
    name: 'fixtures-by-sports',
    params: { sport: slugify(props.activeSport.sportName) },
    query: { period: 'custom', startDate: data.start, endDate: data.end }
  })
}

onMounted(() => {
  emitter.on('dateRangeSet', getCustomRangeData)
})

onUnmounted(() => {})
</script>

<style>
.m-choose-bar-wrap.fixed {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border-bottom: 1px solid #eaecef;
  border-color: #eaecef;
  border-color: var(--brand-border-type1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
}
.m-choose-bar-wrap.fixed.nav-down {
  top: 3.66666667rem;
}
.m-choose-bar-wrap.fixed.nav-down.has-live {
  top: 7rem;
}
.m-choose-bar {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border-bottom: 0.08333333rem solid #eaecef;
  border-color: #eaecef;
  border-color: var(--brand-border-type1);
  border-left: 0px;
  border-right: 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  -webkit-overflow-scrolling: none;
  overscroll-behavior: none;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-transition: top 0.3s;
  transition: top 0.3s;
}
.m-choose-bar.m-choose-bar-show {
  position: relative;
  top: 0px;
  width: 100%;
  z-index: 997;
}
.m-event-list .choose-bar-pad {
  height: 3.66666667rem;
  background-color: rgb(6, 0, 25);
}
.m-event-list .choose-bar-pad.fixed {
  position: relative;
  z-index: 101;
}

.m-choose-sort,
.m-choose-league,
.m-choose-odds,
.m-choose-time {
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  /* background-color: #fafafa;
  background-color: var(--background-general-primary); */
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 20%;
  outline: none;
  padding: 0.91666667rem 0.5rem 0.91666667rem 0;
}
.m-choose-sort .m-title,
.m-choose-league .m-title,
.m-choose-odds .m-title,
.m-choose-time .m-title {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  font-size: 1.066rem;
  font-weight: 700;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  overflow: hidden;
  padding: 0 1.66666667rem 0 0.66666667rem;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-choose-sort .m-title::before,
.m-choose-league .m-title::before,
.m-choose-odds .m-title::before,
.m-choose-time .m-title::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-choose-sort .m-title::before,
.m-choose-league .m-title::before,
.m-choose-odds .m-title::before,
.m-choose-time .m-title::before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 0.83333333rem;
  position: absolute;
  right: 0.5rem;
}
.m-choose-sort .m-title.active::before,
.m-choose-league .m-title.active::before,
.m-choose-odds .m-title.active::before,
.m-choose-time .m-title.active::before {
  content: '\e62d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-choose-sort .m-title.active::before,
.m-choose-league .m-title.active::before,
.m-choose-odds .m-title.active::before,
.m-choose-time .m-title.active::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 0.83333333rem;
}
.m-choose-sort .m-title.used,
.m-choose-league .m-title.used,
.m-choose-odds .m-title.used,
.m-choose-time .m-title.used {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
.m-list {
  background-color: #fafafa;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 0px;
  margin-top: 1rem;
  max-height: 60vh;
  overflow: auto;
  padding: 0.83333333rem 0;
  position: absolute;
  width: 100%;
  z-index: 4;
}
.m-list li {
  font-weight: 700;
  height: 3rem;
  line-height: 3rem;
  padding: 0 0.83333333rem;
}
.m-list li:active {
  background-color: #f2f3f5;
}
.m-list li.checked {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
.m-list li:not(.tournament).checked::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  position: absolute;
  right: 1.33333333rem;
}
.m-list li:not(.tournament).checked::before::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-choose-time,
.m-choose-odds,
.m-choose-league {
  border-right: .5px solid #eaecef;
  border-color: #eaecef;
}
.m-choose-bar.fixed .m-choose-time .m-list,
.m-choose-bar.fixed .m-choose-sort .m-list,
.m-choose-bar.fixed .m-choose-league .m-list {
  max-height: 80vh;
}

.m-choose-sort,
.m-choose-league,
.m-choose-odds,
.m-choose-time {
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  /* background-color: #fafafa; */
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 20%;
  outline: none;
  padding: 0.91666667rem 0.5rem 0.91666667rem 0;
}
.m-choose-sort .m-title,
.m-choose-league .m-title,
.m-choose-odds .m-title,
.m-choose-time .m-title {
  /* background-color: #fafafa; */
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  font-size: 1.066rem;
  font-weight: 700;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  overflow: hidden;
  padding: 0 1.66666667rem 0 0.66666667rem;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-choose-sort .m-title::before,
.m-choose-league .m-title::before,
.m-choose-odds .m-title::before,
.m-choose-time .m-title::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-choose-sort .m-title::before,
.m-choose-league .m-title::before,
.m-choose-odds .m-title::before,
.m-choose-time .m-title::before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 0.83333333rem;
  position: absolute;
  right: 0.5rem;
}
.m-choose-sort .m-title.active::before,
.m-choose-league .m-title.active::before,
.m-choose-odds .m-title.active::before,
.m-choose-time .m-title.active::before {
  content: '\e62d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-choose-league .m-regions-list-no-data {
  left: 20%;
  margin: 0 auto;
  position: absolute;
  top: 30%;
}
.m-choose-league .m-regions-list-no-data p {
  font-size: 1.066rem;
}
.m-choose-league .m-list {
  left: 0;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 100vw;
}
.m-choose-league .m-list .m-regions-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  overflow: hidden;
  padding: 0 0.83333333rem;
  padding-bottom: 5.33333333rem;
  position: absolute;
  top: 0;
  width: 100%;
}
.m-choose-league .m-list .m-regions-list:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap {
  float: left;
  height: 100%;
  overflow: auto;
  width: 50%;
}

.m-choose-league .m-list .m-regions-list .m-scroll-wrap:last-child {
  scrollbar-width: none;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category,
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament {
  min-height: 100%;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li,
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 3rem;
  line-height: 3rem;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li:active,
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li:active {
  background-color: #f2f3f5;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category {
  border-right: 1px solid #eaecef;
  border-color: #eaecef;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li.tournament {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  padding-right: 0.83333333rem;
  white-space: nowrap;
  word-break: break-all;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li.tournament > span {
  display: inline-block;
  font-size: 1.066rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li.tournament .category-name {
  width: 65%;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-category
  li.tournament
  .select-tournamet-size {
  text-align: center;
  width: 15%;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-category
  li.tournament
  .select-tournamet-size
  em {
  background: #e41827;
  background: var(--brand-primary);
  border-radius: 1.5rem;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  height: 1.5rem;
  line-height: 1.5;
  width: 100%;
  align-items: center;
  /* min-width: 1.5rem; */
  vertical-align: middle;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-category li.tournament .event-size {
  text-align: right;
  width: 20%;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-category
  li.tournament.active
  .category-name {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-category
  li.tournament.active
  .select-tournamet-size {
  color: #353a45;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-category
  li.tournament.active
  .event-size {
  color: #353a45;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li.tournament {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  padding-left: 0.83333333rem;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li.tournament > span {
  display: inline-block;
  font-size: 1.066rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-tournament
  li.tournament
  .tournament-name {
  width: 70%;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li.tournament .checkbox {
  margin-right: 10px;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-tournament
  li.tournament
  .checkbox.bg-transparent
  .check-stroke-wrapper {
  background-color: transparent;
}
.m-choose-league
  .m-list
  .m-regions-list
  .m-scroll-wrap
  .m-tournament
  li.tournament
  .checkbox
  .check-stroke-wrapper {
  border: 1px solid #eaecef;
  border-color: #eaecef;
}
.m-choose-league .m-list .m-regions-list .m-scroll-wrap .m-tournament li.tournament .event-size {
  text-align: right;
  width: 15%;
}
.m-choose-league .m-list .m-regions-opt {
  background-color: #fafafa;
  border-top: 1px solid #eaecef;
  bottom: 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  padding: 0.83333333rem 1.066rem;
  position: absolute;
  width: 100%;
  border-color: #eaecef;
}
.m-choose-league .m-list .m-regions-opt > span {
  border: 1px solid var(--brand-highlight-text);
  border-radius: 0.25rem;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
.m-choose-league .m-list .m-regions-opt > span.m-regions-reset {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  margin-right: 0.83333333rem;
}
.m-choose-league .m-list .m-regions-opt > span.m-regions-apply {
  background: var(--brand-highlight-text);
  background: var(--brand-secondary);
  color: #ffffff;
}
</style>

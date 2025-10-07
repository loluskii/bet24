<template>
  <div class="m-countries-panel" isshowall="true" style="position: relative">
    <div class="m-countries-block">
      <div class="m-countries-block-title" data-cms-key="a_z">A-Z</div>
      <div class="m-country-list">
        <div v-for="(country, index) in countriesData" :key="index" class="m-league">
          <div
            v-if="country.categoryName"
            class="m-league-title hide"
            @click="showChild(index, country)"
          >
            <span class="icon-triangle"></span>
            <span class="text"> {{ country.categoryName }} </span>
            <span class="m-event-size"> {{ country.total }} </span>
          </div>
          <div :id="'child_' + index" class="m-league-conent d-none">
            <div class="m-tournament-list">
              <ul class="m-country-row">
                <template v-if="country.isOpen">
                  <li
                    class="not-top-league"
                    v-for="(tournament, i) in country.tournamentsData"
                    :key="i"
                  >
                    <a
                      class=""
                      @click.prevent="
                        $router.push({
                          name: 'fixtures-by-tournaments',
                          params: {
                            sport: getActiveSport.sportName,
                            categories: 'sr:category:' + activeCategory.categoryID,
                            tournaments: 'sr:tournament:' + tournament.tournamentID
                          }
                        })
                      "
                    >
                      <div class="m-item-left">
                        {{ tournament.tournamentName }}
                      </div>
                      <div class="m-item-right">{{ tournament.total }}</div>
                    </a>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, computed, ref } from 'vue'
import { slugify, getTournamentsByCategories } from '@/helpers'
import { useUtilsStore } from '@/stores'

const utilsStore = useUtilsStore()
const isLoading = ref(false)
const tournamentsData = ref([])
const activeCategory = ref(null)

const getActiveSport = computed(() => {
  const active = props.activeSportID
  return utilsStore.sportsMenu.find((x) => x.sportID == active)
})

async function showChild(index, country) {
  isLoading.value = true
  const childId = 'child_' + index
  const childElement = document.getElementById(childId)
  activeCategory.value = country
  if (!country.isOpen) {
    const res = await getTournamentsByCategories(country.categoryID)
    country.tournamentsData = res.sports
    country.isOpen = true
    if (childElement) {
      childElement.classList.remove('d-none')
    }
  } else {
    country.isOpen = false
    if (childElement) {
      childElement.classList.add('d-none')
    }
  }
}

const props = defineProps({
  countriesData: { type: Object },
  activeSportID: 'integer'
})

defineComponent({
  name: 'countries-list'
})
</script>

<style>
.m-sports .m-countries-panel {
  margin-bottom: 0.83333333rem;
}

.m-sports .m-countries-panel .m-countries-block {
  margin-top: 0;
}

.m-sports .m-countries-panel .m-countries-block-title {
  background: #f2f3f5;
  color: #353a45;
  font-size: 1rem;
  font-weight: normal;
  height: 2rem;
  line-height: 2rem;
  margin: 0;
  padding-left: 0.83333333rem;
}

.m-sports .m-countries-panel .m-countries-block .m-country-list {
  padding: 0;
}

.m-sports .m-countries-panel .m-countries-block .m-country-list .m-league {
  border-bottom: 0;
}

.m-sports .m-countries-panel .m-countries-block .m-country-list .m-league:last-child {
  border-bottom: 1px solid #f2f3f5;
}

.m-sports .m-countries-panel .m-countries-block .m-country-list .m-league .m-league-title {
  background-color: #ffffff;
  border-top: 1px solid #f2f3f5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  font-size: 1.066rem;
  height: 3.66666667rem;
  line-height: 3.66666667rem;
  padding: 0 3.33333333rem 0 0.83333333rem;
}

.m-countries-block .m-country-list .m-league .m-league-title {
  background-color: #353a45;
  background-color: var(--background-type2-secondary);
  border: 0;
  color: #ffffff;
  color: var(--text-type2-primary);
  height: 2.66666667rem;
  line-height: 2.66666667rem;
}

.m-league .m-league-title .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  /* padding-left: 0.83333333rem; */
}
.m-league .m-league-title .boost {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  height: 2rem;
  margin-left: 0.33333333rem;
  width: 2rem;
}
.m-league .m-league-title .icon-triangle {
  display: inline-block;
}
.m-league .m-league-title .icon-triangle::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-league .m-league-title .icon-triangle::before {
  color: var(--brand-secondary);
  display: inline-block;
  font-size: 0.83333333rem;
  height: 1.066rem;
  line-height: 1.4;
  overflow: hidden;
  vertical-align: middle;
}
.m-league .m-league-title.hide .icon-triangle {
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
.m-league .m-league-title .m-event-size {
  color: #353a45;
  color: var(--text-default-dark);
  font-size: 1rem;
  height: 3.66666667rem;
  position: absolute;
  right: 1.41666667rem;
}
.m-countries-block:not(:first-child) {
  margin-top: 1.66666667rem;
}
.m-countries-block-title {
  color: #353a45;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  padding: 0 0.83333333rem;
}
.m-countries-block .m-country-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 0.83333333rem;
}
.m-countries-block .m-country-list .m-league {
  /* border-bottom: 1px solid #9ca0ab; */
  margin: 0;
}
/* .m-countries-block .m-country-list .m-league .m-league-title {
  background-color: #353a45;
  border: 0;
  color: #ffffff;
  height: 2.66666667rem;
  line-height: 2.66666667rem;
} */
.m-countries-block .m-country-row {
  background-color: #1b1e25;
  color: #ffffff;
}
.m-countries-block .m-country-row li {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 3rem;
  line-height: 3rem;
}
.m-countries-block .m-country-row li > a {
  border-bottom: 0.08333333rem solid #9ca0ab;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 0.83333333rem 0 0;
  text-decoration: none;
}
.m-countries-block .m-country-row li.not-top-league {
  padding-left: 3.83333333rem;
}
.m-countries-block .m-country-row li:last-child {
  border-bottom: 0;
}
.m-countries-block .m-country-row li:last-child > a {
  border-bottom: 0;
}

.m-league .m-league-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  /* border-top: 1px solid #f2f3f5; */
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  color: var(--c-prematch-list-league-title-text);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  height: 3.66666667rem;
  line-height: 3.66666667rem;
  overflow: hidden;
  padding: 0 3.33333333rem 0 0.83333333rem;
}
</style>

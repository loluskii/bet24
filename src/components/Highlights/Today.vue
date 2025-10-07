<template>
  <div style="position: relative">
    <div class="m-bet-content">
      <div v-if="Object.keys(todaysData).length" class="market-wrapper">
        <div class="m-today-tab m-tabs m-tabs-mini m-tabs-no-animation" style="overflow: hidden">
          <div class="m-tabs-nav" style="width:">
            <div
              v-for="(market, m) in marketsGroup"
              :key="m"
              class="m-tabs-tab"
              :class="market.marketID === activeMarket.marketID ? 'm-tab-active' : ''"
              @click="selectMarket(market)"
            >
              {{ market.marketName }}
            </div>
          </div>
        </div>
      </div>

      <template v-if="Object.keys(todaysData).length">
        <div
          v-for="(group, index) in todaysData"
          :key="index"
          class="x-table m-sports-table football"
        >
          <div class="x-table-row m-date-row">
            <div class="x-table-cell m-date">
              {{ formatDate(index, 'DD/MM dddd') }}
            </div>
            <div class="x-table-cell market-title">
              <template
                v-for="(market, o) in _.sortBy(activeMarket.outcomes, 'outcomeID')"
                :key="o"
              >
                <div>
                  <span>{{ market.outcomeName }}</span>
                </div>
              </template>
            </div>
          </div>
          <PrematchFixture
            v-for="(event, index) in group"
            :key="index"
            :eventData="event"
            :activeMarket="activeMarket"
          ></PrematchFixture>
        </div>
      </template>
      <div v-else class="no-data">
        <div style="white-space: pre-line">
          Sorry, there are no games currently<br />available in this category. Please try later.<br />Thank
          you.
        </div>
      </div>
      <div class="view-all">
        <a href="#" @click.prevent="viewMore" class="">View More</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import PrematchFixture from '@/components/Prematch/PrematchFixture.vue'
import { defineComponent, defineEmits, computed } from 'vue'
import { formatDate } from '@/helpers'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { slugify } from '@/helpers'
import { useUtilsStore } from '@/stores'

const props = defineProps({
  todaysData: { type: Object },
  marketsGroup: Object,
  activeMarket: Object
})

defineComponent({
  name: 'today-games'
})

const emits = defineEmits(['select-market'])
const router = useRouter()
const utilsStore = useUtilsStore()

const getSportbyId = computed(() => {
  return utilsStore.sportsMenu.find((sport) => sport.sportID == props.activeMarket.sportID)
})

function viewMore() {
  return router.push({
    name: 'today-fixtures',
    params: { sport: slugify(getSportbyId.value.sportName) }
  })
}

const selectMarket = (market) => {
  emits('select-market', market)
}
</script>

<style scoped>
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
  /* width: calc(100); */
}

.m-sports .market-wrapper {
  /* padding: 10px 0px !important; */
}

.m-sports .nav-fixed .market-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  position: fixed;
  top: 7.75rem;
  -webkit-transition: top 0.3s ease !important;
  transition: top 0.3s ease !important;
  width: 100%;
  z-index: 100;
}

.m-tabs-tab {
  /* border: 1px solid var(--c-sports-prematch-market-title-text); */
  line-height: 2rem !important;
  margin-right: 10px !important;
  border-radius: 30px;
}

.m-tabs-tab:last-child {
  margin-right: 0px !important;
}

.m-tab-active {
  background-color: var(--brand-active-tab-bg);
  color: #ffffff !important;
}
</style>

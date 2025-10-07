<template>
  <div style="position: relative">
    <div class="m-bet-content">
      <div v-if="Object.keys(highlightsData).length" class="market-wrapper">
        <div class="m-today-tab m-tabs m-tabs-mini m-tabs-no-animation" style="overflow: hidden">
          <div class="m-tabs-nav" style="width:">
            <!-- <div class="m-tabs-ink-bar" style="display: block; width: 51.0469px; left: 0px"></div> -->
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
      <template v-if="Object.keys(highlightsData).length">
        <div
          v-for="(group, index) in highlightsData"
          :key="index"
          class="x-table m-sports-table football"
        >
          <div class="x-table-row m-date-row">
            <div class="x-table-cell m-date">
              {{ formatDate(index, 'DD/MM dddd') }}
            </div>
            <div class="x-table-cell market-title">
              <div
                v-if="activeMarket.specifier !== ''"
                style="text-transform: capitalize"
                class="each-module is-multiline"
              >
                {{ activeMarket.specifier }}
              </div>
              <template
                v-for="(market, m) in _.sortBy(activeMarket.outcomes, 'outcomeID')"
                :key="m"
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
import { defineComponent, computed, onMounted } from 'vue'
import { formatDate } from '@/helpers'
import PrematchFixture from '@/components/Prematch/PrematchFixture.vue'
import { defineEmits } from 'vue'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { useUtilsStore } from '@/stores'
import { slugify } from '@/helpers'
import emitter from '@/plugins/emitter'

const props = defineProps({
  highlightsData: Object,
  marketsGroup: Object,
  activeMarket: Object
})
defineComponent({
  name: 'highlights-games'
})

const emits = defineEmits(['select-market'])
const router = useRouter()
const utilsStore = useUtilsStore()

const getSportbyId = computed(() => {
  return utilsStore.sportsMenu.find((sport) => sport.sportID == props.activeMarket.sportID)
})

function viewMore() {
  return router.push({
    name: 'fixtures-by-sports',
    params: { sport: slugify(getSportbyId.value.sportName) }
  })
}

const selectMarket = (market) => {
  emits('select-market', market)
}

// In the parent component that renders the list of fixtures
onMounted(() => {
  emitter.on('remove-fixture', (matchID) => {
    // Filter out the fixture with the given matchID
    fixtures.value = fixtures.value.filter((fixture) => fixture.matchID !== matchID)
  })
})

// onBeforeUnmount(() => {
//   emitter.off('remove-fixture');
// });

// const activeMarketId = ref(props.marketsGroup.markets[0].id)
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
  /* border-radius: 30px; */
}

.m-tabs-tab:last-child {
  margin-right: 0px !important;
}
.m-tab-active {
  border-bottom: 3px solid var(--brand-primary);
}
</style>

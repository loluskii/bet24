<template lang="">
  <div class="live-container">
    <div class="m-bet-tab">
      <div class="x-live-title">
        <span class="m-title-sport">Live </span>
        <div class="m-snap-nav-wrap m-sport-type">
          <ul
            class="m-snap-nav flex"
            style="
              transform: translate(0px, 0px) translateZ(0px);
              transition-duration: 350ms;
              transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
              width: 100%;
            "
          >
            <li
              v-for="(sport, index) in sportsListData"
              :class="sport.sportID == activeSport.sportId ? 'active' : ''"
              @click="setActiveSport(sport)"
              :key="index"
              :id="'live_' + sport.sportID"
              class="m-sport-type-item m-snap-nav-item"
            >
              {{ sport.sportName }}
            </li>
          </ul>
        </div>
      </div>
      <div style="position: relative">
        <div class="m-bet-content">
          <div class="m-market-tab m-tabs m-tabs-mini m-tabs-no-animation" style="overflow: auto">
            <div class="m-tabs-nav">
              <div
                v-for="(market, m) in sportMarkets"
                :key="m"
                class="m-tabs-tab"
                :class="market.marketID === activeMarket.marketID ? 'm-tabs-tab-active' : ''"
                @click="selectMarket(market)"
              >
                {{ market.marketName }}
              </div>
            </div>
          </div>
          <div class="x-table x-live-table football">
            <div class="x-table-row m-name-row">
              <div class="x-table-cell m-name-cell">
                <div class="m-name">
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
                    <div class="market-name">
                      <span>{{ market.outcomeName }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- <PrematchFixture
              v-for="(event, index) in group"
              :key="index"
              :eventData="event"
              :activeMarket="activeMarket"
            ></PrematchFixture> -->
            <LiveHighlightsFixture
              v-for="(fixture, index) in activeSportFixtures.fixtures"
              :gameData="fixture"
              :key="index"
              :activeMarket="activeMarket"
            ></LiveHighlightsFixture>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import LiveHighlightsFixture from '@/components/Live/LiveHighlightsFixture.vue'

import { ref, computed, onMounted } from 'vue'
import _ from 'lodash'

const props = defineProps(['fixturesData', 'markets'])
const activeMarket = ref({})
const activeSport = ref({
  sportId: props.fixturesData[0].sportID,
  sportName: props.fixturesData[0].sportName
})

const sportsListData = computed(() => {
  return props.fixturesData
})

const activeSportFixtures = computed(() => {
  return props.fixturesData.find((group) => group.sportID == activeSport.value.sportId)
})

const sportMarkets = computed(() => {
  return props.markets.filter(
    (market) => market.sportID == activeSport.value.sportId && market.specifier == ''
  )
})

function selectMarket(market) {
  activeMarket.value = market
}

async function setActiveSport(sport) {
  activeSport.value.sportId = sport.sportID
  activeSport.value.sportName = sport.sportName
  activeMarket.value = sportMarkets.value.length ? sportMarkets.value[0] : {}
  document.getElementById('live_' + sport.sportId).scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

onMounted(() => {
  if (sportMarkets.value.length > 0) {
    activeMarket.value = sportMarkets.value[0]
  }
})
</script>

<style scoped>
.live-container {
  background-color: #000825;
  background-color: var(--background-type2-primary);
  color: #ffffff;
  color: var(--text-type2-primary);
}
.live-container .m-market-tab {
  background-color: #000825;
  background-color: var(--background-type2-primary);
  position: -webkit-sticky;
  position: sticky;
  top: 7.41666667rem;
  width: 100%;
  z-index: 26;
}

.live-container .m-market-tab .m-tabs-nav .m-tabs-ink-bar {
  background-color: var(--brand-highlight-text);
}
.live-container .m-market-tab .m-tabs-nav .m-tabs-tab {
  color: #ffffff;
  -webkit-box-flex: initial;
  -webkit-flex: initial;
  -ms-flex: initial;
  flex: initial;
  font-size: 1.066rem;
  font-weight: 500;
  margin-right: 0;
  padding: 1.33333333rem 0.83333333rem;
}
.live-container .m-market-tab .m-tabs-nav .m-tabs-tab-active {
  color: var(--brand-highlight-text);
  font-weight: bold;
  border-bottom: 0.23333333rem solid var(--brand-highlight-text)
}
.live-container .m-bet-tab {
  margin-top: 0rem !important;
}
.live-container .m-bet-tab .x-live-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  padding: 1.066rem 1rem;
  position: -webkit-sticky;
  position: sticky;
  top: 3.66666667rem;
  z-index: 200;
  background-color: #000825;
  /* background-color: var(--background-type2-primary); */
}
.live-container .m-bet-tab .x-live-title > span {
  border-right: 1px solid;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  margin-right: 0.83333333rem;
  padding-right: 0.83333333rem;
  border-right-color: #9ca0ab;
  border-right-color: var(--text-type2-tertiary);
}
.live-container .m-bet-tab .m-sport-type {
  /* background-color: #1b1e25; */
  /* background-color: var(--background-type2-primary); */
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.live-container .m-bet-tab .m-sport-type .m-sport-type-item {
  font-size: 1.066rem;
  font-weight: normal;
  line-height: 1;
}
.live-container .m-bet-tab .m-sport-type .m-sport-type-item.active {
  color: var(--brand-highlight-text);
  font-weight: bold;
}
.live-container .m-bet-tab .m-bet-content .x-live-table .m-name-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.live-container .m-bet-tab .m-bet-content .x-live-table .m-name-row .m-name-cell {
  background-color: #000e21;
  background-color: var(--c-live-section-market-indicated-bar);
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0 0.83333333rem;
}
.live-container .m-bet-tab .m-bet-content .x-live-table .m-name-row .m-name-cell .m-name {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 55%;
}
.live-container .m-bet-tab .m-bet-content .x-live-table .m-name-row .m-name-cell .m-name > div {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
.live-container .m-bet-tab .m-bet-content .x-live-table.tennis .m-info-cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0.83333333rem;
  width: 26%;
}
.live-container .m-bet-tab .m-bet-content .view-all a,
.live-container .m-bet-tab .m-bet-content .view-all a:hover,
.live-container .m-bet-tab .m-bet-content .view-all a:visited,
.live-container .m-bet-tab .m-bet-content .view-all a:active,
.live-container .m-bet-tab .m-bet-content .view-all a:after {
  color: var(--c-event-normal-text);
  text-decoration: none;
}
.live-container .no-data:before {
  color: rgba(234, 236, 239, 0.15);
}
.live-container .m-loading.dark {
  background-color: #1b1e25;
  background-color: var(--background-type2-primary);
}
</style>

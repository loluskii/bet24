<template lang="">
  <div class="m-sports" id="m-sports">
    <div class="m-sports-title">
      <span class="m-title-sport">Sports </span>
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
            :id="'highlights_' + sport.sportID"
            class="m-sport-type-item m-snap-nav-item"
          >
            <img
              :src="getImageSrc(sport.sportID)"
              style="height: 20px; margin-right: 0.4rem"
              alt=""
              srcset=""
            />
            <Transition name="bounce">
              <span v-if="sport.sportID == activeSport.sportId">{{ sport.sportName }}</span>
            </Transition>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-pre-opts m-tabs m-tabs-mini m-tabs-no-animation" style="overflow: hidden">
      <div class="m-tabs-content">
        <div class="m-tabs-tabpane">
          <div class="m-highlights-wrap" style="position: relative">
            <!-- <templat/>e> -->
            <div style="position: relative">
              <div class="m-bet-content">
                <div v-if="Object.keys(activeSportFixtures).length" class="market-wrapper">
                  <div
                    class="m-today-tab m-tabs m-tabs-mini m-tabs-no-animation"
                    style="overflow: hidden"
                  >
                    <div class="m-tabs-nav" style="width:">
                      <div
                        class="m-tabs-ink-bar"
                        style="display: block; width: 51.0469px; left: 0px"
                      ></div>
                      <div
                        v-for="(market, m) in sportMarkets"
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
                <template v-if="Object.keys(activeSportFixtures).length">
                  <div
                    v-for="(group, index) in activeSportFixtures"
                    :key="index"
                    class="x-table m-sports-table football"
                  >
                    <div class="x-table-row m-date-row">
                      <div class="x-table-cell m-date">{{ index }}</div>
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
                    Sorry, there are no games currently<br />available in this category. Please try
                    later.<br />Thank you.
                  </div>
                </div>
              </div>
            </div>
            <!-- </template> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import PrematchFixture from '@/components/Prematch/PrematchFixture.vue'
import { ref, computed, onMounted } from 'vue'
import _ from 'lodash'

const props = defineProps(['fixturesData', 'markets'])
const activeSport = ref({
  sportId: props.fixturesData[0].sportID,
  sportName: props.fixturesData[0].sportName
})
const activeMarket = ref({})
const sportsListData = computed(() => {
  return props.fixturesData
})

const activeSportFixtures = computed(() => {
  let data = props.fixturesData.find((group) => group.sportID == activeSport.value.sportId)
  return _.groupBy(data.fixtures, (fixture) => fixture.date.split(' ')[0])
})

const sportMarkets = computed(() => {
  return props.markets.filter((market) => market.sportID == activeSport.value.sportId)
})

const getImageSrc = (sportId) => {
  const imageUrl = new URL(`../../assets/images/sports/${sportId}.png`, import.meta.url)
  return imageUrl
}

function selectMarket(market) {
  activeMarket.value = market
}

async function setActiveSport(sport) {
  activeSport.value.sportId = sport.sportID
  activeSport.value.sportName = sport.sportName
  activeMarket.value = sportMarkets.value.length ? sportMarkets.value[0] : {}
  document.getElementById('highlights_' + sport.sportId).scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

// Set the initial activeMarket on mount
onMounted(() => {
  if (sportMarkets.value.length > 0) {
    activeMarket.value = sportMarkets.value[0]
  }
})
</script>

<style scoped>
/* .m-sports-title {
  top: 3.66666667rem;
  position: sticky;
  background-color: #fff;
  z-index: 220;
} */

.header-appear {
  background-color: red;
  position: sticky;
  top: 0px;
}

.m-sports .m-sports-title .m-sport-type .m-sport-type-item.active {
  padding: 5px 15px;
  border: 1px solid;
  border-radius: 25px;
  /* background-color: #ffffff; */
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
/* .bounce-leave-active {
  animation: bounce-in 0.2s reverse;
} */
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.m-sports .m-sports-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: start;
  line-height: 1.75rem;
  padding: 0.83333333rem;
  width: 100%;
}

.m-tabs-tab {
  /* border: 1px solid var(--c-sports-prematch-market-title-text); */
  line-height: 3rem !important;
  margin-right: 10px !important;
  border-radius: 30px;
}

.m-tab-active {
  background-color: var(--brand-secondary);
  color: #ffffff !important;
}
</style>

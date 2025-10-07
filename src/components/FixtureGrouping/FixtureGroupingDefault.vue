<template>
  <div class="m-league event-league">
    <div class="m-league-conent" :id="'m-league-child_'">
      <div
        v-for="(fixture, f) in _.groupBy(fixturesList, (fixture) => fixture.date.split(' ')[0])"
        :key="f"
        class="x-table m-sports-table football"
      >
        <div class="x-table-row m-date-row">
          <div class="x-table-cell m-date">
            {{ formatDate(f, 'DD/MM dddd') }}
          </div>
          <div class="x-table-cell market-title">
            <template v-for="(market, m) in activeMarket.outcomes" :key="m">
              <div>
                <span>{{ market.outcomeName }}</span>
              </div>
            </template>
          </div>
        </div>
        <PrematchFixture
          v-for="(event, index) in fixture"
          :key="index"
          :eventData="event"
          :activeMarket="activeMarket"
        ></PrematchFixture>
      </div>
    </div>
  </div>
</template>
<script setup>
import PrematchFixture from '@/components/Prematch/PrematchFixture.vue'
import { formatDate } from '@/helpers'
import _ from 'lodash'
const props = defineProps({
  fixturesList: Object,
  activeMarket: Object
})
</script>

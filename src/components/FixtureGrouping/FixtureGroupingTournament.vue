<template>
  <div v-for="(group, index) in fixturesList" :key="index" class="m-league event-league">
    <div class="m-league-title" @click="showChild($event, index)">
      <span class="icon-triangle"></span>
      <span class="text">{{ group[0].categoryName }} - {{ index }}</span>
      <span class="m-event-size">{{ group.length }}</span>
    </div>
    <div class="m-league-conent" :id="'m-league-child_' + index">
      <div
        v-for="(fixture, f) in _.groupBy(group, (fixture) => fixture.date.split(' ')[0])"
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

function showChild(e, index) {
  const childId = 'm-league-child_' + index
  const childElement = document.getElementById(childId)
  const element = e.currentTarget // Use e.currentTarget instead of e
  const isOpen = element.classList.contains('hide')

  if (isOpen) {
    childElement.classList.remove('d-none')
    element.classList.remove('hide')
  } else {
    childElement.classList.add('d-none')
    element.classList.add('hide')
  }
}
</script>

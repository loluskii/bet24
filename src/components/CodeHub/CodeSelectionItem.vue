<template>
  <div class="code-selection-item d-flex code-selection-item">
    <!-- <div class="icon-container">
      <div class="icon is-dark">
        
        <img :src="getImageURL(data.tournament)"
          alt="Tournament Icon"
        />
      </div>
    </div> -->
    <div class="content-container">
      <div class="top d-flex">
        <div class="outcome text-700">{{ data.outcomeName }}</div>
        <div class="odds text-700">@{{ data.odds }}</div>
        <div class="split-icon color-secondary">|</div>
        <div class="market color-secondary text-500">{{ data.marketName }}</div>
        <div
          role="button"
          aria-label="statistic icon"
          data-op="selection-statistic-icon"
          class="stats-button color-secondary"
        >
          <div class="icon-font-base" style="font-size: 1.33333rem"></div>
        </div>
      </div>
      <div class="bottom d-flex">
        <span class="home-team text-size-10">{{ data.eventName.split('vs.')[0] }}</span
        ><span class="vs color-secondary text-size-10">vs</span
        ><span class="away-team text-size-10">{{ data.eventName.split('vs.')[1] }}</span>
        <div class="time color-secondary text-size-10 ml-auto">
          {{ formatDate(data.eventDate, 'ddd Do, hh:mma') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { formatDate } from '@/helpers'

const props = defineProps(['data'])

function getImageURL(name) {
  if (name == 'Championship') {
    return new URL('../../assets/images/EFL_Championship_Logo.png', import.meta.url)
  } else if (name == 'Bundesliga') {
    return new URL('../../assets/images/Bundesliga.png', import.meta.url)
  } else {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Top%20Leagues%2F${name}.png?alt=media`
  }
}
</script>
<style>
.code-selection-item {
  font-size: 1rem;
}
.code-selection-item .icon-container {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 0;
  -webkit-flex-grow: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  min-height: 2.66666667rem;
  padding: 0.16666667rem 0.5rem 0.83333333rem 0;
}
.code-selection-item .icon-container img {
  height: 1.33333333rem;
  width: 1.33333333rem;
}
.code-selection-item .content-container {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.code-selection-item .content-container .bottom {
  -webkit-column-gap: 4px;
  -moz-column-gap: 4px;
  column-gap: 4px;
  margin-bottom: -0.33333333rem;
  margin-top: -0.16666667rem;
  max-width: 100%;
  overflow-x: hidden;
}
.code-selection-item .content-container .home-team,
.code-selection-item .content-container .away-team {
  text-overflow: ellipsis;
  white-space: nowrap;
}
.code-selection-item .content-container .home-team {
  -webkit-flex-basis: min-content;
  -ms-flex-preferred-size: min-content;
  flex-basis: min-content;
  -webkit-box-flex: 0;
  -webkit-flex-grow: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  max-width: 80px;
  overflow: hidden;
}
.code-selection-item .content-container .away-team {
  -webkit-flex-basis: max-content;
  -ms-flex-preferred-size: max-content;
  flex-basis: max-content;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 80px;
  overflow: hidden;
}
.code-selection-item .content-container .time {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.code-selection-item .outcome {
  margin-right: 0.25rem;
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: no-wrap;
  white-space: nowrap;
}
@media only screen and (max-width: 320px) {
  .code-selection-item .outcome {
    max-width: 80px;
  }
}
.code-selection-item .market {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: no-wrap;
  white-space: nowrap;
}
@media only screen and (max-width: 320px) {
  .code-selection-item .market {
    max-width: 105px;
  }
}
.code-selection-item .split-icon {
  margin: 0 0.25rem;
}
.code-selection-item .stats-button {
  margin-left: auto;
}
.code-selection-item .icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 50%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 1.4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 1.4rem;
}
.code-selection-item .icon svg,
.code-selection-item .icon img {
  border-radius: 50%;
}
.code-selection-item .icon.is-dark {
  background: #ffffff;
}
.code-selection-item .outright-market {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.d-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.text-700 {
  font-weight: 700;
}
.text-500 {
  font-weight: 500;
}
.color-secondary {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.text-size-10 {
  font-size: 0.9rem;
}
.ml-auto {
  margin-left: auto;
}
</style>

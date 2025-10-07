<template>
  <div
    class="featured-code-container"
    role="tabpanel"
    aria-labe="Featured Code"
    data-op="featured-code-tabpanel"
  >
    <div class="HorizonSwipe" id="featuredCodeCardBox">
      <div
        v-for="(code, index) in codes"
        :key="index"
        class="featured-code-card-container"
        :data-hs-id="code.betslipId"
        :data-hs-index="index"
      >
        <div
          role="table"
          aria-label="booking code card for 1C92348"
          data-op="booking-code-card-1C92348"
          class="booking-code-list-item featured-code-card-style"
        >
          <div role="row" class="header">
            <div
              role="rowheader"
              aria-label="booking code 1C92348"
              data-op="booking-code-1C92348-heading"
              class="code flex-1"
            >
              {{ code.betslipId }}
            </div>
            <div class="folds text-center flex-1">
              <span class="label">Folds:</span><span>{{ code.totalSelections }}</span>
            </div>
            <div class="odds text-right flex-1">
              <span class="label">Odds:</span><span>{{ code.total_odd }}</span>
            </div>
          </div>
          <div role="row" class="content">
            <div
              tabindex="-1"
              class="semi-transparent-linear-gradient-scrolling-animation-container"
            ></div>
            <div class="scroll-level">
              <div
                v-for="selection in code.selections"
                class="code-selection-item d-flex code-selection-item"
                :key="selection.id"
              >
                <div class="content-container">
                  <div class="top d-flex">
                    <div class="outcome text-700">
                      {{ selection.outcomeName }}
                    </div>
                    <div class="odds text-700">@{{ selection.odds }}</div>
                    <div class="split-icon color-secondary">|</div>
                    <div class="market color-secondary text-500">
                      {{ selection.marketName }}
                    </div>
                  </div>
                  <div class="bottom d-flex">
                    <span class="home-team text-size-10">{{
                      selection.eventName.split('vs.')[0]
                    }}</span
                    ><span class="vs color-secondary text-size-10">vs</span
                    ><span class="away-team text-size-10">{{
                      selection.eventName.split('vs.')[1]
                    }}</span>
                    <div class="time color-secondary text-size-10 ml-auto">
                      {{ formatDate(selection.eventDate, 'ddd, Do hh:mma') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="prevent-scroll left"></div>
            <div class="prevent-scroll right"></div>
          </div>
          <div role="row" class="booking-code-action-bar">
            <div
              role="button"
              tabindex="0"
              class="button loading-button-container share-button"
              @click="shareCode(code)"
            >
              <div
                v-if="shareCodeLoading"
                class="loading-icon-container share-loading-icon-container"
              >
                <div class="loading-icon icon-font-base" role="alert" style="font-size: 12px">
                  
                </div>
              </div>
              <span v-else class="loading-button-click-area share-button-click-area mr-auto"
                ><div class="mr-8 icon-font-base" style="font-size: 12px"></div>
                <span>Share</span></span
              >
            </div>

            <div
              data-op="add-to-betslip"
              role="button"
              tabindex="0"
              class="button loading-button-container add-to-betslip-button"
              @click="addToBetslip(code)"
            >
              <div v-if="addToBetslipLoading" class="loading-icon-container">
                <div class="loading-icon icon-font-base" role="alert" style="font-size: 12px">
                  
                </div>
              </div>
              <span v-else class="loading-button-click-area share-button-click-area mr-auto">
                <div class="mr-8 icon-font-base" style="font-size: 12px"></div>
                <span>Share</span>
              </span>

              <div
                data-op="add-to-betslip"
                role="button"
                tabindex="0"
                class="button loading-button-container add-to-betslip-button"
                @click="addToBetslip(code)"
              >
                <div v-if="addToBetslipLoading" class="loading-icon-container">
                  <div class="loading-icon icon-font-base" role="alert" style="font-size: 12px">
                    
                  </div>
                </div>
                <span v-else class="loading-button-click-area"
                  ><span data-cms-key="add_to_betslip" data-cms-page="page_code_hub"
                    >Add to Betslip</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/helpers'
import { ref } from 'vue'
import emitter from '@/plugins/emitter'
import { useCouponStore } from '@/stores'

const props = defineProps(['codes'])
const addToBetslipLoading = ref(false)
const shareCodeLoading = ref(false)
const couponStore = useCouponStore()

function getImageURL(name) {
  if (name == 'Championship') {
    return new URL('../../assets/images/EFL_Championship_Logo.png', import.meta.url)
  } else if (name == 'Bundesliga') {
    return new URL('../../assets/images/Bundesliga.png', import.meta.url)
  } else {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Top%20Leagues%2F${name}.png?alt=media`
  }
}

function addToBetslip(code) {
  addToBetslipLoading.value = true
  setTimeout(() => {
    addToBetslipLoading.value = false
    try {
      if (couponStore.coupon.selections.length) {
        emitter.emit('showBetslipConfirmation', code)
      } else {
        couponStore.coupon.selections = code.selections
        couponStore.coupon.totalOdds = parseFloat(code.totalOdd)
        couponStore.coupon.totalStake = parseFloat(code.stake)
        couponStore.coupon.stake = parseFloat(code.stake)
        couponStore.coupon.maxWin = parseFloat(code.possibleWin)
        couponStore.coupon.source = code.source
        if (code.selections.length === 1) {
          couponStore.coupon.bet_type = 'Single'
          couponStore.coupon.betslip_type = 'Single'
        } else {
          couponStore.coupon.bet_type = 'Multiple'
          couponStore.coupon.betslip_type = 'Multiple'
        }
        emitter.emit('openBetslip')
      }
    } catch (error) {
      console.log(error)
      emitter.emit('showDialogueToaster', 'Error Loading Betslip')
    }
  }, 2000)
}

function shareCode(data) {
  shareCodeLoading.value = true
  setTimeout(() => {
    shareCodeLoading.value = false
    emitter.emit('showBookBetModal', { data: data })
  }, 1000)
}
</script>

<style scoped>
.HorizonSwipe {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.HorizonSwipe > * {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.featured-code-container {
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0 1rem;
}
.featured-code-container #featuredCodeCardBox {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  margin-top: 0.33333333rem;
  padding-bottom: 0.33333333rem;
  overflow-x: auto; /* Enable horizontal scrolling */
  scroll-snap-type: x mandatory; /* Enable scroll snapping along the horizontal axis */
  scroll-behavior: smooth;
}
.featured-code-container #featuredCodeCardBox > * {
  margin-right: 0.66666667rem;
}
@media only screen and (max-width: 320px) {
  .featured-code-container #featuredCodeCardBox > * {
    margin-right: 0.33333333rem;
  }
}
.featured-code-container #featuredCodeCardBox > * {
  margin-bottom: 1rem;
}
.featured-code-card-container {
  background-color: #ffffff;
  background-color: var(--c-featured-match-card-bg);
  -webkit-box-shadow:
    0px 2px 4px 2px rgba(0, 0, 0, 0.1),
    2px 2px 4px 0px rgba(0, 0, 0, 0.1);
  box-shadow:
    0px 2px 4px 2px rgba(0, 0, 0, 0.1),
    2px 2px 4px 0px rgba(0, 0, 0, 0.1);
  width: 88%;
  scroll-snap-align: center; /* Snap the cards to the center */
  flex-shrink: 0; /* Prevent shrinking */
}
.featured-code-card-container .featured-code-card-style {
  height: 100%;
  max-height: initial;
}
.featured-code-card-container .featured-code-card-style .scroll-level {
  row-gap: 0.33333333rem;
}
.booking-code-list-item {
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: var(--c-code-hub-code-card-shadow);
  box-shadow: var(--c-code-hub-code-card-shadow);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  max-height: 17.33333333rem;
  position: relative;
  color: #353a45;
  color: var(--text-type1-primary);
}
.booking-code-list-item .header {
  background-color: #d6ebdc;
  background-color: var(--brand-type1-secondary);
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 1.06666667rem;
  font-weight: 700;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.125rem 1rem;
}
.booking-code-list-item .header .label {
  display: inline-block;
  font-size: 1rem;
  font-weight: 400;
  -webkit-transform: scale(0.85);
  -ms-transform: scale(0.85);
  transform: scale(0.85);
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.booking-code-list-item .code {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.booking-code-list-item .content {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}
.booking-code-list-item .content .code-selection-item {
  min-height: 2.66666667rem;
}
.booking-code-list-item .content .scroll-level {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: 0.66666667rem 1rem 0;
  position: relative;
  row-gap: 0.5rem;
}
.booking-code-list-item .content .prevent-scroll {
  background-color: transparent;
  height: 100%;
  position: absolute;
  top: 0;
}
.booking-code-list-item .content .prevent-scroll.left {
  left: 0;
  width: 2.5rem;
}
.booking-code-list-item .content .prevent-scroll.right {
  right: 0;
  width: 1.33333333rem;
}
.booking-code-list-item .flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.booking-code-list-item .text-center {
  text-align: center;
}
.booking-code-list-item .text-right {
  text-align: right;
}
.semi-transparent-linear-gradient-scrolling-animation-container {
  background: var(--background-general-primary);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(var(--background-general-primary-op-0)),
    color-stop(40%, var(--background-general-primary-op-60)),
    to(var(--background-general-primary))
  );
  background: -webkit-linear-gradient(
    top,
    var(--background-general-primary-op-0) 0%,
    var(--background-general-primary-op-60) 40%,
    var(--background-general-primary) 100%
  );
  background: linear-gradient(
    180deg,
    var(--background-general-primary-op-0) 0%,
    var(--background-general-primary-op-60) 40%,
    var(--background-general-primary) 100%
  );
  bottom: -4px;
  height: calc(2.66666667rem + 1rem);
  left: 0;
  opacity: 1;
  pointer-events: none;
  position: absolute;
  right: 0;
  -webkit-transition: opacity 1s ease-in-out;
  transition: opacity 1s ease-in-out;
  z-index: 10;
}
.hide-mask {
  opacity: 0;
  -webkit-transition: opacity 0.1s;
  transition: opacity 0.1s;
}
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
.booking-code-action-bar {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  height: 2.66666667rem;
}
.booking-code-action-bar .share-button {
  background-color: #f2f3f5;
  color: var(--brand-highlight-text);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-flex-basis: 121px;
  -ms-flex-preferred-size: 121px;
  flex-basis: 121px;
  overflow: hidden;
}
.booking-code-action-bar .share-button .share-loading-icon-container {
  left: 1rem;
}
.booking-code-action-bar .share-button .share-button-click-area {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: left;
  -webkit-justify-content: left;
  -ms-flex-pack: left;
  justify-content: left;
  padding: 0.33333333rem 0.66666667rem 0.33333333rem 0;
}
.booking-code-action-bar .share-button .mr-auto {
  margin-right: auto;
}
.booking-code-action-bar .edit-button {
  background-color: #096b27;
  color: #ffffff;

  -webkit-box-flex: 0;
  -webkit-flex: 0 0 2.66666667rem;
  -ms-flex: 0 0 2.66666667rem;
  flex: 0 0 2.66666667rem;
  padding: 0;
}
.booking-code-action-bar .add-to-betslip-button {
  background-color: var(--brand-primary);
  color: #ffffff;

  max-width: 11.08333333rem;
  min-width: 10rem;
  padding: 0 1rem;
}
.booking-code-action-bar .mr-8 {
  margin-right: 0.66666667rem;
}
.featured-code-container #featuredCodeCardBox {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  margin-top: 0.33333333rem;
  padding-bottom: 0.33333333rem;
}
.featured-code-container #featuredCodeCardBox > * {
  margin-right: 0.66666667rem;
}
@media only screen and (max-width: 320px) {
  .featured-code-container #featuredCodeCardBox > * {
    margin-right: 0.33333333rem;
  }
}
.featured-code-container #featuredCodeCardBox > * {
  margin-bottom: 1rem;
}
.featured-code-container #featuredCodeCardBox .featured-code-card-container {
  max-height: 16.66666667rem;
}
</style>

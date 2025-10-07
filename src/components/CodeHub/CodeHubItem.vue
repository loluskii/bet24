<template>
  <div class="code-hub-list-item-intersection-observer-wrap" style="">
    <div class="code-hub-list-item">
      <div role="table" class="booking-code-list-item">
        <div role="row" class="header">
          <div role="rowheader" class="code flex-1">{{ code.betslipId }}</div>
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
            <CodeSelectionItem
              v-for="selection in code.selections"
              :key="selection.id"
              :data="selection"
            />
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
              <div class="loading-icon icon-font-base" role="alert" style="font-size: 12px"></div>
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
              <div class="loading-icon icon-font-base" role="alert" style="font-size: 12px"></div>
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
</template>

<script setup>
import CodeSelectionItem from './CodeSelectionItem.vue'
import { useCouponStore } from '@/stores'
import { ref } from 'vue'
import emitter from '@/plugins/emitter'
const props = defineProps(['code'])

const addToBetslipLoading = ref(false)
const shareCodeLoading = ref(false)
const couponStore = useCouponStore()

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
  }, 1000)
}

function shareCode(data) {
  shareCodeLoading.value = true
  setTimeout(() => {
    shareCodeLoading.value = false
    emitter.emit('showBookBetModal', { data: data })
  }, 1000)
}
</script>

<style>
.booking-code-list-item {
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
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
}
.booking-code-list-item .header {
  background-color: #d6ebdc;
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
</style>

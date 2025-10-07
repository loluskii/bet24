<template>
  <div class="m-default">
    <div class="featured-code-container" v-if="codes.length">
      <div class="recommended-code" data-cms-key="recommended_code" data-cms-page="cashout">
        Recommended Code
      </div>
      <Codes :codes="codes" v-if="!codeHubLoading" />
      <LoadingSpinner v-else />
    </div>
    <p class="m-default-info">
      <span data-cms-key="please_insert_booking_code" data-cms-page="component_betslip"
        >Enter a booking code</span
      >
      <span class="m-dialog-tip"></span>
    </p>
    <div class="m-code-wrapper">
      <div
        class="m-default-code m-input-wap-wrapper"
        :class="{ 'm-input-wap-wrapper--error': isInvalidCode }"
      >
        <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
        <input
          type="input"
          name=""
          v-model="bookingCode"
          placeholder="Booking Code"
          class="m-input-wap fs-exclude"
        />
      </div>
    </div>
    <p v-if="isInvalidCode" class="code-error-info">
      {{ errorMesssage }}
    </p>

    <div
      class="share-code-btn"
      @click.prevent="loadBet"
      :class="[
        isLoading ? 'share-code-btn--disabled' : '',
        bookingCode == '' ? 'share-code-btn--disabled' : ''
      ]"
    >
      <span>Load</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { loadBetslipByCode, getNext7Days, getCodeHubItems } from '@/helpers'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { useRouter } from 'vue-router'
import Codes from '@/components/Home/Codes.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const isInvalidCode = ref()
const bookingCode = ref('')
const isLoading = ref(false)
const codeHubLoading = ref(true)
const couponStore = useCouponStore()
const router = useRouter()
const errorMesssage = ref('')
const codes = ref([])

async function loadBet() {
  isLoading.value = true
  isInvalidCode.value = false
  try {
    const res = await loadBetslipByCode(bookingCode.value)
    isLoading.value = false
    if (res.success) {
      if (res.data.selections.length) {
        couponStore.coupon.selections = res.data.selections
        couponStore.coupon.totalOdds = res.data.totalOdd
        couponStore.coupon.totalStake = res.data.stake
        couponStore.coupon.stake = res.data.stake
        couponStore.coupon.maxWin = res.data.possibleWin
        couponStore.coupon.source = 'mobile'
        if (res.data.selections.length === 1) {
          couponStore.coupon.bet_type = 'Single'
          couponStore.coupon.betslip_type = 'Single'
        } else {
          couponStore.coupon.bet_type = 'Multiple'
          couponStore.coupon.betslip_type = 'Multiple'
        }
        // emitter.emit('openBetslip')
        return router.push({ name: 'home' })
      } else {
        emitter.emit('showDialogueToaster', 'All selections have expired')
      }
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    isInvalidCode.value = true
    isLoading.value = false
    errorMesssage.value = error
  }
}

async function getCodes() {
  // codeHubLoading.value = true
  let payload = {
    from: getNext7Days()[0],
    to: getNext7Days()[7],
    betType: 0
  }
  const res = await getCodeHubItems(payload)
  codeHubLoading.value = false
  codes.value = res.data.data
}

onMounted(async () => {
  await getCodes()
})
</script>

<style scoped>
.booking-code-tip .m-dialog-head h1 {
  white-space: nowrap;
}
.booking-code-tip .m-dialog-body {
  font-size: 1.33333333rem;
}
.m-default {
  overflow-y: auto;
  padding: 1.66666667rem 0;
}
.m-default .m-default-info {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.33333333rem;
  font-weight: 700;
  padding-left: 1.66666667rem;
  text-align: left;
}
.m-default .m-default-info .m-dialog-tip {
  display: inline-block;
  padding-left: 0.41666667rem;
}
.m-default .m-default-info .m-dialog-tip::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-default .m-default-info .m-dialog-tip::before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  vertical-align: middle;
}
.m-default .m-code-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: no-wrap;
  -ms-flex-wrap: no-wrap;
  flex-wrap: no-wrap;
  padding: 0.83333333rem 1.66666667rem 0.91666667rem;
  width: 100%;
}
.m-default .m-code-wrapper .m-input-wap-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 2px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  height: 3.16666667rem;
  border-color: #dcdee5;
  border-color: var(--c-booking-code-input-border);
}
.m-default .m-code-wrapper .m-input-wap-wrapper .m-input-wap {
  height: 100%;
  line-height: 100%;
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}
.m-default .m-code-wrapper .m-input-wap-wrapper--active {
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-text-secondary);
}
.m-default .m-code-wrapper .m-input-wap-wrapper--error {
  border-color: #e41827;
  border-color: var(--warning-primary);
}
.m-default .m-code-wrapper .m-input-wap-wrapper .m-icon-delete::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-default .m-code-wrapper .m-input-wap-wrapper .m-icon-delete:before {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  border-radius: 1.66666667rem;
  display: inline-block;
  font-size: 1rem;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  text-align: center;
  width: 1.66666667rem;
  color: #353a45;
  color: var(--text-type1-primary);
}
.m-default .divider {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0.83333333rem 1.66666667rem 0;
  width: 100%;
}
.m-default .divider:before,
.m-default .divider:after {
  background: #9ca0ab;
  content: '';
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 0.08333333rem;
  position: relative;
}
.m-default .divider__mid {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1.5rem;
  text-align: center;
  width: 25%;
}
.share-code-btn {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  border-radius: 2px;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.066rem;
  height: 4rem;
  line-height: 4rem;
  margin: 0 1.66666667rem;
  text-align: center;
  color: #ffffff;
}
.share-code-btn:active {
  background: #32ce62;
  background: var(--brand-type3-secondary);
}
.share-code-btn--disabled {
  background: #dcdee5;
  background: var(--disable-brand-secondary);
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.share-code-btn--disabled:active {
  background: #dcdee5;
  background: var(--disable-brand-secondary);
}
.share-code-btn--loading {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  color: #ffffff;
  color: var(--brand-tertiary);
}
.share-code-btn--loading::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.share-code-btn--loading:before {
  -webkit-animation: circles-2895779b 1s infinite;
  animation: circles-2895779b 1s infinite;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  display: inline-block;
  vertical-align: top;
  color: #ffffff;
  color: var(--brand-tertiary);
}
.share-code-btn--loading > span {
  display: inline-block;
  padding-left: 0.83333333rem;
}
.m-tip {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1rem;
  margin: 13% 0;
  text-align: center;
}
.code-error-info {
  color: #e41827;
  color: var(--warning-primary);
  line-height: 1.3;
  margin-top: -0.58333333rem;
  padding-bottom: 0.33333333rem;
  text-align: center;
  width: 100%;
}

.loading-container {
  height: 18.33333333rem;
}
.featured-code-container {
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
}
.featured-code-container .recommended-code {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.33333333rem;
  font-weight: 700;
  margin: 1.04166667rem 0 1.04166667rem 1.66666667rem;
}
</style>

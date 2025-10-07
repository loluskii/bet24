<template>
  <div class="m-main-info">
    <div class="m-form-wrap">
      <div class="m-input-container">
        <div
          tabindex="6"
          class="m-input-wrapper"
          :class="{ 'm-input-wrapper--error': isInvalidCode }"
        >
          <span class="m-input-com"
            ><i class="m-input-icon m-input-icon--clickable m-icon-delete"></i>
            <input
              type="input"
              v-model="bookingCode"
              name=""
              placeholder="Booking Code"
              maxlength="10"
              onpaste="return true"
              class="m-input fs-exclude"
          /></span>
        </div>
      </div>
      <p v-if="isInvalidCode" class="m-code-err">
        {{ errorMesssage }}
      </p>

      <button
        class="af-button af-button--primary"
        @click.prevent="loadBet"
        :class="[isLoading ? 'is-disabled' : '', bookingCode == '' ? 'is-disabled' : '']"
      >
        <span>Load</span>
      </button>
      <div class="m-form-desc">
        A booking code enables you to book a bet. Odds or availabilities may change.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loadBetslipByCode } from '@/helpers'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { useRouter } from 'vue-router'

const isInvalidCode = ref()
const bookingCode = ref('')
const isLoading = ref(false)
const couponStore = useCouponStore()
const router = useRouter()
const errorMesssage = ref('')

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
        emitter.emit('openBetslip')
        return router.push({ name: 'home' })
      } else {
        emitter.emit('showDialogueToaster', 'All selections are expired')
      }
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    isInvalidCode.value = true
    isLoading.value = false
    errorMesssage.value = 'An error occured. Try again'
  }
}
</script>

<style scoped>
.m-main-info {
  padding: 1.66666667rem 1.33333333rem;
}
.m-main-info .m-form-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.m-main-info .m-form-wrap .m-input-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-bottom: 10px;
  width: 100%;
}
.m-main-info .m-form-wrap .m-input-container .m-input-wrapper {
  width: 100%;
}
.m-main-info .m-form-wrap .m-input-container .m-input-wrapper .m-input {
  border: 1px solid #979797;
  border-radius: 2px;
  font-size: 1.066rem;
  height: 3.33333333rem;
  max-width: 100%;
  padding-right: 0;
}
.m-main-info .m-form-wrap .m-input-container .m-input-wrapper--error .m-input {
  border: 1px solid;
  border-color: #e41827;
  border-color: var(--warning-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.m-main-info .m-form-wrap .m-input-container .m-input-wrapper--active .m-input {
  border: 1px solid var(--brand-highlight-text);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.m-main-info .m-form-wrap .af-button--primary {
  background: var(--brand-secondary);
  border: 0;
  border-radius: 2px;
  color: #ffffff;
  float: right;
  font-size: 1.066rem;
  font-weight: bold;
  height: 3.33333333rem;
  width: 100%;
}
.m-main-info .m-form-wrap .af-button--primary.is-disabled,
.m-main-info .m-form-wrap .af-button--primary.is-disabled:focus,
.m-main-info .m-form-wrap .af-button--primary.is-disabled:hover {
  background: #dcdee5;
  background: var(--disable-brand-secondary);
  color: #9ca0ab;
}
.m-main-info .m-form-wrap .m-code-err {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 1rem;
  line-height: 1.066rem;
  margin-bottom: 0.33333333rem;
  margin-top: 0.33333333rem;
  min-height: 1.066rem;
  text-align: center;
  width: 100%;
}
.m-main-info .m-form-wrap .m-form-desc {
  color: #9ca0ab;
  font-size: 1rem;
  line-height: 1.066rem;
  margin-top: 1.5rem;
}
.m-int {
  font-family: Roboto;
  font-size: 1.08333333rem;
}
.m-int .m-main-info {
  padding: 1.5rem 1.5rem 0;
}
.m-int .m-main-info .m-form-wrap .m-input-container {
  padding-bottom: 8px;
}
.m-int .m-main-info .m-form-wrap .m-input-container .m-input-wrapper .m-input {
  padding: 0.91666667rem 1.5rem;
}
.m-int .m-main-info .m-form-wrap .m-input-container .country-select {
  margin-right: 0.91666667rem;
}
.m-int .m-main-info .m-form-wrap .m-input-container .country-select.selected .af-select-title {
  background-color: #353a45;
  border-color: transparent;
  color: #ffffff;
  padding: 0 0.91666667rem;
  width: 10.66666667rem;
}
.m-int .m-main-info .m-form-wrap .m-input-container .country-select .af-select-title {
  border-radius: 0;
}
.m-int
  .m-main-info
  .m-form-wrap
  .m-input-container
  .country-select
  .af-select-title
  .af-select-icon-item {
  padding-left: 0.91666667rem;
  padding-right: 0;
}
.m-int
  .m-main-info
  .m-form-wrap
  .m-input-container
  .country-select
  .af-select-title
  .af-select-icon-item:before {
  color: #ffffff;
}
.m-int
  .m-main-info
  .m-form-wrap
  .m-input-container
  .country-select
  .af-select-title
  .af-select-input {
  padding: 0.91666667rem 0;
  text-align: center;
}
.m-int .m-main-info .m-form-wrap .af-button--primary {
  font-family: Roboto;
  font-size: 1.08333333rem;
  font-weight: normal;
  height: 2.5rem;
}
.m-int .m-desc-wrap-int {
  color: #353a45;
  color: var(--c-load-code-desc);
  font-weight: 400;
  letter-spacing: 0em;
  line-height: 1.66666667rem;
  margin-top: 1.5rem;
  text-align: left;
}
.m-int .m-desc-wrap-int .m-ways-wrap {
  color: #353a45;
  color: var(--c-load-code-desc);
  margin: 1.5rem 0 0;
  padding-left: 1.5rem;
}
.m-int .m-desc-wrap-int .m-ways-wrap ol {
  list-style: decimal;
}
.m-int .m-desc-wrap-int .m-ways-wrap ol li:not(:first-child) {
  padding-top: 1.08333333rem;
}
.m-int .m-desc-wrap-int .m-ways-wrap ol img {
  padding-top: 1.08333333rem;
}
.m-int .m-desc-wrap-int .m-share-wrap {
  padding: 1.5rem 0;
}

.m-input-wrapper {
  display: inline-block;
  font-size: 14px;
  line-height: normal;
  outline: none;
  position: relative;
}
.m-input-wrapper .m-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  max-width: 100%;
  outline: none;
  padding: 3px 10px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  color: #353a45;
  color: var(--text-type1-primary);
  /* background-color: #FAFAFA; */
  /* background-color: var(--background-general-primary); */
}
.m-input-wrapper .m-input::-webkit-input-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.m-input-wrapper .m-input::-moz-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.m-input-wrapper .m-input::-ms-input-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.m-input-wrapper .m-input::placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.m-input-wrapper .m-input-com {
  position: relative;
}
.m-input-wrapper .m-input-icon {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  height: 100%;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  visibility: hidden;
  width: 35px;
}
.m-input-wrapper .m-input-icon:before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  content: '\e602';
  display: inline-block;
  vertical-align: middle;
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-input-wrapper .m-input-icon + .m-input {
  padding-right: 12px;
}
.m-input-wrapper .m-input-icon.m-input-icon--show + .m-input {
  padding-right: 30px;
}
.m-input-wrapper .m-input-icon.m-input-icon--clickable:hover {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  cursor: pointer;
}
.m-input-wrapper .m-input-icon.m-input-icon--show {
  visibility: visible;
}

.m-input-wrapper.m-input-wrapper--disabled .m-input::-webkit-input-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.m-input-wrapper.m-input-wrapper--disabled .m-input::-moz-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.m-input-wrapper.m-input-wrapper--disabled .m-input::-ms-input-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.m-input-wrapper.m-input-wrapper--disabled .m-input::placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}
.m-input-wrapper.m-input-wrapper--error {
  border: none !important;
}
.m-input-wrapper.m-input-wrapper--error .m-input {
  border: 1px solid #e41827 !important;
  border-color: #e41827 !important;
  border-color: var(--warning-primary) !important;
}
.m-input-wrapper.m-input-wrapper--error.m-input-group--prepend .m-input-prepend {
  border: 1px solid #e41827;
  border-right: none;
  border-color: #e41827;
  border-color: var(--warning-primary);
}
.m-input-wrapper.m-input-wrapper--error.m-input-group--prepend .m-input {
  border-left: none !important;
}
.m-input-wrapper.m-input-wrapper--large {
  font-size: 16px;
}
.m-input-wrapper.m-input-wrapper--large .m-input {
  height: 42px;
}
.m-input-wrapper.m-input-wrapper--small {
  font-size: 13px;
}
.m-input-wrapper.m-input-wrapper--small .m-input {
  height: 30px;
}
.m-input-group {
  border-collapse: separate;
  display: inline-table;
  line-height: normal;
  width: 100%;
}
.m-input-group > .m-input {
  display: table-cell;
  vertical-align: middle;
}

.m-input-group .m-input-append .m-input,
.m-input-group .m-input-prepend .m-input {
  font-size: inherit;
}
</style>

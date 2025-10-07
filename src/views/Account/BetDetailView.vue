<template>
  <div class="m-bethistory">
    <div class="m-ticket-detail" style="position: relative">
      <HeaderOther :header-title="'Ticket Details'"></HeaderOther>
      <div>
        <div class="ticket-top">
          <div class="seperate ticket-info">
            <span data-cms-key="ticket_id_vid" data-cms-page="bet_history"
              >Ticket ID: {{ betDetail.betslipId }}</span
            >
            <span>{{ formatDate(betDetail.created, 'DD/MM HH:mm') }}</span>
          </div>
          <div class="bar seperate">
            <span class="type"
              ><span data-cms-key="multiple" data-cms-page="bet_history">{{
                betDetail.selections.length > 1 ? 'Multiple' : 'Single'
              }}</span>
            </span>

            <span
              class="status"
              :style="`${betDetail.statusCode === 1 ? 'color: #00c100; font-weight: bold' : ''}`"
              >{{ betDetail.statusDescription }}</span
            >
          </div>

          <div class="seperate stake-amount">
            <span class="left" data-cms-key="total_return" data-cms-page="bet_history"
              >Total Return</span
            >
            <span
              :style="`${betDetail.statusCode === 1 ? 'color: #00c100; font-weight: bold' : ''}`"
              >{{ betDetail.winnings ? formatNumber(betDetail.winnings) : '0.00' }}</span
            >
          </div>

          <div class="under-split">
            <div class="cash-info">
              <em></em>
              <div class="seperate">
                <span class="left">Total Stake</span>
                <span>{{ formatNumber(betDetail.stake) }}</span>
              </div>

              <div class="seperate">
                <span class="left">Total Odds</span>
                <span>{{ formatNumber(betDetail.totalOdd) }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="betDetail.statusCode !== 1"
            data-op="rebet-wrapper"
            class="rebet-wrapper seperate"
          >
            <div class="book-code-wrapper">
              <div>
                <span
                  class="book-code-text"
                  data-cms-key="booking_code"
                  data-cms-page="common_functions"
                  >Booking Code</span
                >
                <span class="book-code"> {{ betDetail.betslipId }} </span>
              </div>
              <div class="book-code-operator">
                <div :data-clipboard-text="betDetail.betslipId">
                  <div
                    @click="copyCode"
                    class="copy-icon icon-font-base"
                    style="font-size: 1.33333rem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-copy"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="rebet-btn-wrapper" @click="rebet">
              <div class="rebet-btn">
                <span v-if="!isRebetLoading">Rebet</span>
                <div v-else class="rebetting"></div>
              </div>
            </div>
          </div>
          <div v-if="betDetail.statusCode == 1" class="m-share">
            <img src="/winning.png" style="height: 100%; width: 100%" />
          </div>
        </div>
        <BetDetail
          v-for="(selection, s) in betDetail.selections"
          :key="s"
          :selection="selection"
        ></BetDetail>
        <div class="seperate bets-info">
          <span class="bets-num">Number of Bets: 1</span>
          <span class="to-bet-detail">Bet Details</span>
        </div>
        <div
          class="seperate bets-info to-trans"
          @click="$router.push({ name: 'account-transactions' })"
        >
          <span class="bets-num">Check Transaction History</span>
          <i class="arrow"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, watch, ref } from 'vue'
import BetDetail from '../../components/BetHistory/BetDetail.vue'
import HeaderOther from '../../components/HeaderOther.vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate, formatNumber, loadBetslipByCode } from '@/helpers'
import { useCouponStore } from '@/stores'
import emitter from '@/plugins/emitter'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const betDetail = ref()
const couponStore = useCouponStore()
const isRebetLoading = ref(false)

watch(
  () => route.params.bet_id,
  async (bet_id) => {
    await getBetDetails(bet_id)
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getBetDetails() {
  isLoading.value = true
  const res = localStorage.getItem('betDetail')
  betDetail.value = JSON.parse(res)
  isLoading.value = false
}

async function rebet() {
  isRebetLoading.value = true
  try {
    const res = await loadBetslipByCode(betDetail.value.betslipId)
    isRebetLoading.value = false
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
        emitter.emit('openBetslip')
        return router.push({ name: 'home' })
      } else {
        emitter.emit('showDialogueToaster', 'All selections have expired')
      }
    } else {
      throw Error
    }
  } catch (error) {
    emitter.emit('showDialogueToaster', 'Invalid booking code. ')
  }
}

function copyCode() {
  const textToCopy = betDetail.value.betslipId
  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(textToCopy)
    alert('Copied!')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}
defineComponent({
  components: { BetDetail, HeaderOther }
})
</script>

<style>
.rebetting::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.rebetting:before {
  -webkit-animation: circles 1s infinite;
  animation: circles 1s infinite;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  color: #ffffff;
  color: var(--brand-tertiary);
  display: inline-block;
  vertical-align: top;
}

.m-ticket-detail {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  font-size: 1rem;
}
.m-ticket-detail .seperate {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 1.33333333rem;
}

.m-ticket-detail .booking-code-layer {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  top: 0px;
  width: 100vw;
}
.m-ticket-detail .ticket-top {
  background-color: #1b1e25;
  color: #ffffff;
  color: var(--text-type2-primary);
  padding: 1rem 0 1.41666667rem;
  position: relative;
}
.m-ticket-detail .ticket-top .ticket-info {
  color: #ffffff;
  color: var(--text-type2-primary);
  opacity: 0.5;
  padding: 0 1.33333333rem;
}
.m-ticket-detail .ticket-top .green-color {
  color: #32ce62;
}
.m-ticket-detail .ticket-top .boost {
  font-size: 0.83333333rem;
  line-height: 2rem;
}
.m-ticket-detail .ticket-top .boost img {
  height: 0.83333333rem;
  margin-top: -0.25rem;
  width: 1.33333333rem;
}
.m-ticket-detail .ticket-top .bar {
  font-size: 1.33333333rem;
  padding: 0 1.33333333rem;
}
.m-ticket-detail .ticket-top .bar .cup::before {
  content: '\e626';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-ticket-detail .ticket-top .bar .cup::before {
  color: #32ce62;
  display: inline-block;
  margin-right: 0.41666667rem;
}

.m-ticket-detail .ticket-top .stake-info {
  color: #ffffff;
  color: var(--text-type2-primary);
  opacity: 0.7;
}
.m-ticket-detail .ticket-top .stake-amount span:first-child {
  font-size: 1.066rem;
}
.m-ticket-detail .ticket-top .stake-amount span:last-child {
  font-size: 1.66666667rem;
  font-weight: bold;
}
.m-ticket-detail .ticket-top .cash-info {
  font-size: 1.066rem;
  line-height: 1.57;
  margin-bottom: 0.91666667rem;
}
.m-ticket-detail .ticket-top .cash-info em {
  border-top: solid 0.08333333rem #353a45;
  border-color: #353a45;
  border-color: var(--line-type1-tertiary);
  display: block;
  padding-top: 0.83333333rem;
}
.m-ticket-detail .ticket-top .cash-info em:only-child {
  border-top: 0px;
  margin-bottom: 0px;
  padding-top: 0;
}
.m-ticket-detail .ticket-top .unavailable {
  font-size: 0.83333333rem;
  opacity: 0.5;
}
.m-ticket-detail .ticket-top .flexibet-tip {
  font-size: 0.83333333rem;
}
.m-ticket-detail .ticket-top .flexibet-tip .tip::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-ticket-detail .ticket-top .flexibet-tip .tip:before {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
  font-size: 1rem;
  padding-left: 0.41666667rem;
}
.m-ticket-detail .ticket-top .cashout-title {
  background-color: rgba(234, 236, 239, 0.15);
  color: #f2f3f5;
  color: var(--text-type2-secondary);
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin-bottom: 0.5rem;
}
.m-ticket-detail .ticket-top .cashout-title .fold {
  display: inline-block;
  margin-top: -1px;
  position: relative;
  top: 1px;
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}
.m-ticket-detail .ticket-top .cashout-title .fold::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-ticket-detail .ticket-top .cashout-title .fold::before {
  font-size: 0.83333333rem;
  left: 0.83333333rem;
  margin-right: 1.25rem;
  position: relative;
  top: 0.16666667rem;
}
.m-ticket-detail .ticket-top .cashout-title .unfold::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-ticket-detail .ticket-top .cashout-title .unfold::before {
  font-size: 0.83333333rem;
  left: 0.83333333rem;
  margin-right: 1.25rem;
  position: relative;
  top: 0.16666667rem;
}
.m-ticket-detail .ticket-top .cashout-detail {
  font-size: 1.066rem;
  line-height: 1.57;
}
.m-ticket-detail .ticket-top .split {
  border-bottom: solid 0.08333333rem #3a3c42;
  margin-top: 0.66666667rem;
  padding-bottom: 0.66666667rem;
}
.m-ticket-detail .ticket-top .left {
  opacity: 0.5;
}
.m-ticket-detail .m-share {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-top: solid 0.08333333rem #353a45;
  border-color: #353a45;
  border-color: var(--line-type1-tertiary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  margin-bottom: -1.41666667rem;
  /* margin-left: -1.33333333rem; */
}
.m-ticket-detail .m-share .m-btn--share {
  background-color: #fac111;
  border-radius: 0.16666667rem;
  color: #1b1e25;
  font-size: 1.066rem;
  font-weight: bold;
  height: 3.33333333rem;
  line-height: 3.33333333rem;
  text-align: center;
  width: 8.5rem;
  visibility: hidden;
}
.m-ticket-detail .rebet-wrapper {
  border-top: 1px solid rgba(234, 236, 239, 0.2);
  margin-top: 1.08333333rem;
  padding: 1rem 0px 0rem;
}
.m-ticket-detail .rebet-wrapper .book-code-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-ticket-detail .rebet-wrapper .book-code-wrapper .book-code-text {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  display: block;
  font-size: 0.83333333rem;
  margin-bottom: 0.5rem;
}
.m-ticket-detail .rebet-wrapper .book-code-wrapper .book-code {
  display: block;
  font-size: 1.33333333rem;
  font-weight: 500;
  line-height: 1;
}
.m-ticket-detail .rebet-wrapper .book-code-operator {
  color: #dcdee5;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-left: 1rem;
}
.m-ticket-detail .rebet-wrapper span:first-child .copy {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  display: inline-block;
  padding-left: 1.066rem;
}

.m-ticket-detail .rebet-wrapper .book-code-operator .copy-icon {
  margin-right: 0.66666667rem;
}
.m-ticket-detail .rebet-wrapper .rebet-btn-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-ticket-detail .rebet-wrapper .rebet-btn-wrapper .rebet-btn-info-icon {
  color: #9ca0ab;
  margin-right: 1rem;
}
.m-ticket-detail .rebet-wrapper .rebet-btn-wrapper .rebet-btn {
  background: var(--brand-highlight-text);
  background: var(--brand-secondary);
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-family: Roboto;
  font-size: 1.066rem;
  font-weight: 500;
  line-height: 1.66666667rem;
  padding: 1rem 0.66666667rem;
  text-align: center;
  width: 7.66666667rem;
}
.m-ticket-detail .rebet-wrapper .rebet-btn-wrapper .rebet-btn:active {
  background-color: #33ea6a;
}
.m-ticket-detail .bets-info {
  border-bottom: 0.08333333rem solid #f2f3f5;
  border-top: 0.08333333rem solid #f2f3f5;
  border-color: #f2f3f5;
  border-color: var(--background-type1-primary);
  padding: 1.5rem 1rem;
}
.m-ticket-detail .bets-info .arrow::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-ticket-detail .bets-info .arrow::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 0.83333333rem;
  left: 0.66666667rem;
  margin-right: 0.41666667rem;
  position: relative;
}
.m-ticket-detail .bets-info .bets-num {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.066rem;
}
.m-ticket-detail .sporty-green {
  color: #33ea6a;
}
.m-ticket-detail .text-gray {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.m-icon-copy::before {
  content: '\e6d2';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-icon-share::before {
  content: '\e63d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
</style>

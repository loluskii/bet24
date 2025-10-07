<template>
  <div class="m-sportBets">
    <div style="width: 100%; height: 87px"></div>
    <BetHistoryHeader :active="'open_bets'"></BetHistoryHeader>

    <div
      v-if="!isAuthenticated"
      class="m-error-wrapper"
      style="margin-top: 20px; text-align: center"
    >
      <div>
        <span class="m-error-msg">Please Log In to see your Open Bets and Cashout Bets</span>
        <div class="m-btn" @click="$router.push('/sign-in')">Login</div>
      </div>
      <div v-if="codes.length" class="empty-recommended-code-container">
        <div class="recommended-code">
          <span data-cms-key="recommended_code" data-cms-page="cashout">Recommended Codes</span>
        </div>
        <div class="code-hub-list-item-container" style="position: relative">
          <CodeHubItem v-for="code in codes" :code="code" :key="code.betslipId" />
          <div class="mb-3"></div>
        </div>
      </div>
    </div>

    <div v-else style="margin-top: 20px">
      <template v-if="!openBets">
        <div v-if="!openBets & !isLoading">
          <div class="m-error-wrapper" style="text-align: center">
            <span class="m-error-msg"> You currently have no Open Bets. </span>
          </div>
          <div v-if="codes.length" class="empty-recommended-code-container">
            <div class="recommended-code">
              <span data-cms-key="recommended_code" data-cms-page="cashout"
                >Recommended Football Codes</span
              >
            </div>
            <div class="code-hub-list-item-container" style="position: relative">
              <div class="m-loading-wrap m-loading-wrap__center">
                <div class="m-loading light">
                  <div class="loading"></div>
                </div>
              </div>
              <CodeHubItem v-for="code in codes" :code="code" :key="code.betslipId" />
              <div class="mb-3"></div>
            </div>
          </div>
        </div>
        <div v-if="isLoading">
          <LoadingSpinner />
        </div>
      </template>
      <div v-else class="m-openbet">
        <div class="m-sportsBet--bets cashout-loading">
          <ul class="m-bet-list">
            <li v-for="(bet, index) in openBets" :key="index" class="m-bet-item">
              <div class="m-item-wrap">
                <div class="m-title">
                  <div>
                    <span class="m-t-14 m-t-bold m-t-black">
                      {{ bet.betCategory }}
                    </span>
                    <span v-if="bet.hasLiveSelection"
                      ><span class="m-i-live bg-green-200 m-t-b5">Live</span></span
                    >
                  </div>
                  <div class="actions">
                    <span class="divider"></span>
                    <div style="color: #322c84" @click="shareTicket"></div>
                  </div>
                </div>
                <div @click="showChild($event, bet.betslipId)">
                  <ul class="m-against" :id="bet.betslipId + '_bop'">
                    <li
                      v-for="event in bet.selections.slice(0, 3)"
                      :key="event.id"
                      class="f-flex m-t-black m-t-14"
                    >
                      <span class="m-ellipsis">{{ event.eventName }}</span>
                    </li>
                  </ul>
                  <ul :id="bet.betslipId + '_child'" class="m-bet-sel d-none">
                    <li v-for="event in bet.selections" :key="event.id" class="f-flex">
                      <div class="m-l-left m-t-12 m-t-l16 m-t-bold m-t-dark">
                        <span v-if="event.statusDescription === 'Lost'">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="red"
                            class="bi bi-x-octagon-fill"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"
                            />
                          </svg>
                        </span>
                        <span v-if="event.statusDescription === 'Won'">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="green"
                            class="bi bi-shield-fill-check"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
                            />
                          </svg>
                        </span>
                        <span v-if="event.statusDescription === 'Pending'">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="grey"
                            class="bi bi-clock-fill"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
                            />
                          </svg>
                        </span>
                      </div>
                      <div class="m-l-right f-flex-item">
                        <div class="m-t-14 m-t-l16 m-t-dark f-wrap">
                          <i class="m-r-5" :class="'m-icon-' + event.sport"></i>
                          <span class="m-r-5 m-t-bold">{{ event.outcomeName }}</span>
                          <span class="m-t-bold m-r-5 m-b-5"> @ {{ event.odds.toFixed(2) }} </span>
                          <span class="m-t-14 m-t-gray m-b-5">
                            {{ event.marketName }}
                          </span>
                        </div>
                        <div class="m-live-odds" v-if="event.type === 'live'">
                          <template
                            v-if="
                              event.isLive &&
                              event.currentOdds > 1 &&
                              (event.matchStatus
                                ? event.matchStatus.toLowerCase() !== 'not started'
                                : '')
                            "
                          >
                            <div>
                              <span class="bg-green-200 p-1">Live Odds</span>
                              <span class="p-l-5" style="font-weight: bold">{{
                                event.currentOdds.toFixed(2)
                              }}</span>
                            </div>
                          </template>

                          <div
                            v-else-if="event.isLive && event.currentOdds >= 1"
                            class="m-odds-desc m-b-5"
                          >
                            Live Odds Suspended
                          </div>
                        </div>

                        <div @click="goToEvent(event)" class="m-aginst m-t-black m-t-14">
                          <span>
                            {{ event.eventName }}
                          </span>
                        </div>
                        <div
                          v-if="
                            event.matchStatus
                              ? event.matchStatus.toLowerCase() === 'not started'
                              : ''
                          "
                          class="m-score"
                        >
                          <span class="m-t-12 capitalize m-t-gray">
                            {{ formatDate(event.eventDate, 'DD/MM HH:mm') }}
                          </span>
                          <span class="m-t-12"></span>
                        </div>
                        <div v-else class="m-score" style="color: var(--brand-secondary)">
                          <span class="m-t-12 capitalize">
                            {{
                              !event.isLive ? 'FT' : `${event.eventTime} ${getMatchStatus(event)}`
                            }}
                          </span>
                          <span class="m-t-12" style="font-weight: bold">
                            {{ ` | ${event.score}` }}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="m-money f-flex m-t-black f-btwn m-t-12">
                  <div class="m-money__lr m-r-20">
                    <div>Stake</div>
                    <div class="m-t-bold amount m-t-14">
                      {{ bet.stake }}
                    </div>
                  </div>
                  <div class="m-money__lr align-r">
                    <div class="label">Pot. Win</div>
                    <div class="m-t-bold m-t-ml6 m-t-14 amount">
                      {{ formatNumber(bet.possibleWin) }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="bet.statusDescription === 'Pending'"
                  class="m-btn-wrapper"
                  :class="{ disabled: !bet.cashOutAmount }"
                >
                  <button
                    :disabled="!bet.cashOutAmount || cashingOut || bet.isBonusBet"
                    @click.prevent="handleCashout(bet)"
                    type="button"
                    class="m-btn--cashout"
                  >
                    <span v-if="!cashingOut">{{
                      bet.cashOutAmount && bet.cashOutAmount > 0 && !bet.isBonusBet
                        ? `Cashout ${SportsbookGlobalVariable.CurrencyCode} ${bet.cashOutAmount.toFixed(2)}`
                        : 'Cashout Unavailable'
                    }}</span>
                    <img v-else src="/loader.gif" height="24" width="24" alt="" srcset="" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="showCashoutModal" class="m-sportBets m-cashout">
        <div id="j_pop_cashout" class="m-cashout-pop">
          <div class="m-mask"></div>
          <div class="m-container m-container-fix">
            <div class="m-close" @click="closeCashoutModal"></div>
            <div class="m-main">
              <div class="m-head f-alg-side">
                <div class="f-alg-side-item">
                  <div class="m-t-12 m-t-l16 m-t-gray">Stake</div>
                  <div class="m-t-14 m-t-l16 m-t-default">
                    {{ cashoutData.stake.toFixed(2) }}
                  </div>
                </div>
                <div class="f-alg-side-item">
                  <div class="m-t-12 m-t-l16 m-t-gray">Pot. Win</div>
                  <div class="m-t-14 m-t-l16 m-t-default">
                    {{ cashoutData.possibleWin.toFixed(2) }}
                  </div>
                </div>
              </div>
              <div class="m-body instant">
                <div class="m-t-center m-l-top">
                  <div class="m-t-20 m-t-default m-t-bold m-total">
                    <span data-cms-key="partial_cashout" data-cms-page="cashout"
                      >Full Cashout
                    </span>
                    <div class="number-grow-warp">
                      <span class="number-grow">{{ cashoutData.cashOutAmount.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
                <div class="m-btn-wrapper">
                  <div>
                    <button @click.prevent="confirmCashout" class="af-button af-button--primary">
                      <span v-if="!cashingOut"
                        ><span>Confirm</span>
                        <span class="money">
                          {{ SportsbookGlobalVariable.CurrencyCode }}
                          {{ cashoutData.cashOutAmount.toFixed(2) }}
                        </span>
                      </span>
                      <img v-else src="/loader.gif" height="24" width="24" alt="" srcset="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BetHistoryHeader from '@/components/BetHistoryHeader.vue'
// import BetHistoryMatchList from '@/components/BetHistoryMatchList.vue'
import CodeHubItem from '@/components/CodeHub/CodeHubItem.vue'
import OpenBet from '@/components/BetHistory/OpenBet.vue'
import { ref, defineComponent, onMounted, onUnmounted } from 'vue'
import {
  getBets,
  formatNumber,
  formatDate,
  slugify,
  getNext7Days,
  getCodeHubItems
} from '@/helpers'
import { useAuthStore, useUtilsStore } from '@/stores'
import $ from 'jquery'
import { useUsersStore } from '@/stores'
import { CLIENT_ID, performCashout } from '@/helpers'
import emitter from '@/plugins/emitter'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const openBets = ref(null)
const isLoading = ref(true)
const { isAuthenticated } = useAuthStore()
const { SportsbookGlobalVariable } = useUtilsStore()
const userStore = useUsersStore()
const showCashoutModal = ref(false)
const cashoutData = ref({})
const cashingOut = ref(false)
const codes = ref([])
const router = useRouter()
const intervalId = ref()

const getMatchStatus = (event) => {
  return event.matchStatus == '1st half'
    ? 'H1'
    : event.matchStatus == '2nd half'
      ? 'H2'
      : event.matchStatus
}

async function getBetsData() {
  try {
    let payload = {
      clientId: CLIENT_ID,
      date: '',
      status: 0,
      userId: userStore.currentUser.id
    }
    const res = await getBets(payload)
    openBets.value = res.bets
    res.bets.forEach((bet) => {
      let hasLiveSelection = bet.selections.filter((s) => s.type === 'live')
      if (hasLiveSelection.length > 0) {
        bet.hasLiveSelection = true
      } else {
        bet.hasLiveSelection = false
      }
    })
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
  }
}

async function getCodes() {
  let payload = {
    from: getNext7Days()[0],
    to: getNext7Days()[7],
    betType: 0
  }
  const res = await getCodeHubItems(payload)
  codes.value = res.data.data.slice(0, 10)
}

function closeCashoutModal() {
  if (!cashingOut.value) {
    showCashoutModal.value = false
  } else {
    return
  }
}

function handleCashout(bet) {
  // console.log(bet);
  showCashoutModal.value = true
  cashoutData.value = bet
}

async function confirmCashout() {
  cashingOut.value = true
  const res = await performCashout({
    betId: cashoutData.value.id,
    amount: cashoutData.value.cashOutAmount
  })
  cashingOut.value = false
  showCashoutModal.value = false

  if (res.success) {
    console.log('cashout successful')
    emitter.emit('showDialogueToaster', 'Cashout Successful!')
    await getBetsData()
  } else {
    emitter.emit('showDialogueToaster', res.message)
  }
}

function goToEvent(event) {
  if (!event.isLive) {
    return router.push({
      name: 'fixtures-detail',
      params: {
        sport: slugify(event.sport),
        tournament_name: slugify(event.tournament),
        event_name: slugify(event.eventName),
        event_id: event.matchId
      }
    })
  } else {
    return router.push({
      name: 'live-fixtures-detail',
      params: {
        sport: slugify(event.sport),
        tournament_name: slugify(event.tournament),
        event_name: slugify(event.eventName),
        event_id: event.matchId
      }
    })
  }
}

// const remainingMatchesCount = (matches) => {
//   return Math.max(0, matches.length - 2)
// }

// const getSportbyName = (name) => {
//   return utilsStore.sportsMenu.find((x) => x.sportName == name)
// }

function showChild(e, index) {
  let y = $(e.target).hasClass('hide')
  if (y) {
    $(e.target).removeClass('hide')
  } else {
    $(e.target).addClass('hide')
  }
  $('#' + index + '_bop').toggleClass('d-none')
  $('#' + index + '_child').toggleClass('d-none')
}

onMounted(async () => {
  getCodes()
  if (isAuthenticated) {
    getBetsData()

    intervalId.value = setInterval(() => {
      getBetsData()
    }, 10000)
  }
})

onUnmounted(() => {
  clearInterval(intervalId.value)
})

defineComponent({
  name: 'open-bets',
  components: { BetHistoryHeader }
})
</script>

<style scoped>
@import url('@/assets/css/bet-history.css');
.m-btn--text {
  color: var(--brand-highlight-text);
}
.m-btn--text + .m-btn {
  margin-top: 1.66666667rem;
}
.no_bets {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1rem;
  line-height: 1.19333333rem;
  padding: 1.66666667rem 0 1.91666667rem;
  text-align: center;
}
.no_bets .content {
  margin-top: 0.66666667rem;
}
.none-login-wrapper .login-tip {
  margin: 0 auto;
  padding: 2.33333333rem 0;
  text-align: center;
}
.none-login-wrapper .login-tip .error-msg {
  color: #353a45;
  color: var(--text-type1-primary);
  display: block;
  font-size: 1rem;
  line-height: 1.58333333rem;
  margin: 0 auto 1.33333333rem;
  width: 17.08333333rem;
}
.none-login-wrapper .login-tip .login-btn {
  border: 1px solid var(--brand-secondary);
  border-radius: 0.25rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: var(--brand-secondary);
  display: inline-block;
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  min-width: 4.66666667rem;
  padding: 0 0.58333333rem;
}
.empty-recommended-code-container .recommended-code {
  color: #353a45;
  color: var(--text-type1-primary);
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.33333333rem;
  font-weight: 700;
  padding-left: 0.66666667rem;
  padding-top: 2.66666667rem;
}
.empty-recommended-code-container .recommended-code span {
  display: inline-block;
  /* margin-left: 1rem; */
}
.empty-recommended-code-container .code-hub-list-item-container {
  padding-top: 0.66666667rem;
  padding-bottom: 0.66666667rem;
  position: relative;
}
.code-hub-list-item-container .code-hub-list-item-wrap + .code-hub-list-item-wrap {
  margin-top: 0.66666667rem;
}
</style>

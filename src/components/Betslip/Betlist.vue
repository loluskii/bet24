<template>
  <div class="x-main-right" @click="closeBetslip($event)">
    <div id="betslip-container" :class="betslipMode ? 'betslip-mode-sim' : 'betslip-mode-real'">
      <div
        class="m-betslips m-betslips-show"
        v-show="!isPlaceBetSuccessful && !isBookBetSuccessful"
        style="position: absolute"
        id="m-betslips-show"
      >
        <div class="m-betslip-header" :class="betslipMode ? 'sim-theme' : 'real-theme'">
          <div class="head-container">
            <div class="wrapper separate-part">
              <div class="operate-button">
                <div class="d-flex align-items-center">
                  <template v-if="SIM_ENABLED">
                    <span
                      class="d-flex justify-content-center align-items-center mr-2 font-weight-bold"
                      :style="
                        betslipMode
                          ? 'background-color: #ffd600; color: #000'
                          : 'background-color: var(--brand-secondary); color: #fff'
                      "
                      style="font-size: 13px; height: 30px; width: 30px; border-radius: 50%"
                      >{{ betslipSelections.length }}
                    </span>
                    <BetslipModeToggle />
                  </template>
                  <span v-else style="font-weight: bold; font-size: 1.2rem; margin-right: 20px"
                    >Betslip</span
                  >
                </div>
              </div>
              <div class="operate-button">
                <span class="currency">{{ SportsbookGlobalVariable.CurrencyCode }}</span>
                <span> {{ usersStore.balance }}</span>
              </div>
            </div>
            <template v-if="betslipSelections.length > 0">
              <div style="margin: 20px 0px 20px 0px"></div>
              <div v-if="!isSimulating" class="wrapper separate-part">
                <div
                  @click="clearBetslip"
                  class="remove-all operate-button"
                  style="display: flex; align-items: center"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="white"
                    height="18"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label=""
                    class="trash-icon kz-icon-xxs icon--color-slate mr-1"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#FFFFFF"
                      d="M7.3883 6.71564V10.997C7.3883 11.894 6.04273 11.894 6.04273 10.997V6.71564C6.04273 5.81859 7.3883 5.81859 7.3883 6.71564zM9.95711 10.997V6.71564C9.95711 5.81859 8.61154 5.81859 8.61154 6.71564V10.997C8.61154 11.894 9.95711 11.894 9.95711 10.997z"
                    ></path>
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#FFFFFF"
                      fill-rule="evenodd"
                      d="M10.8134 2.86243C10.8134 2.01795 10.1288 1.33337 9.28432 1.33337H6.71552C5.87104 1.33337 5.18646 2.01795 5.18646 2.86243V3.04591H2.00603C1.63447 3.04591 1.33325 3.34713 1.33325 3.7187C1.33325 4.09026 1.63447 4.39148 2.00603 4.39148H2.67141L3.41117 13.2643C3.47691 14.0569 4.13959 14.6668 4.93511 14.6667H11.0654C11.8608 14.6668 12.5234 14.0569 12.5892 13.2642L13.3285 4.39148H13.9938C14.3654 4.39148 14.6666 4.09026 14.6666 3.7187C14.6666 3.34713 14.3654 3.04591 13.9938 3.04591H10.8134V2.86243ZM9.46781 3.04591V2.86243C9.46781 2.76109 9.38566 2.67894 9.28432 2.67894H6.71552C6.61418 2.67894 6.53203 2.76109 6.53203 2.86243V3.04591H9.46781ZM11.9782 4.39148H4.02165L4.75211 13.1528C4.76 13.248 4.83952 13.3211 4.93505 13.3211H11.0654C11.1609 13.3211 11.2404 13.248 11.2483 13.1528L11.9782 4.39148Z"
                      clip-rule="evenodd"
                    ></path>
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#FFFFFF"
                      d="M7.3883 6.71564V10.997C7.3883 11.894 6.04273 11.894 6.04273 10.997V6.71564C6.04273 5.81859 7.3883 5.81859 7.3883 6.71564zM9.95711 10.997V6.71564C9.95711 5.81859 8.61154 5.81859 8.61154 6.71564V10.997C8.61154 11.894 9.95711 11.894 9.95711 10.997z"
                    ></path>
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#FFFFFF"
                      fill-rule="evenodd"
                      d="M10.8134 2.86243C10.8134 2.01795 10.1288 1.33337 9.28432 1.33337H6.71552C5.87104 1.33337 5.18646 2.01795 5.18646 2.86243V3.04591H2.00603C1.63447 3.04591 1.33325 3.34713 1.33325 3.7187C1.33325 4.09026 1.63447 4.39148 2.00603 4.39148H2.67141L3.41117 13.2643C3.47691 14.0569 4.13959 14.6668 4.93511 14.6667H11.0654C11.8608 14.6668 12.5234 14.0569 12.5892 13.2642L13.3285 4.39148H13.9938C14.3654 4.39148 14.6666 4.09026 14.6666 3.7187C14.6666 3.34713 14.3654 3.04591 13.9938 3.04591H10.8134V2.86243ZM9.46781 3.04591V2.86243C9.46781 2.76109 9.38566 2.67894 9.28432 2.67894H6.71552C6.61418 2.67894 6.53203 2.76109 6.53203 2.86243V3.04591H9.46781ZM11.9782 4.39148H4.02165L4.75211 13.1528C4.76 13.248 4.83952 13.3211 4.93505 13.3211H11.0654C11.1609 13.3211 11.2404 13.248 11.2483 13.1528L11.9782 4.39148Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>

                  <span>Remove all</span>
                </div>
                <div class="wrapper separate-part" @click="showBetSettings = true">
                  <div class="bet-settings bet-settings operate-button flex">
                    <div class="icon icon-font-base mr-1" style="font-size: 1.33333rem"></div>
                    <span>Bet Settings</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="betslipMode" class="betslip-notification">
          <div class="sim-operate-sync-to-real-tip">
            <b>SIMULATE</b> allows you to play your selections in a virtual format
          </div>
        </div>
        <div class="m-bet-head" v-if="showBetHead">
          <div class="m-snap-nav-wrap m-list-bet-type" style="overflow: hidden">
            <ul class="m-snap-nav flex">
              <li
                :class="betSlipType !== 'Combo' && betType === 'Single' ? 'active' : ''"
                @click="couponStore.setBetType('Single')"
                class="m-list-bet-type-item m-snap-nav-item"
                data-op="betslip-multi-tag-single"
              >
                <span data-cms-key="singles">Single</span>
              </li>
              <li
                :class="betSlipType !== 'Combo' && betType === 'Multiple' ? 'active' : ''"
                @click="couponStore.setBetType('Multiple')"
                class="flex flex-center m-list-bet-type-item m-snap-nav-item"
                data-op="betslip-multi-tag-multi"
              >
                <span data-cms-key="multiple">Multiple</span>
              </li>
              <li
                :class="betSlipType === 'Combo' ? 'active' : ''"
                @click="couponStore.setBetType('Combo')"
                class="m-list-bet-type-item m-snap-nav-item"
                data-op="betslip-multi-tag-system"
              >
                <span data-cms-key="system">System</span>
              </li>
            </ul>
            <i class="controls left-controls"></i>
            <i class="controls right-controls"></i>
          </div>
          <!-- Odd Change Notification -->
          <div class="betslip-notification" v-if="!couponStore.coupon.acceptChanges">
            <div class="change-wrong-message">Note: changes in odds or availability</div>
          </div>
        </div>
        <div
          v-if="betslipSelections.length > 0 && !isSimulating"
          class="m-bet-detail-wrap"
          :class="betslipMode ? 'sim-theme' : 'real-theme'"
        >
          <div class="m-scroll">
            <div id="j_betList" class="m-betslips-outcomes">
              <div class="m-outcomes-list">
                <BetListEvent
                  v-for="(selection, index) in betslipSelections"
                  :key="index"
                  :selection="selection"
                  :betSlipType="betSlipType"
                  :betType="betType"
                  :active-selection-id="activeSelectionInput"
                  @on-selection-input="setActiveSelectionInput"
                  @toggle-betslip="$emit('toggle-betslip')"
                >
                </BetListEvent>
              </div>
            </div>

            <SystemBet 
              v-if="betSlipType === 'Combo'" 
              :betSlipType="betSlipType"
            />

            <BetListStake
              @toggle-show="toggleShow"
              @toggle-betslip="$emit('toggle-betslip')"
              @book-bet="bookBet"
              :betSlipType="betSlipType"
              :betType="betType"
              :isSimulate="betslipMode"
            ></BetListStake>
          </div>
          <Transition>
            <div v-if="(show && !betslipLoading) || (!show && betslipLoading)">
              <div class="confirm-overlap"></div>
              <div
                v-if="show"
                class="confirm-wrap"
                :class="betslipMode ? 'sim-theme' : 'real-theme'"
              >
                <div class="m-flexibet-confirm confirm">
                  <div class="about-to-pay">
                    <span>Confirm to Pay</span><span>&nbsp;</span>
                    <div>
                      <div class="stake-num">
                        {{ SportsbookGlobalVariable.CurrencyCode }}
                        {{ totalStake }}
                      </div>
                    </div>
                  </div>
                  <div class="blank-area"></div>
                </div>
                <div class="button-wrap">
                  <button @click="toggleShow" class="af-button flexibet-cancel af-button--primary">
                    <span><span data-cms-key="cancel">Cancel </span></span>
                  </button>
                  <button
                    class="af-button flexibet-confirm af-button--primary"
                    @click.prevent="placeBet"
                  >
                    <span><span data-cms-key="confirm">Confirm</span></span>
                  </button>
                </div>
              </div>
              <!-- Place Bet Submit Modal -->
              <Transition>
                <div
                  v-if="!show && betslipLoading"
                  class="confirm-wrap"
                  :class="betslipMode ? 'sim-theme' : 'real-theme'"
                >
                  <div class="submit" :class="betslipMode ? 'sim-theme' : 'real-theme'">
                    <span style="color: #fff"> Submitting </span>
                  </div>
                </div>
              </Transition>
              <!-- Place Bet Submit Modal -->
            </div>
          </Transition>
        </div>
        <BetlistBookingCode
          v-if="betslipSelections.length === 0 && !betslipMode"
        ></BetlistBookingCode>
        <div v-if="betslipSelections.length === 0 && betslipMode" class="sim-selection-empty-panel">
          <p>Please add at least one outcome.</p>
        </div>
        <Simulation
          v-if="isSimulating && betslipMode && simulationResults"
          :simulation-results="simulationResults"
          @exit="handleSimulationExit"
        />
      </div>
      <!-- Place Bet Success Modal -->
      <SuccessBet
        @hide-success="hideAll"
        :response="placeBetResponse"
        @activate-share="bookBet"
        @rebet="rebet"
        v-if="placeBetStatus"
      ></SuccessBet>
      <!-- Place Bet Success Modal -->
      <!-- Book Bet Modal -->
      <BookBetModal
        v-if="isBookBetSuccessful"
        @hide-modal="hideBookBetModal"
        :betDetails="bookBetResponse"
      >
      </BookBetModal>
      <!-- Book Bet Modal -->
      <!-- <BetSettings @close="showBetSettings = false" v-if="showBetSettings" /> -->
    </div>
  </div>
</template>

<script setup>
import BetListEvent from "@/components/Betslip/BetListEvent.vue";
import BetListStake from "@/components/Betslip/BetListStake.vue";
import BookBetModal from "@/components/Betslip/BookBetModal.vue";
import SuccessBet from "@/components/Betslip/SuccessBet.vue";
import { computed, ref, defineComponent, onMounted } from "vue";
import { useCouponStore, useUsersStore } from "@/stores";
import { formatNumber, SIM_ENABLED, SIM_ALLOWED_MARKETS, awardBonus } from "@/helpers";
import emitter from "@/plugins/emitter";
import BetlistBookingCode from "./BetlistBookingCode.vue";
import BetSettings from "./BetSettings.vue";
import Simulation from "./Simulation.vue";
import BetslipModeToggle from "./BetslipModeToggle.vue";
import { useUtilsStore } from "@/stores";
import VueToggles from "vue-toggles";
import SystemBet from "./SystemBet.vue";

const emit = defineEmits(['toggle-betslip', 'update-betcount'])
const couponStore = useCouponStore()
const { SportsbookGlobalVariable } = useUtilsStore()
const show = ref(false)
const placeBetStatus = ref(false)
const isPlaceBetSuccessful = ref(false)
const isBookBetSuccessful = ref(false)
const placeBetResponse = ref({})
const bookBetResponse = ref({})
const usersStore = useUsersStore()
const activeSelectionInput = ref()
const showBetSettings = ref(false)
const simulationResults = ref(null)

const value = ref(false)

const betSlipType = computed(() => {
  return couponStore.coupon.betslip_type
})

const betType = computed(() => {
  return couponStore.coupon.bet_type
})

const betslipSelections = computed(() => {
  return couponStore.coupon.selections
})

const totalStake = computed(() => {
  return formatNumber(couponStore.coupon.totalStake)
})

const betslipLoading = computed(() => {
  return couponStore.isBetslipLoading
})

const betslipMode = computed(() => {
  return couponStore.betslipMode
})

const isSimulating = computed(() => {
  return couponStore.isSimulating
})

const showBetHead = computed(() => {
  return betslipSelections.value.length > 1 && !betslipMode.value
})

const updateBetslipMode = () => {
  couponStore.mode = betslipMode.value ? 'real' : 'sim'
}

function closeBetslip(e) {
  if (e && e.target.classList.contains('x-main-right')) {
    if (betslipMode.value && isSimulating.value) return
    emit('toggle-betslip')
  }
}

function toggleShow() {
  show.value = !show.value
}

function bookBet(data) {
  placeBetStatus.value = false
  isPlaceBetSuccessful.value = false
  placeBetResponse.value = {}
  isBookBetSuccessful.value = true
  bookBetResponse.value = data
}

async function placeBet(e) {
  if (couponStore.isBetslipLoading || couponStore.isSimulating) return

  show.value = false
  couponStore.isBetslipLoading = true
  let bonusId = null
  if (couponStore.coupon.useCashback) {
    bonusId = usersStore.activeCashback ? usersStore.activeCashback.id : null
    try {
      const bonus = {
        bonusId: bonusId,
        amount: totalStake.value,
        username: usersStore.currentUser.username
      }
      await awardBonus(bonus)
    } catch (error) {
      emitter.emit('showErrorMessage', 'Failed to activate Cashback!')
      return
    }
  }

  try {
    const res = await couponStore.placeBet(e, 'bet', bonusId)
    couponStore.isBetslipLoading = false

    if (res?.success) {
      if (betslipMode.value) {
        try {
          couponStore.isSimulating = true
          simulationResults.value = res.data
          document.getElementById('m-betslips-show')?.classList.add('is-simulating')
        } catch (error) {
          console.error('Error starting simulation:', error)
          emitter.emit('showErrorMessage', 'Failed to start simulation. Please try again.')
          couponStore.isSimulating = false
          simulationResults.value = null
        }
      } else {
        isPlaceBetSuccessful.value = true
        placeBetStatus.value = true
        placeBetResponse.value = res
      }
      await usersStore.loadCurrentUser()
      emit('update-betcount')
    } else {
      emit('toggle-betslip')
      emitter.emit('showErrorMessage', res?.message || 'Failed to place bet')
    }
  } catch (error) {
    console.error('Error placing bet:', error)
    couponStore.isBetslipLoading = false
    emit('toggle-betslip')
    emitter.emit('showErrorMessage', error?.message || 'An unexpected error occurred')
  }
}

function handleSimulationExit() {
  couponStore.isSimulating = false
  simulationResults.value = null
}

async function hideAll() {
  placeBetStatus.value = false
  isPlaceBetSuccessful.value = false
  placeBetResponse.value = {}
  couponStore.clearBetslip()
  emit('toggle-betslip')
}

async function rebet() {
  placeBetStatus.value = false
  isPlaceBetSuccessful.value = false
  placeBetResponse.value = {}
  emit('toggle-betslip')
}

function hideBookBetModal() {
  isBookBetSuccessful.value = false
  bookBetResponse.value = {}
  emit('toggle-betslip')
}
function clearBetslip() {
  return couponStore.clearBetslip()
}

function setActiveSelectionInput(data) {
  activeSelectionInput.value = data
}

const validateSimulationMarkets = (selections) => {
  if (!betslipMode.value) return true

  try {
    const invalidMarkets = selections.filter(
      (selection) => !SIM_ALLOWED_MARKETS.includes(parseInt(selection.market_id))
    )

    if (invalidMarkets.length > 0) {
      const marketNames = invalidMarkets.map((m) => m.market_name).join(', ')
      emitter.emit(
        'showErrorMessage',
        `The following markets are not supported in simulation mode: ${marketNames}`
      )
      return false
    }
    return true
  } catch (error) {
    console.error('Error validating simulation markets:', error)
    emitter.emit('showErrorMessage', 'Error validating markets for simulation')
    return false
  }
}

defineComponent({
  name: 'bet-list'
})

onMounted(() => {})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

.m-betslip-header {
  background: var(--background-type2-secondary);
  color: #ffffff;
  color: var(--text-type2-primary);
  padding: 1.33333333rem 1.33333333rem 1.3rem 1.3rem;
}

.m-betslip-header .betslip-text {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.75rem;
  margin-left: 0.33333333rem;
  margin-right: auto;
}

.m-betslip-header .wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-betslip-header .wrapper .wrapper-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  -ms-flex: 2;
  flex: 2;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: justify;
  justify-content: center;
}

.betslip-notification .change-wrong-message {
  background: #7b0911;
  background: var(--warning-secondary);
  color: #ffffff;
  height: 1.83333333rem;
  line-height: 1.83333333rem;
  text-align: center;
}

.betslip-notification .sim-operate-sync-to-real-tip {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #1b1e25;
  font-family: 'Roboto-Bold';
  font-size: 1rem;
  padding: 0.33333333rem 0.8rem;
}

.betslip-notification .sim-duplicated-match-error {
  background-color: #bf1420;
  color: #ffffff;
  font-family: 'Roboto-Bold';
  font-size: 1rem;
  line-height: 1.83333333rem;
  text-align: center;
}

.m-betslip-header .wrapper .wrapper-item.bet-info-panel {
  position: relative;
}

.m-betslip-header .wrapper .wrapper-item.bet-info-panel .red-dot-block {
  top: -2px;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -webkit-box-align: start;
  -webkit-align-items: start;
  -ms-flex-align: start;
  align-items: start;
}

.m-betslip-header .wrapper .wrapper-item.middle {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.m-betslip-header .wrapper.separate-part {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

#betslip-container {
  background-color: rgba(0, 0, 0, 0.8);
  font-family: Roboto;
}

#betslip-container .invisiable-item {
  left: 300vw;
  position: fixed;
}

#betslip-container .sim-selection-empty-panel {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1.16666667rem;
  height: 100vh;
  padding: 8.33333333rem 0;
  text-align: center;
}

#betslip-container .m-betslips {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  bottom: 0px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  max-height: 0%;
  position: absolute;
  right: 0px;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  width: 100%;
}

#betslip-container .m-betslips .m-loading-wrap {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

#betslip-container .m-betslips .m-loading-wrap .m-loading {
  margin-top: 30%;
}

#betslip-container .m-betslips .m-input {
  display: block;
}

#betslip-container .m-betslips .m-input .m-input-wrapper {
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

#betslip-container .m-betslips .m-market-desc-wrapper .m-input .m-error-info {
  padding: 0;
}

#betslip-container .m-betslips .m-market-desc-wrapper .m-keybord-input {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 1.83333333rem;
  line-height: 1.83333333rem;
  margin-bottom: 0.16666667rem;
  width: 7.5rem;
}

#betslip-container .m-betslips .m-betslips-outcomes {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}

#betslip-container .m-betslips .m-betslips-stake-wrapper {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}

#betslip-container .m-betslips .m-bet-head {
  background-color: #353a45;
  background-color: var(--background-type2-secondary);
  margin-bottom: 2px;
  position: relative;
}

#betslip-container .m-betslips .m-bet-head .m-sec-opt {
  color: #ffffff;
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

#betslip-container .m-betslips .m-bet-head .m-sec-opt.add-margin {
  margin: 1.66666667rem 0 1rem 0;
}

#betslip-container .m-betslips .m-bet-head .m-sec-opt .remove-all {
  color: #dcdee5;
  margin-right: 0.5rem;
}

#betslip-container .m-betslips .m-bet-head .m-sec-opt .remove-all::before {
  content: '\e65d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#betslip-container .m-betslips .m-bet-head .m-sec-opt .remove-all:before {
  color: #dcdee5;
  font-size: 1.33333333rem;
  line-height: 1;
  margin-right: 0.41666667rem;
}

#betslip-container .m-betslips .m-bet-head .m-sec-opt .remove-all.disabled {
  opacity: 0.4;
  pointer-events: none;
}

#betslip-container .m-betslips .m-bet-head .m-list-nav {
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 1.83333333rem;
  margin-top: 0.83333333rem;
  padding: 0 1.33333333rem;
}

#betslip-container .m-betslips .m-bet-head .m-list-nav > div {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

#betslip-container .m-betslips .m-bet-head .m-list-nav .m-count {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.33333333rem;
}

#betslip-container .m-betslips .m-bet-head .m-list-bet-type {
  padding: 0.33333333rem 0.41666667rem 0;
}

#betslip-container .m-betslips .m-bet-head .m-list-bet-type .m-list-bet-type-item {
  background-color: #50545f;
  background-color: var(--c-betslip-bet-type-nav-bg);
  border-top-left-radius: 0.33333333rem;
  border-top-right-radius: 0.33333333rem;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.066rem;
  font-weight: bold;
  height: 3rem;
  line-height: 3rem;
  margin-right: 0.25rem;
  color: #ffffff;
  color: var(--c-betslip-tab-text);
}

#betslip-container .m-betslips .m-bet-head .m-list-bet-type .m-list-bet-type-item:last-child {
  margin: 0;
}

#betslip-container .m-betslips .m-bet-head .m-list-bet-type .m-list-bet-type-item.active {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #353a45;
  color: var(--text-type1-primary);
}

#betslip-container
  .m-betslips
  .m-bet-head
  .m-list-bet-type
  .m-list-bet-type-item.m-snap-nav-item--disabled {
  opacity: 0.5;
  text-decoration: line-through;
}

#betslip-container .m-betslips .m-close {
  bottom: 1.33333333rem;
  height: 4rem;
  left: -3.75rem;
  position: absolute;
  text-align: center;
  width: 3.75rem;
}

#betslip-container .m-betslips .m-close > div {
  text-align: right;
}

#betslip-container .m-betslips .stretch-height-to-max {
  height: 100vh;
}

#betslip-container .m-betslips-off {
  max-height: 0%;
}

#betslip-container.betslip-mode-real .m-betslips-show,
#betslip-container.betslip-mode-sim .m-betslips-show.is-simulating {
  max-height: calc(100% - 5rem);
}

#betslip-container.betslip-mode-sim .m-betslips-show {
  height: calc(100% - 5rem) !important;
  max-height: 100%;
}

#betslip-container .sim-selection-empty-panel {
  background-color: #f2f3f5;
  color: #9ca0ab;
  font-size: 1.066rem;
  height: 100vh;
  padding: 8.33333333rem 0;
  text-align: center;
}

#betslip-container .flex {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

#betslip-container .flex-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}

#betslip-container .toggle-right {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  height: 2.16666667rem;
}

#betslip-container .bold {
  font-weight: 700;
}

.success-index-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}

.success-index-enter-active,
.success-index-leave-active {
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}

#betslip-container .m-betslips .m-input .m-input-wrapper > span {
  display: block;
  flex: 1;
  white-space: nowrap;
}

#betslip-container .m-betslips .m-input .m-input-wrapper .currency {
  text-align: right;
}

#betslip-container .m-betslips .m-input .m-input-wrapper .m-keybord-input {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

#betslip-container .m-betslips .m-input .m-input-wrapper .currency em {
  margin-right: 0.33333333rem;
}

.submit {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  bottom: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.33333333rem;
  height: 4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 200;
}

.submit::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.submit:before {
  -webkit-animation: circles 1s infinite;
  animation: circles 1s infinite;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  color: #ffffff;
  color: var(--brand-tertiary);
  display: inline-block;
  vertical-align: top;
}

.submit > span {
  display: inline-block;
  padding-left: 0.83333333rem;
}

.submit.sim-theme {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #1b1e25;
}

.submit.sim-theme:before {
  color: #1b1e25;
}

.submit.real-theme {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  color: #ffffff;
  color: var(--brand-tertiary);
}

.confirm {
  z-index: 25;
}

.slide-enter-active,
.slide-leave-active {
  -webkit-transition: -webkit-transform 300ms ease;
  transition: -webkit-transform 300ms ease;
  transition: transform 300ms ease;
  transition:
    transform 300ms ease,
    -webkit-transform 300ms ease;
  z-index: 200;
}

.slide-enter,
.slide-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}

.one-way-slide-enter,
.one-way-slide-leave-active {
  -webkit-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translateY(0);
  -webkit-transition: -webkit-transform 300ms ease;
  transition: -webkit-transform 300ms ease;
  transition: transform 300ms ease;
  transition:
    transform 300ms ease,
    -webkit-transform 300ms ease;
}

.one-way-slide-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}

.button-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: bold;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  z-index: 25;
}

.button-wrap .flexibet-cancel {
  border: none;
  border-radius: 0;
  line-height: 4rem;
  padding: 0 2.08333333rem;
  width: 33%;
}

.button-wrap .flexibet-confirm {
  border: none;
  border-radius: 0;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  line-height: 4rem;
  padding: 0 2.08333333rem;
}

.button-wrap .flexibet-confirm.sim-disabled {
  color: #ffffff;
}

.button-wrap .flexibet-confirm-edit {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  border: none;
  border-radius: 0;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-weight: 700;
  height: 4rem;
  padding: 0 2.08333333rem;
}

.button-wrap .review-stake {
  font-size: 12px;
  font-weight: 500;
  margin-top: 5px;
}

.confirm-wrap.real-theme .flexibet-cancel {
  background-color: #353a45;
  color: #ffffff;
}

.confirm-wrap.real-theme .flexibet-confirm {
  background: var(--brand-secondary);
  color: #fff;
}

.confirm-wrap.sim-theme .af-button.flexibet-cancel {
  background-color: #353a45;
  background-color: var(--c-betslip-header-bg);
  color: #ffffff;
}

.confirm-wrap.sim-theme .af-button.flexibet-confirm {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #1b1e25;
}

.confirm-wrap {
  bottom: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  left: 0;
  overflow: hidden;
  padding: none;
  position: fixed;
  width: 100%;
  z-index: 49;
}

.confirm-overlap {
  background: rgba(0, 0, 0, 0.6);
  bottom: 0;
  left: 0;
  padding: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
}

.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .potential-win.sim-theme,
.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .to-win.sim-theme {
  background-color: rgba(250, 253, 0, 0.2);
  background-color: var(--c-sim-win-bg);
}

.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .potential-win.sim-theme {
  background-color: rgba(250, 253, 0, 0.2);
  background-color: var(--c-sim-win-bg);
}

.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .m-submit .place-bet.sim-theme {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #000000;
}

.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .m-submit .place-bet.sim-disabled {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.m-bet-detail-wrap .m-betslips-stake-wrapper .m-betslips-stake .m-submit .sim-theme {
  background-color: #fafd00;
  background-color: var(--sim-primary);
  color: #000000;
}

.m-bet-detail-wrap.sim-theme {
  height: 100vh;
}

.m-bet-detail-wrap.sim-theme .m-scroll {
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

.m-bet-detail-wrap.sim-theme .m-betslips-stake-wrapper {
  margin-top: auto;
}

.m-flexibet-confirm {
  background-color: #ffffff;
  bottom: 0;
  padding-top: 2.16666667rem;
  position: relative;
  width: 100%;
}

.m-flexibet-confirm .about-to-pay {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.33333333rem;
  text-align: center;
}

.m-flexibet-confirm .stake-num {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.66666667rem;
  font-weight: 500;
  line-height: 2.16666667rem;
  text-align: center;
}

.m-flexibet-confirm .form-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 1.5rem;
  margin-top: 0.16666667rem;
  padding: 0 1.33333333rem;
  color: #353a45;
  color: var(--text-type1-primary);
}

.m-flexibet-confirm .form-item .label {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: left;
}

.m-flexibet-confirm .form-item .value {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  padding: 0 0.33333333rem;
  text-align: right;
}

.m-flexibet-confirm .form-wrap.flexibet-change .form-item .value {
  background: #d6ebdc;
  background: var(--brand-type1-secondary);
}

.m-flexibet-confirm .blank-area {
  height: 2.33333333rem;
  width: 100%;
}

.m-flexibet-confirm .betslip-confirm-bottom {
  margin: 0.41666667rem 0 0.83333333rem 0;
  padding: 0 1.33333333rem;
}

.m-flexibet-confirm .m-0 {
  margin: 0;
}

.m-error-info {
  padding: 0.25rem 1.33333333rem;
}
.m-error-info > p {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 0.83333333rem;
  text-align: right;
}
.m-error-info .m-deposit-link-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}
.m-error-info .m-deposit-link-wrapper .m-deposit-link {
  color: var(--brand-secondary);
  font-size: 12px;
  line-height: 16px;
  margin-right: 4px;
}
.m-error-info .m-deposit-link-wrapper .arrow-right {
  color: var(--brand-secondary);
}
.m-error-info .m-deposit-link-wrapper .arrow-right::before {
  content: '\e608';
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-error-info .m-deposit-link-wrapper .arrow-right::before {
  font-size: 12px;
}
</style>

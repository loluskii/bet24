<template>
  <div class="m-bet-container" :class="selection.changed ? 'm-change-item animated' : ''">
    <div data-op="betslip-multi-odds" class="m-outcomes-row">
      <div class="m-outcomes-opt" @click="removeSelection">
        <div class="m-outcomes-color"></div>
      </div>
      <div class="m-outcome-right">
        <div class="m-outcomes-row m-team-row" @click="goToGame">
          <div class="m-team-cell">
            <div class="m-outcome-desc-wrapper">
              <div class="m-outcome-desc" style="text-transform: capitalize">
                <img
                  :src="getImageSrc(selection.sportId)"
                  style="height: 18px; margin-right: 0.2rem"
                  alt=""
                  srcset=""
                />
                {{ selection.outcomeName }}
              </div>
              <div
                class="m-outcome-odds"
                :class="{
                  'm-outcome-up': oddUp && !selectionIsUnavailable,
                  'm-outcome-down': oddDown && !selectionIsUnavailable
                }"
              >
                <span v-if="!selectionIsUnavailable">{{ getSelectionOdds(selection.odds) }} </span>
                <div class="m-outcome-suspended" v-else>
                  {{ getUnavailabilityReason }}
                </div>
              </div>
            </div>
            <div class="m-vs-wrapper">
              <i v-if="selection.type == 'live'" class="m-icon-live"><span>Live</span></i>
              <div>{{ selection.eventName }}</div>
            </div>
            <div class="m-market-desc-wrapper">
              <div class="m-market-desc">{{ selection.marketName }}</div>

              <span
                tabindex="0"
                class="m-keybord-input"
                @click="openKeyboard"
                style="--fontsize: inherit"
                v-html="selection.stake"
                v-if="betSlipType === 'Single' && selectionsLength > 1"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <BetlistStakeKeyboard
        :keyboard-visible="isKeyboardVisible"
        @button-click="onKeyClick"
        @hide-keyboard="hideKeyboard"
      ></BetlistStakeKeyboard>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCouponStore, useUtilsStore } from '@/stores'
import BetlistStakeKeyboard from './BetlistStakeKeyboard.vue'
import emitter from '@/plugins/emitter'

const couponStore = useCouponStore()
const utilsStore = useUtilsStore()
const emit = defineEmits(['toggle-betslip', 'on-selection-input', 'update-selection'])
const router = useRouter()

const keyboardVisible = ref(false)
const oddUp = ref(false)
const oddDown = ref(false)
const previousOdds = ref(null)

const props = defineProps({
  selection: Object,
  betSlipType: String,
  betType: String,
  activeSelectionId: Number
})

// Add a timer reference to clear on component unmount
let arrowTimer = null

// Watch for changes to selection.odds
watch(
  () => props.selection.odds,
  (newValue, oldValue) => {
    if (previousOdds.value === null) {
      previousOdds.value = newValue
      return
    }

    // Only show arrows if there's an actual change in value
    if (newValue !== previousOdds.value) {
      if (parseFloat(newValue) > parseFloat(previousOdds.value)) {
        oddUp.value = true
        oddDown.value = false
      } else if (parseFloat(newValue) < parseFloat(previousOdds.value)) {
        oddUp.value = false
        oddDown.value = true
      }

      // Reset arrows after 5 seconds
      if (arrowTimer) {
        clearTimeout(arrowTimer)
      }

      arrowTimer = setTimeout(() => {
        oddUp.value = false
        oddDown.value = false
      }, 5000)

      // Update previous odds
      previousOdds.value = newValue
    }
  }
)

// Listen for acceptChanges event from BetListStake
onMounted(() => {
  // Initialize previousOdds
  previousOdds.value = props.selection.odds
})

// Clean up timers when component is unmounted
onBeforeUnmount(() => {
  if (arrowTimer) {
    clearTimeout(arrowTimer)
  }
})

const scores = ref()

const isKeyboardVisible = computed(() => {
  return props.activeSelectionId === props.selection.matchId
})

const getSportbyName = (name) => {
  return utilsStore.sportsMenu.find((x) => x.sportName == name)
}

const selectionsLength = computed(() => {
  return couponStore.coupon.selections.length
})

const selectionIsUnavailable = computed(() => {
  // If explicitly marked as unavailable
  if (props.selection.unavailable) {
    return true
  }

  // If suspended
  if (props.selection.suspended) {
    return true
  }

  // // Check if expired based on time
  // const parsedDate = new Date(props.selection.eventDate);
  // const currentDate = new Date();
  // const difference = currentDate - parsedDate;
  // const hoursDifference = difference / (1000 * 60 * 60);

  // return hoursDifference >= 5;
})

// Add a computed property to get the specific unavailability reason
const getUnavailabilityReason = computed(() => {
  // If explicitly marked as unavailable
  if (props.selection.unavailable) {
    return 'unavailable'
  }

  // If suspended
  if (props.selection.suspended) {
    return 'suspended'
  }

  // Check if expired based on time
  // const parsedDate = new Date(props.selection.eventDate);
  // const currentDate = new Date();
  // const difference = currentDate - parsedDate;
  // const hoursDifference = difference / (1000 * 60 * 60);

  // if (hoursDifference >= 3) {
  //   return "unavailable";
  // }

  // return "unavailable";
})

const getImageSrc = (sportId, sport) => {
  let imageUrl
  imageUrl = new URL(`../../assets/images/sports/${sportId}.png`, import.meta.url)
  return imageUrl
}

const getSelectionOdds = (odds) => {
  if (typeof odds === 'string') {
    return odds
  } else {
    return odds.toFixed(2)
  }
}

async function removeSelection() {
  await couponStore.removeSelection(props.selection.selectionId || props.selection.id)
}

function handleStakeChange(stake) {
  return couponStore.updateWinnings({
    stake: stake,
    id: props.selection.selectionId
  })
}

function openKeyboard() {
  emit('on-selection-input', props.selection.matchId)
}

function hideKeyboard() {
  emit('on-selection-input', 0)
}

function onKeyClick(type, value) {
  let stake = props.selection.stake.toString()
  let finalStake
  switch (type) {
    case 'number':
      if (stake.length < 7) {
        if (typeof value === 'number') {
          if (stake === '') {
            finalStake = value
          } else {
            finalStake = parseFloat(stake) + value
          }
        } else {
          finalStake = stake + value
        }
        handleStakeChange(finalStake)
      }
      break
    case 'dot':
      if (stake.length < 6 && !stake.includes('.')) {
        stake += '.'
        handleStakeChange(stake)
      }
      break
    case 'double-zero':
      if (stake.length < 6) {
        stake += '00'
        handleStakeChange(stake)
      }
      break
    case 'clear':
      stake = ''
      handleStakeChange(stake)
      break
    case 'delete':
      stake = stake.toString().slice(0, -1)
      handleStakeChange(stake)
      break
    case 'done':
      hideKeyboard()
      break
  }
}

function goToGame() {
  emit('toggle-betslip')
  let route_name = 'fixtures-detail'
  if (props.selection.type == 'live') {
    route_name = 'live-fixtures-detail'
  }
  return router.push({
    name: route_name,
    params: {
      sport: props.selection.sport,
      tournament_name: props.selection.tournament,
      event_name: props.selection.eventName,
      event_id: props.selection.matchId
    }
  })
}
</script>

<style>
.m-bet-container {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
  /* margin: 8px; */
  border-bottom: 1px solid #eaecef;
  /* border-radius: 9px; */
}
.m-bet-container.m-change-item,
.m-bet-container.m-item-error,
.m-bet-container.m-sim-invalid {
  background-color: #ffe3e5;
  background-color: var(--c-betslip-item-warning-bg);
}
.m-bet-container .m-outcomes-color {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 3px;
}
.m-bet-container.is-single {
  padding-bottom: 0.5rem;
}
.m-bet-container.is-single .m-outcomes-row .m-outcome-right {
  border-bottom: none;
}
.m-bet-container.is-single .m-outcomes-opt {
  -webkit-align-self: flex-end;
  -ms-flex-item-align: end;
  align-self: flex-end;
  padding-bottom: 0.25rem;
  padding-top: 0.41667rem;
}
.m-bet-container.is-single:not(:last-child)::after {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  bottom: 0;
  content: '';
  height: 1px;
  position: absolute;
  right: 0;
  width: 90%;
}

.m-bet-container .m-outcomes-row {
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
  overflow: hidden;
  position: relative;
}
.m-bet-container .m-outcomes-row .m-outcomes-opt {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  text-align: center;
  width: 3rem;
  padding-top: 0.41667rem;
}
.m-bet-container .m-outcomes-row .m-outcomes-opt::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-bet-container .m-outcomes-row .m-outcomes-opt:before {
  color: #000000;
  color: var(--c-betslip-item-cross-icon);
  font-size: 1.33333333rem;
}
.m-bet-container .m-outcomes-row .m-outcome-right {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 0%;
  -ms-flex: 1 0 0%;
  flex: 1 0 0%;
  overflow: hidden;
  /* padding-left: 20px; */
}
.m-bet-container .m-outcomes-row .m-team-row {
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.41666667rem 0.83333333rem 0.41666667rem 0.4rem;
  padding-right: 0.83333333rem;
  position: relative;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 0%;
  -ms-flex: 1 0 0%;
  flex: 1 0 0%;
  overflow: hidden;
  /* padding-right: 0.83333333rem; */
  position: relative;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell > a {
  color: #353a45;
  color: var(--text-type1-primary);
  display: block;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper,
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper,
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-market-desc-wrapper {
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
  max-width: 100%;
  overflow: hidden;
  width: 100%;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .sim-unavailable-label,
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper .sim-unavailable-label,
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-market-desc-wrapper
  .sim-unavailable-label {
  background-color: #eaecef;
  color: #9ca0ab;
  padding-left: 1rem;
  padding-right: 1rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper {
  font-size: 1.33333333rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper .m-outcome-desc {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 0%;
  -ms-flex: 1 1 0%;
  flex: 1 1 0%;
  overflow: hidden;
  padding-right: 0.83333333rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-desc:before {
  display: inline-block;
  padding-right: 0.41666667rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper .m-outcome-odds {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  white-space: nowrap;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-up::before {
  content: '\e609';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-up:before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  display: inline-block;
  padding-right: 0.83333333rem;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-down::before {
  content: '\e605';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-down:before {
  color: #e41827;
  color: var(--warning-primary);
  display: inline-block;
  padding-right: 0.83333333rem;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-del {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  font-size: 1rem;
  text-decoration: line-through;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-odds.m-outcome-del:before {
  content: '';
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper .m-outcome-boost {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 0.58333333rem;
  overflow: hidden;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .number-grow-warp {
  background: -webkit-gradient(linear, left top, right top, from(#40208c), to(#1e0e53));
  background: -webkit-linear-gradient(left, #40208c, #1e0e53);
  background: linear-gradient(to right, #40208c, #1e0e53);
  font-size: 1.33333333rem;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  padding: 0.08333333rem 0.25rem;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-suspended,
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-outcome-desc-wrapper
  .m-outcome-unavailable {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  border-radius: 2px;
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 0.83333333rem;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  padding: 0 0.83333333rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-outcome-desc-wrapper .m-status-fixed {
  height: 1.066rem;
  line-height: 1.066rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper {
  font-size: 1.066rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper .m-icon-live {
  background-color: var(--brand-secondary);
  filter: opacity(0.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  /* color: var(--c-betslip-live-label-text); */
  display: block;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 1rem;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  margin-right: 0.41666667rem;
  padding: 0 0.25rem;
  position: relative;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper > div:nth-of-type(1) {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  padding-right: 0.83333333rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-vs-wrapper > div:last-child {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-market-desc-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 1.066rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-market-desc-wrapper .m-market-desc {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin-right: 0.66666667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-market-desc-wrapper
  .m-market-desc
  .delay-icon {
  line-height: 1;
  margin-left: 0.33333333rem;
  vertical-align: -10%;
  width: 1rem;
}
.m-bet-container .m-outcomes-row .m-team-row .m-team-cell .m-market-desc-wrapper .m-desc {
  color: #353a45;
  color: var(--text-type1-primary);
  display: inline-block;
  margin-left: 3.33333333rem;
  max-width: calc(100% - 1.66666667rem);
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-market-desc-wrapper
  .m-outcome-suspended,
.m-bet-container
  .m-outcomes-row
  .m-team-row
  .m-team-cell
  .m-market-desc-wrapper
  .m-outcome-unavailable {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  border-radius: 2px;
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 0.83333333rem;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  padding: 0 0.83333333rem;
}

.m-bet-container .m-outcomes-row .m-team-row .m-outcome-dan-wrapper {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
.m-bet-container:last-child .m-outcome-right {
  border: 0px;
}

.m-keybord-input {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid #9ca0ab;
  border-color: #9ca0ab;
  border-color: var(--text-disable-type1-primary);
  border-radius: 0.25rem;
  color: #353a45;
  color: var(--text-type1-primary);
  display: inline-block;
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  outline: none;
  padding: 0 0.83333333rem;
  position: relative;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  text-align: right;
  width: 7.5rem;
}
</style>

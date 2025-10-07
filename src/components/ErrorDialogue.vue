<template>
  <div class="es-dialog-wrap" id="esDialog0" style="visibility: visible">
    <div
      class="layout mask"
      @click="$emit('hide-dialogue')"
      style="z-index: 1000; position: fixed"
    ></div>
    <div v-if="dialogIsError" class="es-dialog m-dialog">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div>{{ errorMessage }}</div>
        </div>
      </div>
      <div class="m-dialog-footer es-dialog-footer">
        <a
          href="javascript:void(0);"
          @click.prevent="nextAction"
          class="es-dialog-btn es-dialog-focus-btn"
        >
          <span>OK</span>
        </a>
      </div>
    </div>
    <div v-if="dialogIsBetslip" class="es-dialog m-dialog">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div>
            You have items in Betslip. Are you sure to replace Betslip with this new selections?
          </div>
        </div>
      </div>
      <div class="m-dialog-footer es-dialog-footer">
        <a
          href="javascript:void(0);"
          @click.prevent="$emit('hide-dialogue')"
          class="es-dialog-btn es-dialog-focus-btn"
        >
          <span>Cancel</span>
        </a>
        <a
          href="javascript:void(0);"
          @click.prevent="replaceBetslip"
          class="es-dialog-btn es-dialog-focus-btn"
        >
          <span>OK</span>
        </a>
      </div>
    </div>
    <WithdrawalModal
      v-if="dialogIsWithdrawal"
      @close-modal="$emit('hide-dialogue')"
      :user-data="dialogueMessage"
    ></WithdrawalModal>
    <div
      v-if="dialogIsToast"
      class="es-dialog-toast es-dialog m-dialog"
      style="z-index: 1003; position: fixed; width: 22.91rem; left: 50%; top: 50%; padding: 0"
    >
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div>{{ dialogueMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import WithdrawalModal from '@/components/WithdrawalModal.vue'
import { useRouter } from 'vue-router'
import { useCouponStore } from '../stores'
import emitter from '@/plugins/emitter'

const emits = defineEmits(['hide-dialogue'])
const props = defineProps({
  errorMessage: String,
  dialogueMessage: Object,
  dialogueType: String,
  nextRoute: String
})

const dialogIsError = ref(false)
const dialogIsWithdrawal = ref(false)
const dialogIsToast = ref(false)
const dialogIsBetslip = ref(false)
const router = useRouter()
const couponStore = useCouponStore()

const dialogueType = () => {
  switch (props.dialogueType) {
    case 'error':
      dialogIsError.value = true
      break
    case 'withdrawal':
      dialogIsWithdrawal.value = true
      break
    case 'toaster':
      dialogIsToast.value = true
      break
    case 'betslip':
      dialogIsBetslip.value = true
      break

    default:
      break
  }
}

function nextAction() {
  emits('hide-dialogue')
  if (props.nextRoute !== null || props.nextRoute !== undefined) {
    return router.push(props.nextRoute)
  }
}

function replaceBetslip() {
  try {
    emits('hide-dialogue')
    couponStore.clearBetslip()
    couponStore.coupon.selections = props.dialogueMessage.selections
    couponStore.coupon.totalOdds = parseFloat(props.dialogueMessage.totalOdd)
    couponStore.coupon.totalStake = parseFloat(props.dialogueMessage.stake)
    couponStore.coupon.stake = parseFloat(props.dialogueMessage.stake)
    couponStore.coupon.maxWin = parseFloat(props.dialogueMessage.possibleWin)
    couponStore.coupon.source = props.dialogueMessage.source
    if (props.dialogueMessage.selections.length === 1) {
      couponStore.coupon.bet_type = 'Single'
      couponStore.coupon.betslip_type = 'Single'
    } else {
      couponStore.coupon.bet_type = 'Multiple'
      couponStore.coupon.betslip_type = 'Multiple'
    }
    emitter.emit('openBetslip')
  } catch (error) {}
}

onMounted(() => {
  dialogueType()
})
</script>

<style>
.es-dialog {
  background-color: #fafafa;
  border-radius: 0.3rem;
  box-shadow:
    0 0 24px 0 rgba(0, 0, 0, 0.25),
    0 0 24px 0 rgba(112, 76, 76, 0.25);
  color: #353a45;
  font-family: 'Roboto', 'Microsoft Yahei', 'simsun';
  font-size: 1rem;
  line-height: 2rem;
  overflow: hidden;
  padding: 1.66666667rem 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  z-index: 1001;
}
.es-dialog-close {
  display: none;
  padding: 0.3rem 1rem;
  text-decoration: none;
}
.es-dialog-close em {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 0;
}
.es-dialog-close em::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.es-dialog-close em:before {
  font-size: 1.5rem;
}
.es-dialog-close em:active {
  -webkit-transform: scale(0.9, 0.9);
  -ms-transform: scale(0.9, 0.9);
  transform: scale(0.9, 0.9);
}
.es-dialog-wrap {
  visibility: hidden;
}
.es-dialog-wrap .layout {
  background: #353a45;
  height: 100%;
  left: 0;
  opacity: 0.4;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}
.es-dialog-wrap .overlay-animate-enter {
  opacity: 0;
}
.es-dialog-wrap .overlay-animate-enter-active {
  opacity: 0.4;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.es-dialog-wrap .overlay-animate-leave {
  opacity: 0.4;
}
.es-dialog-wrap .overlay-animate-leave-active {
  opacity: 0;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.es-dialog-wrap .body-overflow {
  overflow: hidden;
}
.es-dialog .es-dialog-head {
  padding: 0 2rem 0.66666667rem;
}
.es-dialog .es-dialog-head h1 {
  font-size: 1.66666667rem;
  font-weight: 700;
  min-height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin: 0;
  text-align: center;
  text-align: left;
}
.es-dialog .es-dialog-head .es-dialog-close {
  background: none;
  font-family: 'Microsoft YaHei', arial, simsun, SimHei;
  position: absolute;
  right: 5px;
  top: 1px;
}
.es-dialog .es-dialog-head .es-dialog-close em {
  cursor: default;
  font-style: normal;
}
.es-dialog .es-dialog-body {
  background-color: transparent;
  margin: 0;
  /* min-height: 4rem; */
  padding: 0;
}
.es-dialog .es-dialog-body .es-dialog-main {
  /* background-color: #fafafa;  */
  /* background-color: var(--background-general-primary); */
  overflow: auto;
  /* padding: 0 2rem; */
  word-break: break-word;
  word-wrap: break-word;
}
.es-dialog .es-dialog-footer {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0.66666667rem;
  text-align: right;
  width: 100%;
}
.es-dialog .es-dialog-footer .es-dialog-btn {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  cursor: pointer;
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.066rem;
  font-weight: 700;
  height: 3rem;
  line-height: 3rem;
  outline: none;
  padding: 0;
  text-align: left;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 30%;
}
.es-dialog.es-ani-show {
  -webkit-transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
}
.es-dialog.es-ani-hide {
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}
.es-dialog.es-dialog-ani-1 {
  opacity: 0.1;
}
.es-dialog.es-dialog-ani-2 {
  opacity: 0.1;
  -webkit-transform: scale(0.1);
  -ms-transform: scale(0.1);
  transform: scale(0.1);
}
.es-dialog.es-dialog-ani-3 {
  opacity: 0.1;
  -webkit-transform: scale(1.8);
  -ms-transform: scale(1.8);
  transform: scale(1.8);
}
.es-dialog.es-dialog-ani-4 {
  opacity: 0;
  -webkit-transform: perspective(300px) rotateY(90deg);
  transform: perspective(300px) rotateY(90deg);
}
.es-dialog.es-dialog-ani-5 {
  opacity: 0.1;
  -webkit-transform: scale(0.3);
  -ms-transform: scale(0.3);
  transform: scale(0.3);
}
.es-dialog.es-dialog-ani-6 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, 230);
  -ms-transform: matrix(1, 0, 0, 1, 0, 230);
  transform: matrix(1, 0, 0, 1, 0, 230);
}
.es-dialog.es-dialog-ani-7 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, -230);
  -ms-transform: matrix(1, 0, 0, 1, 0, -230);
  transform: matrix(1, 0, 0, 1, 0, -230);
}
.es-dialog-info .es-dialog-body .es-dialog-main,
.es-dialog-error .es-dialog-body .es-dialog-main,
.es-dialog-alert .es-dialog-body .es-dialog-main,
.es-dialog-confirm .es-dialog-body .es-dialog-main {
  vertical-align: middle;
}
.es-dialog-toast {
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  color: #fff;
  font-size: 1rem;
  padding-top: 0;
}
.es-dialog-toast.es-dialog {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.es-dialog-toast .es-dialog-body {
  min-height: auto;
}
.es-dialog-toast a {
  color: #ffc000;
  text-decoration: underline;
}
.es-dialog-toast a :link {
  color: #ffc000;
}
.es-dialog-toast a :visited {
  color: #ffc000;
}
.es-dialog-toast a :hover {
  color: #ffc000;
}
.es-dialog-toast .es-dialog-body,
.es-dialog-toast .es-dialog-body .es-dialog-main {
  background: transparent;
  min-height: inherit;
  text-align: center;
}
.es-dialog-toast .es-dialog-body .es-dialog-main {
  padding: 0.83rem 1.05rem;
}
</style>

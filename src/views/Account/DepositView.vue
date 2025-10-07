<template>
  <div id="deposit">
    <HeaderOther :header-title="'Deposit'"></HeaderOther>
    <form v-if="!isLoading" class="m-dp-container">
      <div class="m-tabs m-tabs-no-animation" has-right-btn="true">
        <div class="m-tabs-nav">
          <div class="m-tabs-ink-bar" style="display: block; left: 0px"></div>
          <div
            v-for="(method, index) in depositMethods"
            :class="activeTab == method.provider ? 'm-tabs-tab-active' : ''"
            :key="index"
            class="m-tabs-tab"
            @click="setActiveTab(method.provider)"
          >
            <span style="text-transform: capitalize">{{
              method.provider === 'sbengine' ? 'Shop' : method.title
            }}</span>
          </div>
        </div>
        <div class="m-tabs-content" style="transform: translateX(0%) translateZ(0px)">
          <div class="deposit-footer deposit-footer--bank-transfer" style="">
            <!-- <img
              src="@/assets/images/monnify.svg"
              v-show="activeTab == 'monnify'"
              alt=""
              style="height: 23px"
              srcset=""
            />
            <img
              src="@/assets/images/paystack.png"
              v-show="activeTab == 'paystack'"
              alt=""
              style="height: 30px"
              srcset=""
            />
            <img
              src="@/assets/images/flutterwave.png"
              v-show="activeTab == 'flutterwave'"
              alt=""
              style="height: 30px"
              srcset=""
            />
            <img
              src="@/assets/images/korapay.png"
              v-show="activeTab == 'korapay'"
              alt=""
              style="height: 30px"
              srcset=""
            /> -->
            <!-- <br /><br /> -->
            <div class="balance-container">
              <div class="balance-section balance-section--bank-transfer">
                <span class="balance-text balance-text--bank-transfer"
                  ><span data-cms-key="balance">Balance</span> ({{
                    utilsStore.SportsbookGlobalVariable.CurrencyCode
                  }}) {{ usersStore.balance }}
                </span>
              </div>
            </div>
            <div class="input-container">
              <div
                class="deposit-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
              >
                <div class="m-input-wap-prepend m-input-wap-prepend--default">
                  <span class="amount-prepend"
                    ><span data-cms-key="amount">Amount</span> ({{
                      utilsStore.SportsbookGlobalVariable.CurrencyCode
                    }})
                  </span>
                </div>
                <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
                <input
                  type="number"
                  v-model="amount"
                  name=""
                  placeholder="min. 100"
                  class="m-input-wap"
                />
              </div>
            </div>

            <span class="error-msg"> </span>
            <button
              v-if="availableBonus && !bonus"
              class="af-button deposit-submit af-button--primary"
              :class="amount == '' ? ' is-disabled' : ''"
              @click.prevent="activateBonus"
              :disabled="amount === ''"
            >
              <span>Activate Bonus</span>
            </button>
            <button
              class="af-button deposit-submit af-button--primary"
              :class="isDepositing ? ' is-disabled' : ''"
              @click.prevent="beginDeposit"
            >
              <span><span> Top Up Now </span></span>
            </button>
            <p v-if="bonus">
              You have activated <strong>{{ availableBonus?.name }}</strong
              >. Complete payment to receive <strong>{{ formatNumber(bonus?.amount) }}</strong> in
              your bonus account.
            </p>
          </div>
          <div class="deposit-footer" style="">
            <div class="wrap">
              <ul class="m-payment-tips f-count">
                <li class="l-item">
                  1. Minimum deposit amount is
                  {{ utilsStore.SportsbookGlobalVariable.CurrencyCode }}
                  {{ utilsStore.SportsbookGlobalVariable.MinDeposit }} - you can deposit at least
                  {{ utilsStore.SportsbookGlobalVariable.CurrencyCode }}
                  {{ utilsStore.SportsbookGlobalVariable.MinDeposit }} in one transaction.
                </li>
                <li class="l-item">
                  2. Maximum per transaction is
                  {{ utilsStore.SportsbookGlobalVariable.CurrencyCode }} 9,999,999.00 - you can
                  deposit up to {{ utilsStore.SportsbookGlobalVariable.CurrencyCode }} 9,999,999.00
                  in one transaction.
                </li>
                <li class="l-item">3. If you have any issues, please contact customer service.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
    <LoadingSpinner v-else></LoadingSpinner>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderOther from '../../components/HeaderOther.vue'
import { useUsersStore, useUtilsStore } from '@/stores'
import { getPaymentMethods, getDepositURL } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import emitter from '@/plugins/emitter'
import { CLIENT_ID, checkFirstDeposit, formatNumber } from '@/helpers'

const activeTab = ref('paystack')
const depositMethods = ref([])
const usersStore = useUsersStore()
const utilsStore = useUtilsStore()
const router = useRouter()
const amount = ref('')
const isLoading = ref(false)
const availableBonus = ref(null)
const isDepositing = ref(false)

const bonus = computed(() => {
  return usersStore.bonus
})

function setActiveTab(method) {
  activeTab.value = method
  amount.value = ''
}

async function getPayments() {
  isLoading.value = true
  const res = await getPaymentMethods()
  depositMethods.value = res.data
  isLoading.value = false
}

async function checkForBonus() {
  const resp = await checkFirstDeposit()
  if (resp.success) {
    availableBonus.value = resp.data
  }
}

function activateBonus() {
  let bonusAmount = amount.value
  if (availableBonus.value.type === 'flat') {
    bonusAmount = availableBonus.value.value
  } else {
    bonusAmount = (parseFloat(amount.value) * availableBonus.value.value) / 100
  }

  const bonus = {
    bonusId: availableBonus.value.bonusId,
    amount: bonusAmount,
    username: usersStore.currentUser.username
  }
  usersStore.setActiveBonus(bonus)
  // availableBonus.value = null;
}

async function beginDeposit() {
  if (isDepositing.value) return
  isDepositing.value = true
  try {
    const payload = {
      amount: amount.value,
      paymentMethod: activeTab.value,
      clientId: CLIENT_ID
    }

    const res = await getDepositURL(payload)
    if (res.success) {
      if (activeTab.value === 'fidelity') {
        try {
          const payazaConfig = JSON.parse(Object.values(res.data)[0])
          const payazaCheckout = PayazaCheckout.setup({
            ...payazaConfig,
            merchant_key: import.meta.env.VITE_PAYAZA_MERCHANT_KEY,
            // onClose: function () {
            //   emitter.emit('showErrorMessage', 'Payment cancelled!');
            //   isDepositing.value = false;
            // },
            callback: function (response) {
              console.log('Payment response:', response)
              if (response.type === 'success') {
                // emitter.emit('showSuccessMessage', 'Payment successful!');
                window.location.href = `${window.location.origin}/payment-verification/fidelity?txnRef=${res.data.transactionRef}`
              } else {
                emitter.emit(
                  'showErrorMessage',
                  response.message || 'Payment failed. Please try again.'
                )
              }
              isLoading.value = false
            }
          })

          payazaCheckout.showPopup()
        } catch (error) {
          console.error('Error parsing Payaza config:', error)
          emitter.emit('showErrorMessage', 'Failed to initialize payment. Please try again.')
          isLoading.value = false
        }
      } else if (activeTab.value === 'sbengine') {
        isDepositing.value = false
        emitter.emit('showDepositWithdrawalModal', {
          type: 'Deposit',
          code: res.data.transactionRef
        })
      } else {
        isDepositing.value = false
        if (res.data.link === 'ACCEPTED') {
          window.location.href = '/'
        } else if (!res.data.link.includes('http')) {
          emitter.emit('showErrorMessage', res.message)
        } else {
          window.location.href = res.data.link
        }
      }
    } else {
      emitter.emit(
        'showErrorMessage',
        res.message || 'Failed to initiate deposit. Please try again.'
      )
      isDepositing.value = false
    }
  } catch (error) {
    console.error('Error initiating deposit:', error)
    emitter.emit('showErrorMessage', 'An error occurred. Please try again.')
    isDepositing.value = false
  }
}

onMounted(async () => {
  usersStore.setActiveBonus(null)

  await getPayments()
  await checkForBonus()

  // Load Payaza script
  let script = document.createElement('script')
  script.text = `
    (function(a,b,c,d,e,f,g,h,i){
      a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},
      i.l=1*new Date,
      i.o=f,
      g=b.createElement(c),
      h=b.getElementsByTagName(c)[0],
      g.async=1,
      g.src=d,
      g.setAttribute("n",e),
      h.parentNode.insertBefore(g,h))
    })(window,document,"script","https://checkout.fidelity.payaza.africa/js/v1/bundle.js","PayazaCheckout");
  `
  script.id = 'payaza-checkout'
  document.body.appendChild(script)
})

onUnmounted(() => {
  // Clean up Payaza script
  document.getElementById('payaza-checkout')?.remove()
})
</script>

<style>
@import url('@/assets/css/deposit.css');

.af-button--primary {
  background: var(--brand-secondary);
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  float: right;
  font-size: 1.066rem;
  /* font-weight: bold; */
  /* height: 3.33333333rem; */
  width: 100%;
}

.bank-transfer-card {
  margin-bottom: 1.66666667rem;
  padding: 1rem 1.33333333rem 1.33333333rem;
  border-radius: 0.16666667rem;
}

.bank-transfer-card-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.33333333rem;
}

.bank-transfer-card-steps {
  counter-reset: step-counter;
  list-style: none;
}

.bank-transfer-card-steps li {
  margin-bottom: 1rem;
  display: flex;
  counter-increment: step-counter;
}

.bank-transfer-card-steps li:before {
  content: 'Step ' counter(step-counter);
  margin-right: 1rem;
  color: #9ca0ab;
  display: block;
  min-width: 2.91666667rem;
}

.bank-transfer-card-steps li:last-child {
  margin-bottom: 0;
}

ol.bank-transfer-card-steps {
  padding: 0;
}

html[theme='dark'] {
  color: #fff;
  background-color: #1b1e25;
}

html,
html[theme='light'] {
  color: #000;
  background-color: #fafafa;
}

.m-tabs-tab-active {
  font-weight: bold;
}

.m-payment-tips .l-item {
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  grid-template-columns: 1.33333333rem 1fr;
  color: #9ca0ab;
}
</style>

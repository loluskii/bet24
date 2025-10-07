<template>
  <div id="withdraw">
    <HeaderOther :header-title="'Withdraw'"></HeaderOther>
    <template v-if="!withdrawalSuccess && !transferSuccess && !cashWithdrawalSuccess">
      <div>
        <div class="m-tabs m-tabs-no-animation">
          <div class="wrapper-parent">
            <div class="tabs--wrapper" style="overflow: hidden">
              <div
                class="m-tabs-nav flex-nav"
                style="
                  transform: translate(0px, 0px);
                  transition-duration: 0s;
                  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                  width: 100%;
                "
              >
                <div
                  v-for="method in withdrawalMethods"
                  :key="method.key"
                  class="m-tabs-tab"
                  :class="{ 'm-tabs-tab-active': activeMethod === method.key }"
                  @click="activeMethod = method.key"
                >
                  {{ method.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="m-tabs-content" style="transform: translateX(0%) translateZ(0px)">
            <div v-if="activeMethod === 'bank'" class="bank-section">
              <form data-op="withdraw-bank-form">
                <div class="withdraw-bank">
                  <div @click="toggleShowBanks" class="withdraw-bank-static">
                    <svg
                      viewBox="1 1 21 20"
                      xmlns="http://www.w3.org/2000/svg"
                      height="2rem"
                      width="2rem"
                      class="bank-static-prepend svg-icon-base"
                    >
                      <g fill="none" fill-rule="evenodd">
                        <path d="M0 0h24v24H0z"></path>
                        <path
                          d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"
                          fill="currentColor"
                          fill-rule="nonzero"
                        ></path>
                      </g>
                    </svg>
                    <div class="bank-static-name" :class="selectedBank ? '' : 'blank'">
                      {{ selectedBank ? selectedBank.name : 'Select a Bank' }}
                    </div>
                    <i class="bank-static-arrow"></i>
                  </div>
                  <div class="error-msg"></div>
                  <div class="withdraw-bank-number static" style="display: none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 2 19 19"
                      height="2rem"
                      width="2rem"
                      class="static-prepend svg-icon-base"
                    >
                      <g fill="none" fill-rule="evenodd">
                        <path
                          fill="currentColor"
                          fill-rule="nonzero"
                          d="M3 5v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5a2 2 0 00-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"
                        ></path>
                        <path d="M0 0h24v24H0z"></path>
                      </g>
                    </svg>
                    <div class="static-content">
                      <div>
                        <div class="static-label">Account Number</div>
                        <div class="static-input fs-exclude"></div>
                      </div>
                      <i class="static-content-delete-icon"></i>
                    </div>
                  </div>
                  <div
                    class="withdraw-bank-number m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
                    :class="accountError ? 'm-input-wap-wrapper--error' : ''"
                    style=""
                  >
                    <div class="m-input-wap-prepend m-input-wap-prepend--default">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="2 2 19 19"
                        height="2rem"
                        width="2rem"
                        class="svg-icon-base"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path
                            fill="currentColor"
                            fill-rule="nonzero"
                            d="M3 5v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5a2 2 0 00-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"
                          ></path>
                          <path d="M0 0h24v24H0z"></path>
                        </g>
                      </svg>
                    </div>
                    <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
                    <div class="m-input-transform">
                      <input
                        type="tel"
                        name=""
                        placeholder="Account Number"
                        maxlength="10"
                        class="m-input-wap fs-exclude"
                        v-model="accountNumber"
                      />
                    </div>
                  </div>
                  <div class="switch-container" v-if="bankAssets.length" @click="toggleBanksAssets">
                    <div class="switch-bank">
                      <span>Switch Bank Account</span>
                      <i class="switch-icon"></i>
                    </div>
                  </div>
                  <div class="error-msg">{{ accountErrorMessage }}</div>
                </div>
                <!--  -->
                <div class="withdraw-footer">
                  <div class="balance-container">
                    <p class="balance-text">
                      <span data-cms-key="balance">Balance</span>
                      <span data-op="balance">(NGN) {{ usersStore.balance }}</span>
                    </p>
                    <div class="withdrawable-text-wrapper">
                      <i class="m-icon-help"></i>
                      <p>
                        <span>Withdrawable Balance </span>
                        <span>NGN {{ usersStore.balance }}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
                    :class="amountError ? 'm-input-wap-wrapper--error' : ''"
                  >
                    <div class="m-input-wap-prepend m-input-wap-prepend--default">
                      <span class="amount-prepend"
                        ><span>Amount</span> ({{ SportsbookGlobalVariable.CurrencyCode }})
                      </span>
                    </div>
                    <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
                    <input
                      type="number"
                      v-model="withdrawalAmount"
                      @input="checkWithdrawableAmount"
                      name=""
                      placeholder="min. 1"
                      class="m-input-wap"
                    />
                  </div>
                  <div class="error-msg">{{ amountErrorMessage }}</div>
                  <button
                    class="af-button withdraw-submit af-button--primary"
                    :class="!isFormComplete || buttonLoader ? 'is-disabled' : ''"
                    @click.prevent="submit"
                    :disabled="!isFormComplete || buttonLoader"
                  >
                    <span
                      ><span>
                        {{ buttonLoader ? 'Processing...' : 'Continue' }}
                      </span></span
                    >
                  </button>
                </div>
              </form>
              <div id="popup-select" v-if="showBanks || showBanksAssets">
                <div v-if="showBanks" class="popup-modal" @click="toggleShowBanks"></div>
                <div v-if="showBanksAssets" class="popup-modal" @click="toggleBanksAssets"></div>
                <div class="select-container" :style="showBanksAssets ? 'height: auto' : ''">
                  <div class="m-close">
                    <div>
                      <svg
                        width="46px"
                        height="22px"
                        viewBox="0 0 46 22"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Betslip-Success"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                          transform="translate(564.000000, -37.000000) rotate(90)"
                        >
                          <g id="Shape_Close" transform="translate(37.000000, 518.000000)">
                            <path
                              d="M22,0.360389693 L22,46 L1.61522369,26.0416306 C0.0531265221,24.4795334 0.0531265221,21.9468735 1.61522369,20.3847763 L22,0.360389693 Z"
                              id="Rectangle-34"
                              fill="#353A45"
                            ></path>
                            <polygon
                              id="Shape"
                              fill="#FFFFFF"
                              fill-rule="nonzero"
                              points="20.25 18.8075 19.1925 17.75 15 21.9425 10.8075 17.75 9.75 18.8075 13.9425 23 9.75 27.1925 10.8075 28.25 15 24.0575 19.1925 28.25 20.25 27.1925 16.0575 23"
                            ></polygon>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div class="content" style="position: relative">
                    <template v-if="!isLoading">
                      <div
                        class="m-head px-3 py-3"
                        style="
                          position: fixed;
                          background-color: #fafafa;
                          width: -webkit-fill-available;
                        "
                      >
                        <div
                          class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
                          style="border: 1px solid #9ca0ab"
                        >
                          <input
                            type="text"
                            name=""
                            placeholder="Type to search..."
                            v-model="searchQuery"
                            class="m-input-wap"
                            style="height: auto; padding: 12px"
                          />
                        </div>
                      </div>
                      <div class="m-body fs-exclude" style="margin-top: 70px">
                        <ul class="select-list">
                          <li
                            v-for="(bank, index) in filteredBanks"
                            :key="index"
                            class="select-item"
                            @click="selectBank(bank)"
                            v-if="showBanks"
                          >
                            <!-- <i class="item-left"></i> -->
                            <div class="item-right">
                              <div class="item-main">
                                <div class="item-title">{{ bank.name }}</div>
                              </div>
                            </div>
                          </li>
                          <li
                            v-for="(bank, index) in bankAssets"
                            :key="index"
                            class="select-item"
                            @click="selectBank(bank)"
                            v-if="showBanksAssets"
                          >
                            <i
                              v-if="selectedBank.code === bank.bankCode"
                              class="item-left selected"
                              style=""
                            ></i>
                            <div class="item-right">
                              <div class="item-main">
                                <div class="item-title">{{ bank.name }}</div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </template>
                    <LoadingSpinner v-else></LoadingSpinner>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="activeMethod === 'transfer'" class="transfer-section">
              <div style="padding: 1.3rem">
                <div class="balance-container mb-3">
                  <p class="balance-text">
                    <span data-cms-key="balance">Balance</span>
                    <span data-op="balance">(SSP) {{ usersStore.balance }}</span>
                  </p>
                  <div class="withdrawable-text-wrapper">
                    <i class="m-icon-help"></i>
                    <p>
                      <span>Withdrawable Balance </span>
                      <span>SSP {{ usersStore.balance }}</span>
                    </p>
                  </div>
                </div>
                <div
                  class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend mb-3"
                  :class="transferError ? 'm-input-wap-wrapper--error' : ''"
                >
                  <input
                    type="number"
                    v-model="transferReceiver"
                    name=""
                    placeholder="Username"
                    class="m-input-wap"
                  />
                </div>
                <div
                  class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend mb-3"
                  :class="transferError ? 'm-input-wap-wrapper--error' : ''"
                >
                  <div class="m-input-wap-prepend m-input-wap-prepend--default">
                    <span class="amount-prepend"
                      ><span>Amount</span>
                      (SSP)
                    </span>
                  </div>
                  <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
                  <input
                    type="number"
                    v-model="transferAmount"
                    name=""
                    placeholder="min. 1"
                    class="m-input-wap"
                  />
                </div>
                <div
                  class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend mb-3"
                  :class="transferError ? 'm-input-wap-wrapper--error' : ''"
                >
                  <input
                    type="password"
                    v-model="transferPin"
                    name=""
                    placeholder="Withdrawal PIN"
                    class="m-input-wap"
                  />
                </div>
                <div class="error-msg">{{ transferErrorMessage }}</div>
                <button
                  class="af-button withdraw-submit af-button--primary"
                  :class="buttonLoader ? 'is-disabled' : ''"
                  @click.prevent="submitTransferRequest"
                  :disabled="buttonLoader"
                >
                  <span
                    ><span> {{ buttonLoader ? 'Processing...' : 'Continue' }} </span></span
                  >
                </button>
              </div>
            </div>
            <div v-else-if="activeMethod === 'shop' || activeMethod === 'smileandpay'" class="transfer-section">
              <div style="padding: 1.3rem">
                <div class="balance-container mb-3">
                  <p class="balance-text">
                    <span data-cms-key="balance">Balance</span>
                    <span data-op="balance">(SSP) {{ usersStore.balance }}</span>
                  </p>
                  <div class="withdrawable-text-wrapper">
                    <i class="m-icon-help"></i>
                    <p>
                      <span>Withdrawable Balance </span>
                      <span
                        >{{ SportsbookGlobalVariable.CurrencyCode }} {{ usersStore.balance }}</span
                      >
                    </p>
                  </div>
                </div>
                <div
                  class="withdraw-amount m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend mb-3"
                  :class="cashRequestError ? 'm-input-wap-wrapper--error' : ''"
                >
                  <div class="m-input-wap-prepend m-input-wap-prepend--default">
                    <span class="amount-prepend"
                      ><span>Amount</span>
                      (SSP)
                    </span>
                  </div>
                  <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
                  <input
                    type="number"
                    v-model="cashWithdrawalAmount"
                    name=""
                    placeholder="min. 1"
                    class="m-input-wap text-right"
                  />
                </div>
                <div class="error-msg">{{ cashRequestErrorMessage }}</div>
                <button
                  class="af-button withdraw-submit af-button--primary"
                  :class="buttonLoader ? 'is-disabled' : ''"
                  @click.prevent="submitCashRequest"
                  :disabled="buttonLoader"
                >
                  <span
                    ><span> {{ buttonLoader ? 'Processing...' : 'Continue' }} </span></span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="withdraw-banner-container"><img src="" /></div>
      </div>
    </template>
    <WithdrawalSuccess
      v-if="withdrawalSuccess"
      :user-data="withdrawalSuccessData"
    ></WithdrawalSuccess>
    <TransferSuccess
      v-if="transferSuccess"
      :user-data="{ amount: transferAmount, receiver: transferReceiver }"
    ></TransferSuccess>
    <CashWithdrawalSuccess
      v-if="cashWithdrawalSuccess"
      :user-data="cashWithdrawalSuccessData"
    ></CashWithdrawalSuccess>
  </div>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import WithdrawalSuccess from '@/components/WithdrawalSuccess.vue'
import {
  formatNumber,
  getBanksList,
  verifyAccount,
  withdrawalRequest,
  fetchBankAssets,
  transferRequest, smileandpayPayout
} from "@/helpers";
import TransferSuccess from '@/components/Withdrawal/TransferSuccess.vue'
import CashWithdrawalSuccess from '@/components/Withdrawal/CashWithdrawalSuccess.vue'
import { ref, onMounted, computed } from 'vue'
import emitter from '@/plugins/emitter'
import { useRouter } from 'vue-router'
import { useUsersStore, useUtilsStore } from '@/stores'
import { CLIENT_ID } from '@/helpers'
const showBanks = ref(false)
const showBanksAssets = ref(false)
const usersStore = useUsersStore()
const { SportsbookGlobalVariable, banksList } = useUtilsStore()
const router = useRouter()
const withdrawalMethods = [
  { name: 'Bank Transfer', key: 'bank' },
  { name: 'Shop', key: 'shop' }
]
const activeMethod = ref('bank')
const bankAssets = ref([])
const selectedBank = ref(null)
const accountNumber = ref(null)
const withdrawalAmount = ref()
const isLoading = ref(false)
const buttonLoader = ref(false)

const transferReceiver = ref('')
const transferAmount = ref(0)
const transferPin = ref('')
const transferError = ref(false)

const transferErrorMessage = ref('')
const transferSuccess = ref(false)

const withdrawalSuccess = ref(false)
const withdrawalSuccessData = ref({})

const cashWithdrawalAmount = ref(0)
const cashWithdrawalSuccess = ref(false)
const cashWithdrawalSuccessData = ref({})
const cashRequestError = ref(false)
const cashRequestErrorMessage = ref('')

const accountError = ref(false)
const accountErrorMessage = ref('')

const amountError = ref(false)
const amountErrorMessage = ref('')

const searchQuery = ref('')

const balance = computed(() => {
  return usersStore.balance
})

function toggleShowBanks() {
  searchQuery.value = ''
  showBanks.value = !showBanks.value
}

function toggleBanksAssets() {
  showBanksAssets.value = !showBanksAssets.value
}

const isFormComplete = computed(() => {
  return (
    selectedBank.value !== null &&
    accountNumber.value !== null &&
    withdrawalAmount.value !== undefined
  )
})

const checkWithdrawableAmount = () => {
  if (withdrawalAmount.value > usersStore.balance) {
    amountError.value = true
    amountErrorMessage.value = `Amount exceeds your Withdrawable Balance ${usersStore.balance}`
  } else {
    amountError.value = false
    amountErrorMessage.value = ''
  }
}

function selectBank(bank) {
  selectedBank.value = bank
  showBanks.value = !showBanks.value
}

const filteredBanks = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) {
    return banksList // Return full list when search query is empty
  } else {
    return banksList.filter((bank) => bank.name.toLowerCase().includes(query))
  }
})

async function submit() {
  buttonLoader.value = true
  let payload = {
    accountNumber: accountNumber.value,
    bankCode: selectedBank.value.code,
    clientId: CLIENT_ID
  }

  if (bankAssets.value.length && bankAssets.value.filter((bank) => bank.bankCode === bankCode)) {
    let data = {
      account_name: selectedBank.value.accountName,
      bank_name: selectedBank.value.name,
      account_number: accountNumber.value,
      amount: withdrawalAmount.value,
      remaining_balance: parseFloat(usersStore.balance) - parseFloat(withdrawalAmount.value)
    }
    emitter.emit('showDialogueMessage', data)
  } else {
    const res = await verifyAccount(payload)
    buttonLoader.value = false
    if (res.success) {
      let data = {
        account_name: res.message,
        bank_name: selectedBank.value.name,
        account_number: accountNumber.value,
        amount: withdrawalAmount.value,
        remaining_balance: parseFloat(usersStore.balance) - parseFloat(withdrawalAmount.value)
      }
      emitter.emit('showDialogueMessage', data)
    } else {
      accountError.value = true
      accountErrorMessage.value = res.message
    }
  }
}

async function submitWithdrawalRequest(data) {
  let payload = {
    accountName: data.account_name,
    accountNumber: data.account_number,
    bankName: selectedBank.value.name,
    amount: data.amount.toString(),
    bankCode: selectedBank.value.code,
    clientId: CLIENT_ID,
    // bank_id: selectedBank.value.bank_id,
    type: 'online'
  }
  document.querySelector('.layout.mask').click()
  buttonLoader.value = true
  const res = await withdrawalRequest(payload)
  buttonLoader.value = false
  if (res.success) {
    withdrawalSuccessData.value = payload
    withdrawalSuccess.value = true
  } else {
    amountError.value = true
    amountErrorMessage.value = res.message
  }
}

async function checkUserBankAssets() {
  try {
    const userAssetRes = await fetchBankAssets()
    if (userAssetRes.data) {
      bankAssets.value = res.data
      selectedBank.value = {
        name: res.data[0].name,
        code: res.data[0].bankCode,
        accountName: res.data[0].accountName,
        accountNumber: res.data[0].accountNumber
      }
      accountNumber.value = res.data[0].accountNumber
    }
  } catch (err) {
    console.log(err)
  }
}

async function submitTransferRequest() {
  buttonLoader.value = true
  let payload = {
    pin: transferPin.value,
    toUsername: transferReceiver.value,
    amount: transferAmount.value
  }
  const res = await transferRequest(payload)
  buttonLoader.value = false

  if (res.success) {
    transferSuccess.value = true
  } else {
    transferError.value = true
    transferErrorMessage.value = res.message
  }
}

async function submitCashRequest() {
  let payload, res;
  buttonLoader.value = true
  try {
    if(activeMethod.value === 'smileandpay'){
      payload = {
        amount: cashWithdrawalAmount.value,
        action: 'payouts',
        type: 'cash'
      }
      res = await smileandpayPayout(payload)
    }else{
      payload = {
        amount: cashWithdrawalAmount.value.toString(),
        clientId: CLIENT_ID,
        type: 'cash'
      }
      res = await withdrawalRequest(payload)
    }
    buttonLoader.value = false
    if (res.success) {
      cashWithdrawalSuccessData.value = { amount: payload.amount, withdrawalCode: res.data.code }
      cashWithdrawalSuccess.value = true
    } else {
      cashRequestError.value = true
      cashRequestErrorMessage.value = res.message
    }
  } catch (error) {
    cashRequestError.value = true
    cashRequestErrorMessage.value = 'An Error Occured'
  }
}

onMounted(async () => {
  emitter.on('confirmWithdrawalAction', submitWithdrawalRequest)
  Promise.all([checkUserBankAssets()])
})
</script>

<style>
.af-button--primary {
  background: var(--brand-secondary);
  border: 0;
  border-radius: 2px;
  color: #ffffff;
  float: right;
  font-size: 1.066rem;
  /* font-weight: bold; */
  /* height: 3.33333333rem; */
  width: 100%;
}
.show-close .es-dialog-close {
  display: inline-block;
}
.es-dialog.m-dialog.withdraw-confirm {
  width: 90% !important;
}
.es-dialog.m-dialog.withdraw-confirm .es-dialog-close {
  display: inline-block;
}
.ng-withdraw-nav.m-nav-secondary .home-link {
  padding: 0 1rem 0 0.625rem;
}
.ng-withdraw-nav.m-nav-secondary .icon-help {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0 0.625rem;
}
.ng-withdraw-nav.m-nav-secondary .icon-help::before {
  content: '\e6cc';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.ng-withdraw-nav.m-nav-secondary .icon-help:before {
  font-size: 1.91666667rem;
  line-height: 1;
}
#withdraw {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  min-height: 100vh;
}
#withdraw #withdrawal-pin-create-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
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
  left: 0;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}
#withdraw .notice-withdrawal-pin {
  font-size: 1rem;
  margin-bottom: 1.33333333rem;
}
#withdraw .notice-withdrawal-pin .action {
  text-decoration: underline;
}
#withdraw .m-tabs-nav {
  border-bottom: 1px solid #eaecef;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
}
#withdraw .m-tabs-nav .m-tabs-ink-bar {
  background-color: var(--brand-highlight-text);
  background-color: var(--brand-secondary);
  bottom: 0;
  height: 0.33333333rem;
}
#withdraw .m-tabs-nav .m-tabs-tab {
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;
  padding-bottom: 1.066rem;
  padding-top: 1.66666667rem;
  text-align: center;
}
#withdraw .m-tabs-nav .m-tabs-tab.m-tabs-tab-active {
  color: #353a45;
  color: var(--text-type1-primary);
  border-bottom: 2px solid var(--brand-secondary);
}
#withdraw .error-msg {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 10px;
  line-height: 20px;
  min-height: 20px;
  text-align: left;
}
#withdraw .withdraw-bank {
  padding: 0 1.33333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-static {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #9ca0ab;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-top: 1.83333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-static.error {
  border-color: #e41827;
  border-color: var(--warning-primary);
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-prepend {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  padding: 0 0.83333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-name {
  color: #353a45;
  color: var(--text-type1-primary);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 14px;
  line-height: 48px;
  text-align: left;
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-name.blank {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-icon {
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  height: 20px;
  margin-left: 1.33333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-arrow {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  margin: 0 1.33333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-static .bank-static-arrow::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#withdraw .withdraw-bank .withdraw-bank-number {
  margin-top: 0.41666667rem;
}
#withdraw .withdraw-bank .withdraw-bank-number.static {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  border-color: #eaecef;
  border-color: var(--brand-border-type1);
}
#withdraw .withdraw-bank .withdraw-bank-number.static.error {
  border-color: #e41827;
  border-color: var(--warning-primary);
}
#withdraw .withdraw-bank .withdraw-bank-number.static .static-prepend {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  margin: 0 0.83333333rem;
}
#withdraw .withdraw-bank .withdraw-bank-number.static .static-content {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 8px 0;
}
#withdraw .withdraw-bank .withdraw-bank-number.static .static-content .static-label {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 10px;
  height: 12px;
  line-height: 12px;
  margin-bottom: 4px;
  text-align: left;
}
#withdraw .withdraw-bank .withdraw-bank-number.static .static-content .static-input {
  font-size: 14px;
  height: 16px;
  line-height: 16px;
}
#withdraw .withdraw-bank .withdraw-bank-number.static .static-content .static-content-delete-icon {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
  margin-right: 1.33333333rem;
}
#withdraw
  .withdraw-bank
  .withdraw-bank-number.static
  .static-content
  .static-content-delete-icon::before {
  content: '\e602';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#withdraw .withdraw-bank .switch-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 14px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 1.066rem;
  margin-top: 0.75rem;
}
#withdraw .withdraw-bank .switch-container .switch-bank {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 14px;
  line-height: 14px;
}
#withdraw .withdraw-bank .switch-container .switch-bank .switch-icon {
  margin-left: 0.66666667rem;
}
#withdraw .withdraw-bank .switch-container .switch-bank .switch-icon::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#withdraw .withdraw-bank .switch-container .switch-bank .switch-icon:before {
  font-size: 14px;
}
#withdraw .withdraw-footer {
  padding: 0 1.33333333rem;
}
#withdraw .withdraw-footer .balance-container {
  font-size: 12px;
  line-height: 19px;
  margin-bottom: 0.41666667rem;
  padding: 20px 0;
  text-align: right;
}
#withdraw .withdraw-footer .balance-container > *:not(:last-child) {
  margin-bottom: 5px;
}
#withdraw .withdraw-footer .balance-container .balance-text {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  vertical-align: middle;
}
#withdraw .withdraw-footer .balance-container .withdrawable-text-wrapper {
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
  color: #353a45;
  color: var(--text-type1-primary);
}
#withdraw .withdraw-footer .balance-container .withdrawable-text-wrapper .m-icon-help {
  margin-right: 5px;
}
#withdraw .withdraw-footer .balance-container .withdrawable-text-wrapper .m-icon-help::before {
  content: '\e686';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#withdraw .withdraw-footer .balance-container .withdrawable-text-wrapper .m-icon-help:active,
#withdraw .withdraw-footer .balance-container .withdrawable-text-wrapper .m-icon-help:hover {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
#withdraw .withdraw-footer .withdraw-amount {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0.66666667rem 0;
}
#withdraw .withdraw-footer .withdraw-amount .amount-prepend {
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
}
#withdraw .withdraw-footer .withdraw-amount input {
  text-align: right;
}
#withdraw .withdraw-footer .withdraw-submit {
  border: none;
  height: 4rem;
  margin-bottom: 2rem;
  width: 100%;
}
#withdraw .withdraw-footer .example-cards-container {
  margin-bottom: 1.83333333rem;
  margin-top: 1.5rem;
  text-align: center;
}
#withdraw .withdraw-footer .example-cards-container .example-card {
  height: 1.66666667rem;
  margin-right: 0.5rem;
  vertical-align: center;
  width: 2.5rem;
}
#withdraw .select-prepend {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 1.33333333rem;
  width: 100%;
}
#withdraw .select-prepend .new-pay {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid var(--brand-highlight-text);
  font-size: 14px;
  font-weight: bold;
  line-height: 3.5rem;
  text-align: center;
  width: 100%;
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
}
#withdraw .p-x-16 {
  padding: 0 1.33333333rem;
}
#withdraw #withdraw-banner-container {
  margin-top: 2.5rem;
  overflow: hidden;
}
#withdraw #withdraw-banner-container > img {
  width: 100%;
}
#withdraw .transfer-wrapper {
  padding: 1.66666667rem 1.33333333rem;
}
.m-wd-coming-soon-container {
  height: calc(100vh - 4.16666667rem);
}

body {
  width: 100%;
}
#popup-select .popup-modal {
  background-color: #353a45;
  background-color: var(--text-type1-primary);
  height: 100%;
  left: 0;
  opacity: 0.4;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
}
#popup-select .select-container {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border-top: 6px solid #eaecef;
  bottom: 0;
  height: 50%;
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 501;
  border-top-color: #eaecef;
  border-top-color: var(--brand-border-type1);
}
#popup-select .select-container .m-close {
  height: 22px;
  position: absolute;
  right: 26px;
  top: -28px;
  width: 46px;
}
#popup-select .select-container .content {
  height: 100%;
  overflow-y: auto;
}
#popup-select .select-container .m-head .action {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 16px;
  height: 19px;
  line-height: normal;
  margin-bottom: 1.66666667rem;
  margin-top: 0.83333333rem;
  padding: 0 1.33333333rem;
  text-align: right;
}
#popup-select .select-container .m-body .select-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 1.66666667rem;
  padding-left: 1.33333333rem;
  width: 100%;
}
#popup-select .select-container .m-body .select-list .select-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
#popup-select .select-container .m-body .select-list .select-item .item-left {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 1.33333333rem;
  width: 1.5rem;
}
#popup-select .select-container .m-body .select-list .select-item .item-left.selected::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#popup-select .select-container .m-body .select-list .select-item .item-left.selected::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 1.5rem;
  line-height: 1;
}
#popup-select .select-container .m-body .select-list .select-item .item-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1.066rem 0;
  text-align: left;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
}
#popup-select .select-container .m-body .select-list .select-item .item-right .item-icon {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 20px;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .item-main {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-left: 0.66666667rem;
  margin-right: 1.41666667rem;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .item-title {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.066rem;
  line-height: 1;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .item-desc {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1rem;
  line-height: 1;
  margin-top: 0.5rem;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .icon-delete {
  color: #e41827;
  color: var(--warning-primary);
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 1.08333333rem;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .icon-delete::before {
  content: '\e602';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#popup-select .select-container .m-body .select-list .select-item .item-right .icon-delete:before {
  font-size: 1.066rem;
  line-height: 1;
}
#popup-select .fade-enter-active,
#popup-select .fade-leave-active {
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
#popup-select .fade-enter,
#popup-select .fade-leave-to {
  opacity: 0;
}
#popup-select .slide-enter-active,
#popup-select .slide-leave-active {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
#popup-select .slide-enter,
#popup-select .slide-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}
</style>

<template>
  <div
    class="m-wd-pop-cfm es-dialog m-dialog"
    style="z-index: 1001; position: fixed; transform: none"
  >
    <div class="es-dialog-head m-dialog-head">
      <h1><div>Confirm to Withdraw</div></h1>
      <a hidefocus="true" data-action="close" class="es-dialog-close m-dialog-close"><em></em></a>
    </div>
    <div class="es-dialog-body m-dialog-body">
      <div class="es-dialog-main m-dialog-main" style="height: auto">
        <div class="m-wd-ng-cfm">
          <div class="f-con">
            <div class="f-main">
              <div class="f-line">
                <div class="i-label" data-cms-key="remaining_amount" data-cms-page="page_withdraw">
                  Remaining Amount
                </div>
                <p data-op="withdraw-confirm-remaining-amount" class="i-value">
                  {{ formatNumber(userData.remaining_balance) }}
                </p>
              </div>
              <div class="f-line">
                <div class="i-label" data-cms-key="bank_name" data-cms-page="page_payment">
                  Bank Name
                </div>
                <div data-op="withdraw-confirm-bank-name" class="i-value">
                  {{ userData.bank_name }}
                </div>
              </div>
              <div class="f-line">
                <div class="i-label" data-cms-key="account_number" data-cms-page="page_payment">
                  Account Number
                </div>
                <p data-op="withdraw-confirm-bank-account-number" class="i-value">
                  {{ userData.account_number }}
                </p>
              </div>
              <div class="f-line">
                <div class="i-label" data-cms-key="account_name" data-cms-page="page_withdraw">
                  Account Name
                </div>
                <p data-op="withdraw-confirm-bank-account-name" class="i-value">
                  {{ formatString(userData.account_name, 'post') }}
                </p>
              </div>
              <div class="payment-wrapper">
                <div class="payment-container">
                  <div class="t-b item-label">
                    <span data-cms-key="withdrawal_amount" data-cms-page="page_withdraw"
                      >Withdrawal Amount</span
                    >
                    ({{ SportsbookGlobalVariable.CurrencyCode }})
                  </div>
                  <div data-op="partner-withdraw-confirm-amount" class="t-b item-content">
                    {{ formatNumber(userData.amount) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="f-btn-wrapper">
              <button @click.prevent="$emit('close-modal')" class="af-button af-button--info">
                <span><span>Cancel</span></span>
              </button>
              <button @click.prevent="confirmWithdrawal" class="af-button af-button--primary">
                <span> Confirm </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatNumber, formatString } from '@/helpers'
import emitter from '@/plugins/emitter'
import { useUtilsStore } from '@/stores'
const { SportsbookGlobalVariable } = useUtilsStore()

const props = defineProps({
  userData: Object
})

const emits = defineEmits(['close-modal'])

function confirmWithdrawal() {
  emitter.emit('confirmWithdrawalAction', props.userData)
}
</script>

<style scoped>
.es-dialog.m-wd-pop-cfm {
  bottom: 0 !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 0 !important;
  margin: 0 !important;
  padding: 1.33333333rem 0 0 0;
  right: 0 !important;
  top: auto !important;
  width: 100% !important;
}
.es-dialog.m-wd-pop-cfm .es-dialog-main {
  padding: 0;
}
.es-dialog.m-wd-pop-cfm .f-main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1rem;
  padding: 0 1.33333333rem;
  color: #353a45;
  color: var(--text-type1-primary);
}
.es-dialog.m-wd-pop-cfm .t-c {
  text-align: center;
}
.es-dialog.m-wd-pop-cfm .f-line {
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  display: grid;
  grid-template-columns: 11.25rem 1fr;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  width: 100%;
}
.es-dialog.m-wd-pop-cfm .i-label,
.es-dialog.m-wd-pop-cfm .i-value {
  display: table-cell;
  vertical-align: middle;
}
.es-dialog.m-wd-pop-cfm .i-label {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  width: 11.25rem;
}
.es-dialog.m-wd-pop-cfm .i-value {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
  padding-left: 0.41666667rem;
  text-align: right;
}
.es-dialog.m-wd-pop-cfm .t-s {
  line-height: 1.066rem;
}
.es-dialog.m-wd-pop-cfm .t-b {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  margin: 0.66666667rem 0 2rem;
}
.es-dialog.m-wd-pop-cfm .f-btn-wrapper {
  font-size: 0;
  margin-top: 1.5rem;
  width: 100%;
}
.es-dialog.m-wd-pop-cfm .af-button {
  border: none;
  border-radius: 0;
  font-size: 1.33333333rem;
  font-weight: bold;
  height: 4rem;
  vertical-align: bottom;
}
.es-dialog.m-wd-pop-cfm .af-button--primary {
  width: 74%;
  background-color: var(--brand-secondary);
}
.es-dialog.m-wd-pop-cfm .af-button--info {
  background-color: var(--brand-secondary);
  filter: grayscale();
  width: 26%;
  color: white;
}
.es-dialog.m-wd-pop-cfm .payment-wrapper {
  border-top: 0.5px solid #9ca0ab;
  margin-top: 10px;
  padding-top: 10px;
  border-top-color: #9ca0ab;
  border-top-color: var(--text-type1-secondary);
}
.es-dialog.m-wd-pop-cfm .payment-wrapper .item-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.es-dialog.m-wd-pop-cfm .payment-wrapper .item-wrapper .m-icon-help::before {
  content: '\e686';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.es-dialog.m-wd-pop-cfm .payment-wrapper .item-wrapper .m-icon-help:active,
.es-dialog.m-wd-pop-cfm .payment-wrapper .item-wrapper .m-icon-help:hover {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
.es-dialog.m-wd-pop-cfm .payment-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.es-dialog.m-wd-pop-cfm .payment-container .item-label {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 50%;
  -ms-flex: 0 1 50%;
  flex: 0 1 50%;
}
.es-dialog.m-wd-pop-cfm .payment-container .item-content {
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
}
</style>

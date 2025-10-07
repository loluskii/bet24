<template>
  <div class="withdraw-success">
    <div class="icon-container">
      <svg
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
        height="48px"
        width="48px"
        class="svg-icon-base"
      >
        <path
          d="M5.973.006a5.969 5.969 0 100 11.937 5.969 5.969 0 000-11.937zM9.26 4.692L5.367 8.585a.615.615 0 01-.872 0L2.32 6.411a.617.617 0 11.873-.873l1.738 1.738 3.457-3.457a.617.617 0 01.872.873z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
    <p class="success-msg">Withdrawal Request Recieved!</p>

    <div class="success-line"></div>
    <div class="success-form amount">
      <div class="form-label">
        <span data-cms-key="amount">Amount</span>
        ({{ SportsbookGlobalVariable.CurrencyCode }})
      </div>
      <div data-op="withdraw-success-amount" class="form-value">
        {{ formatNumber(userData.amount) }}
      </div>
    </div>
    <div class="success-form withdraw">
      <div class="form-label" data-cms-key="withdraw_to" data-cms-page="page_withdraw">
        Withdraw To
        <img
          src="//s.sporty.net/global/main/common/images/card/default-card.e8dea6abcc.png"
          class="form-value icon"
        />
      </div>

      <div class="bank-details">
        <span data-op="withdraw-success-bank-name" class="form-value name">{{
          userData.bankName
        }}</span>
        <span data-op="withdraw-success-bank-account-number" class="form-value">{{
          formatString(userData.accountNumber, 'pre')
        }}</span>
      </div>
    </div>
    <div class="success-form">
      <div class="form-label" data-cms-key="account_name" data-cms-page="page_withdraw">
        Account Name
      </div>
      <div data-op="withdraw-success-bank-account-name" class="form-value fs-exclude">
        {{ formatString(userData.accountName, 'post') }}
      </div>
    </div>

    <div class="static-button" @click="$router.push({ name: 'home' })">Continue Betting</div>
    <div
      class="check-transaction-container"
      @click="$router.push({ name: 'account-transactions' })"
    >
      <span
        class="check-transaction"
        data-cms-key="check_status_in_transactions"
        data-cms-page="page_payment"
        >Check status in Transactions</span
      >
      <i class="icon-right"></i>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { formatNumber, formatString } from '@/helpers'
import { useUsersStore, useUtilsStore } from '@/stores'
const userStore = useUsersStore()
const { SportsbookGlobalVariable } = useUtilsStore()

defineProps({
  userData: Object
})

onMounted(async () => {
  await userStore.loadCurrentUser()
})
</script>

<style scoped>
.withdraw-success {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100vh;
  padding: 5rem 1.33333333rem 0 1.33333333rem;
  position: relative;
  width: 100%;
}
.withdraw-success .icon-container {
  color: var(--brand-secondary);
  text-align: center;
}
.withdraw-success .success-msg {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 18px;
  font-weight: bold;
  line-height: 27px;
  margin-bottom: 1.66666667rem;
  margin-top: 1.66666667rem;
  text-align: center;
}
.withdraw-success .manual-text {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 16px;
  line-height: 18px;
  padding: 0 6.66666667rem;
  text-align: center;
}
.withdraw-success .success-line {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  height: 0.33333333rem;
  margin-bottom: 2.5rem;
  margin-top: 1.25rem;
  width: 100%;
}
.withdraw-success .success-form {
  -webkit-box-align: start;
  -webkit-align-items: start;
  -ms-flex-align: start;
  align-items: start;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: space-between;
  margin-bottom: 1.66666667rem;
  white-space: nowrap;
  color: #353a45;
  color: var(--text-type1-primary);
}

.withdraw-success .success-form .bank-details {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  text-align: right;
  white-space: nowrap;
  color: #353a45;
  color: var(--text-type1-primary);
}
.withdraw-success .success-form .form-label {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
.withdraw-success .success-form .form-value {
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
}
.withdraw-success .success-form .form-value.icon {
  height: 20px;
  margin-right: 0.5rem;
}
.withdraw-success .success-form .form-value.name {
  /* margin-right: 2rem; */
}
.withdraw-success .success-form.amount {
  margin-bottom: 1.66666667rem;
}
.withdraw-success .success-form.trade {
  margin-bottom: 4rem;
}
.withdraw-success .static-button {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: none;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  height: 4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 1.33333333rem;
  width: 100%;
  color: #ffffff;
  background-color: var(--brand-secondary);
}
.withdraw-success .check-transaction-container {
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
.withdraw-success .check-transaction-container .check-transaction {
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
}
.withdraw-success .check-transaction-container .icon-right {
  color: var(--brand-secondary);
  -webkit-box-flex: 0;
  -webkit-flex: 0;
  -ms-flex: 0;
  flex: 0;
  font-size: 16px;
  margin-left: 0.83333333rem;
}
.withdraw-success .check-transaction-container .icon-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.withdraw-success .check-transaction-container .icon-right:before {
  vertical-align: middle;
}
.withdraw-success .bvn-gift-banner {
  bottom: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  left: 0;
  position: absolute;
  width: 100%;
}
.withdraw-success .bvn-gift-banner a {
  padding: 1.33333333rem;
}
.withdraw-success .bvn-gift-banner a img {
  width: 100%;
}
</style>

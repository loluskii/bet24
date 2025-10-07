<template>
  <div id="me-container" style="min-height: 55%">
    <div class="me-main">
      <div class="header-container">
        <div class="header">
          <div class="account-wrap" @click="redirectToAccount">
            <span class="user">
              <img
                data-v-7405fc91=""
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDkiIGhlaWdodD0iNDkiIHZpZXdCb3g9IjAgMCA0OSA0OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNC40MDQ4IDQ0LjkzNzdDMzUuNTg4NiA0NC45Mzc3IDQ0LjY1NDggMzUuODcxNSA0NC42NTQ4IDI0LjY4NzdDNDQuNjU0OCAxMy41MDQgMzUuNTg4NiA0LjQzNzc0IDI0LjQwNDggNC40Mzc3NEMxMy4yMjEgNC40Mzc3NCA0LjE1NDc5IDEzLjUwNCA0LjE1NDc5IDI0LjY4NzdDNC4xNTQ3OSAzNS44NzE1IDEzLjIyMSA0NC45Mzc3IDI0LjQwNDggNDQuOTM3N1pNMjYuODY3NiAyMy4zNjA3QzI4LjgxMTcgMjIuMjk1MSAzMC4xNDM5IDIwLjExNTQgMzAuMTQzOSAxNy41OTk2QzMwLjE0MzkgMTQuMDMzOCAyNy40Njc0IDExLjE0MzEgMjQuMTY1NyAxMS4xNDMxQzIwLjg2NCAxMS4xNDMxIDE4LjE4NzQgMTQuMDMzOCAxOC4xODc0IDE3LjU5OTZDMTguMTg3NCAyMC4xMjMgMTkuNTI3NyAyMi4zMDgzIDIxLjQ4MTQgMjMuMzcwM0MxNS43NTEgMjQuODIxMyAxMy40MDQ4IDI5LjM2MjQgMTMuNDA0OCAzMi42NjQ5SDIzLjgyNThIMzUuNDA0OEMzNS40MDQ4IDI4LjQ2OCAzMS43NTcgMjQuNDEwMiAyNi44Njc2IDIzLjM2MDdaTTEzLjQwNDggMzIuNjY0OUMxNC4xMDE0IDM1LjgwNTEgMTguNzYwNyAzOC4yMzI0IDI0LjQwNDggMzguMjMyNEMzMC4wNDg4IDM4LjIzMjQgMzQuNzA4MSAzNS44MDUxIDM1LjQwNDggMzIuNjY0OUgxMy40MDQ4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
              />
            </span>
            <div class="wording-wrap">
              <div class="account">
                {{ authStore.isAuthenticated ? userStore.currentUser?.username : 'Login to view' }}
              </div>
              <i class="m-icon-arrow1"></i>
            </div>
          </div>
          <div class="balance-wrap">
            <div class="title">Total Balance</div>
            <div data-op="me_balance" class="value">
              <span>{{ SportsbookGlobalVariable.CurrencyCode }} </span
              ><span> {{ userStore.balance }}</span>
            </div>
          </div>
          <div class="w-d-wrap">
            <div class="deposit" @click="$router.push({ name: 'account-deposit' })">
              <img src="@/assets/images/wallet.png" class="w-d-wrap-img" /><span>Deposit</span>
            </div>
            <div class="withdraw" @click="$router.push({ name: 'account-withdraw' })">
              <span>Withdraw</span>
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="transaction-wrap">
          <div @click="$router.push({ name: 'open-bets' })" class="transaction-wrap-item history">
            <img
              src="//s.sporty.net/global/main/brand/sportybet/mobile/images/bet_history.76d3fd43f4.svg"
              class="transaction-wrap-item-img"
            /><span>Bet History</span>
          </div>
          <div
            @click="$router.push({ name: 'account-transactions' })"
            class="transaction-wrap-item transaction"
          >
            <img
              src="//s.sporty.net/global/main/brand/sportybet/mobile/images/transaction.4d2d40c644.svg"
              class="transaction-wrap-item-img"
            /><span style="color: #eaecef;">Transactions</span>
          </div>
          <div class="transaction-wrap-item gift" @click="$router.push({ name: 'account-bonus' })">
            <img
              src="//s.sporty.net/global/main/brand/sportybet/mobile/images/gift.0c7224b2a3.svg"
              class="transaction-wrap-item-img"
            /><span>Bonus</span>
          </div>
        </div>
        <div class="list-wrap" v-if="authStore.isAuthenticated">
          <div
            class="item"
            style="color: #ccc"
            @click="$router.push({ name: 'account-pending-withdrawals' })"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              fill="transparent"
              class="bi bi-clock"
              viewBox="0 0 16 16"
              stroke="#ccc"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
              />
            </svg>
            <div class="title" style="padding-left: 10px">
              <span>Pending Withdrawals</span>
            </div>

            <div class="item-img more icon-font-base" style="font-size: 1.33333rem"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useUsersStore, useUtilsStore } from '@/stores'
// import { formatNumber } from '@/helpers'
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUsersStore()
const { SportsbookGlobalVariable } = useUtilsStore()

function redirectToAccount() {
  router.push({ name: 'account-profile' })
}
defineComponent({
  name: 'me-view'
})
</script>

<style>
#me-container {
  /* background: var(--brand-background-secondary); */

  /* background: rgb(233, 45, 45); */
  background: linear-gradient(
    188deg,
    var(--background-type1-secondary) 100%,
    var(--brand-primary) 0%
  );
}

.me-main .header-container {
  /* background: var(--brand-background-secondary);
  background: linear-gradient(
    176deg,
    var(--brand-background-secondary) 38%,
    rgba(255, 255, 255, 1) 100%
  ); */
  color: #ffffff;
  color: var(--text-type2-primary);
  padding: 1.66666667rem 1.33333333rem;
}

.me-main .header-container .header {
  position: relative;
}

.me-main .header-container .header .account-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.33333333rem;
  height: 4.41666667rem;
  position: relative;
}

.me-main .header-container .header .account-wrap .user {
  border-radius: 50%;
  height: 5rem;
  margin-right: 0.66666667rem;
  overflow: hidden;
  width: 5rem;
}

.me-main .header-container .header .account-wrap .user img {
  height: 100%;
  vertical-align: top;
  width: 100%;
}

.me-main .header-container .header .account-wrap .wording-wrap {
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
}

.me-main .header-container .header .account-wrap .wording-wrap .account {
  display: inline-block;
  font-weight: 500;
  margin-right: 0.66666667rem;
}

.me-main .header-container .header .account-wrap .wording-wrap .account .name {
  max-width: 50vw;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
}

.me-main .header-container .header .account-wrap .wording-wrap .account .phone {
  color: #9ca0ab;
  color: var(--text-type2-tertiary);
}

.me-main .header-container .header .account-wrap .wording-wrap .m-icon-arrow1 {
  color: #9ca0ab;
  color: var(--text-type2-tertiary);
}

.me-main .header-container .header .account-wrap .wording-wrap .m-icon-arrow1::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.me-main .header-container .header .account-wrap .wording-wrap .m-icon-arrow1:before {
  font-size: 1rem;
  line-height: 1rem;
}

.me-main .header-container .header .account-wrap .bell-icon {
  margin-right: 1.66666667rem;
}

.me-main .header-container .header .balance-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  font-size: 1.066rem;
  margin-top: 1.66666667rem;
  position: relative;
}

.me-main .header-container .header .balance-wrap .title {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  color: #fff;
  font-size: 1rem;
}

.me-main .header-container .header .balance-wrap .value {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.833rem;
}

.me-main .header-container .header .balance-wrap .value .invisible {
  letter-spacing: 0.16666667rem;
  opacity: 0.5;
}

.me-main .header-container .header .w-d-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 1.66666667rem;
}

.me-main .header-container .header .w-d-wrap div.deposit {
  background-color: var(--brand-secondary);
  font-weight: 500;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  width: calc(50% - 0.66666667rem);
}

.me-main .header-container .header .w-d-wrap div.withdraw {
  border: 1px solid white;
  font-weight: 500;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  width: calc(50% - 0.66666667rem);
  color: white;
}

.me-main .header-container .header .w-d-wrap div .w-d-wrap-img {
  height: 50%;
  margin-right: 1rem;
}

.me-main .header-container .header .w-d-wrap div .w-d-wrap-img + span {
  color: #ffffff;
}

.me-main .body {
  color: #fff;
  color: var(--text-default);
}

.me-main .body .transaction-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1.33333333rem;
  /* filter: invert(1); */
}

.me-main .body .transaction-wrap-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  text-align: center;
  width: 8rem;
}

.me-main .body .transaction-wrap-item.gift {
  position: relative;
}

.me-main .body .transaction-wrap-item-img {
  height: 1.66666667rem;
  margin-bottom: 0.66666667rem;
}

.me-main .body .list-wrap a.item {
  color: inherit;
}

.me-main .body .list-wrap .item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  height: 4.08333333rem;
  padding: 0 0.66666667rem 0 1.66666667rem;
}

.me-main .body .list-wrap .item .item-img {
  margin-right: 1rem;
}

.me-main .body .list-wrap .item .item-img.more {
  color: #9ca0ab;
}

.me-main .body .list-wrap .item .title {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.me-main .body .list-wrap .item .status {
  color: var(--brand-highlight-text);
  font-weight: 500;
  margin-right: 0.33333333rem;
}

.me-main .body .list-wrap .item .count {
  background-color: #e41827;
  border-radius: 1rem;
  color: #ffffff;
  font-size: 0.83333333rem;
  min-width: 2.08333333rem;
  padding: 0.16666667rem 0.33333333rem;
  text-align: center;
}

.me-main .body .list-wrap .item .red-dot {
  background-color: #e41827;
  border-radius: 50%;
  height: 7px;
  margin-right: 0.33333333rem;
  width: 7px;
}

.me-main .body .list-wrap .item .kyc {
  font-size: 1rem;
  font-weight: 400;
  padding: 0.5rem 1rem;
}

.me-main .body .list-wrap .item .kyc.bg {
  background-color: var(--brand-highlight-text);
  border-radius: 0.16666667rem;
  color: #ffffff;
}

.red-dot-with-num {
  background-color: #e41827;
  border-radius: 50%;
  color: #ffffff;
  font-size: 12px;
  line-height: 1;
  min-width: 1rem;
  padding: 0.25rem 0.16666667rem;
  position: absolute;
  -webkit-transform: translate(90%, -60%);
  -ms-transform: translate(90%, -60%);
  transform: translate(90%, -60%);
}
</style>

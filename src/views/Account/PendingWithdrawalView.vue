<template>
  <div class="m-trans-wrap">
    <div id="transaction-list-container">
      <div class="m-nav-secondary withHome">
        <div class="m-nav-left">
          <span @click="toggleView" class="m-icon m-icon--back"></span>
          <span class="title"> {{ view }} </span>
        </div>
        <div class="info-container">
          <div class="m-nav-right">
            <div @click="$router.push({ name: 'home' })" class="home-link">
              <div class="home-icon"></div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="viewMode === 'list'">
        <LoadingSpinner v-if="isLoading"></LoadingSpinner>
        <div class="list-bg" v-else style="position: relative">
          <ul v-if="transactionData" class="m-trans-list">
            <li
              v-for="(item, index) in transactionData"
              :key="index"
              data-op="transaction_item"
              @click="seeDetail(item)"
            >
              <div class="m-trans-r1">
                <em data-op="transaction_type"
                  >{{ item.withdrawal_code ? 'Shop' : 'Bank' }} Withdrawal</em
                >
                <i data-op="transaction_amount" class="m-txt-dark-gray">
                  -{{ formatNumber(item.amount) }}
                </i>
              </div>
              <div class="m-trans-r2">
                <em>{{
                  item.withdrawal_code
                    ? item.withdrawal_code
                    : item.bank_name && item.account_number
                      ? `${item.bank_name} ${item.account_number}`
                      : 'N/A'
                }}</em>
                <i class="text-danger" v-if="item.status === 2">Failed</i>
                <i class="text-success" v-if="item.status === 1">Completed</i>
                <i class="text-warning" v-if="item.status === 0">Pending</i>
              </div>
            </li>
          </ul>
          <div v-else class="m-list-none">
            <span class="no-list-txt"
              ><i class="m-icon--pageques"></i>
              <span data-cms-key="no_records_found" data-cms-page="common_feedback"
                >No Records Found.</span
              ></span
            >
          </div>
        </div>
      </template>
      <template v-else>
        <TransactionDetail :data="selectedTransaction" :type="'pending_withdrawals'" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPendingWithdrawalsData, formatDate, formatNumber } from '@/helpers'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import emitter from '../../plugins/emitter'

import '@vuepic/vue-datepicker/dist/main.css'
import TransactionDetail from '@/components/TransactionDetail.vue'

const transactionData = ref()
const router = useRouter()
const isLoading = ref(false)
const view = ref('Pending Withdrawals')
const viewMode = ref('list')
const selectedTransaction = ref(null)

async function getData(start, end) {
  try {
    isLoading.value = true
    const res = await getPendingWithdrawalsData()
    transactionData.value = res.data
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const toggleView = () => {
  if (viewMode.value === 'detail') {
    view.value = 'Pending Withdrawals'
    viewMode.value = 'list'
    selectedTransaction.value = null
  } else {
    return router.go(-1)
  }
}

const seeDetail = (item) => {
  view.value = 'Detail'
  viewMode.value = 'detail'
  selectedTransaction.value = item
}

onMounted(async () => {
  await getData().then(() => {
    setTimeout(() => {
      emitter.emit('showDialogueToaster', 'NOTE: Click on a transaction to view more details')
    }, 1000)
  })
})
</script>

<style type="text/css">
.dp-custom-input {
  /* border-radius: 0; */
  /* border: 0/; */
}

.dp-custom-menu {
  box-shadow: 0 0 6px #1976d2;
}

.m-trans-wrap {
  font-family: Roboto, sans-serif;
}

.m-main-mid {
  color: #353a45;
}

.m-nav-secondary {
  position: relative;
  z-index: 1;
}

.m-nav-secondary .title {
  font-size: 1.66666667rem;
}

.m-trans-fixed {
  display: none;
  position: fixed;
  top: 0;
  z-index: 10;
}

.m-trans-list {
  line-height: 1.5;
}

.m-trans-list li:not(.m-trans-mon) {
  border-bottom: 1px solid #f2f3f5;
  margin: 0 1.33333333rem;
  padding: 0.91666667rem 0;
}

.m-trans-list li:not(.m-trans-mon):after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

.m-trans-list li:not(.m-trans-mon) em {
  float: left;
  width: 55%;
}

.m-trans-list li:not(.m-trans-mon) i {
  float: right;
  text-align: right;
  width: 45%;
}

.m-trans-list .m-trans-r1 {
  font-size: 1.33333333rem;
  font-weight: 500;
  line-height: 1;
  padding-bottom: 0.33333333rem;
  padding-top: 0.08333333rem;
}

.m-trans-list .m-trans-r1:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

.m-trans-list .m-trans-r1 i {
  font-size: 1.66666667rem;
  font-weight: 400;
  position: relative;
  top: 0.25rem;
}

.m-trans-list .m-trans-r2 {
  color: #9ca0ab;
  font-size: 1rem;
  line-height: 1;
  padding-bottom: 0.08333333rem;
}

.m-trans-list .m-trans-r2:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

.m-trans-list .m-trans-mon {
  height: 2.5rem;
}

.m-trans-list .m-trans-mon:first-child div {
  -webkit-box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
}

.m-trans-list .m-trans-mon div {
  background: #fafafa;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-left: 5%;
  padding-top: 0.16666667rem;
  text-align: left;
  width: 100%;
}

.m-trans-list .m-trans-mon-fixed {
  -webkit-box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.13);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.m-trans-select-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  height: 100vh;
  position: fixed;
  top: 0;
  width: 100%;
}

.m-list-none {
  padding: 12.5rem 0 0;
  text-align: center;
  background-color: transparent;
}

.no-list-txt {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1.33333333rem;
}

.no-list-txt .m-icon--pageques {
  display: block;
  height: 3.83333333rem;
  line-height: 3.83333333rem;
  margin: 0 auto 1.08333333rem;
}

.no-list-txt .m-icon--pageques::before {
  content: '\e61b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.no-list-txt .m-icon--pageques::before {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
  font-size: 3.83333333rem;
}

.no-list-more-records {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1rem;
  line-height: 1.066rem;
  margin-top: 1rem;
  text-align: center;
}

#transaction-list-container .m-custom-selection-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 50px;
  padding: 10px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-color: #eaecef;
  border-color: var(--background-type1-tertiary);
}

#transaction-list-container .m-custom-selection-wrapper > * {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

#transaction-list-container .m-custom-selection-wrapper .m-custom-type {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-right: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: 500;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  border-right-color: #eaecef;
  border-right-color: var(--background-type1-tertiary);
}

.m-trans-list .m-trans-mon:first-child div {
  -webkit-box-shadow: 0 1px 6px 0 rgba(34, 37, 45, 0.13);
  box-shadow: 0 1px 6px 0 rgba(34, 37, 45, 0.13);
}

.m-trans-list .m-trans-mon div {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-left: 5%;
  padding-top: 0.16666667rem;
  text-align: left;
  width: 100%;
}

.m-trans-list .m-trans-mon-fixed {
  -webkit-box-shadow: 0 1px 6px 0 rgba(34, 37, 45, 0.13);
  box-shadow: 0 1px 6px 0 rgba(34, 37, 45, 0.13);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.m-trans-select-backdrop {
  height: 100vh;
  opacity: 0.27;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #000000;
  background-color: var(--absolute-type2);
}

#transaction-list-container .loading-more-wrapper .m-loading-wrap {
  background-color: var(--background-type1-quaternary);
  min-height: 1.66666667rem;
}

#transaction-list-container .loading-more-wrapper .m-loading-wrap .m-loading .loading {
  background-color: var(--background-type1-quaternary);
}

#transaction-list-container .m-transaction-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 20;
}

#transaction-list-container .list-bg {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}

#transaction-list-container .trans-select {
  position: absolute;
}

#transaction-list-container .trans-select .af-select {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

#transaction-list-container .trans-select .af-select .af-select-title {
  display: none;
}

#transaction-list-container .trans-select .af-select .af-select-title .af-select-input {
  display: hidden;
}

#transaction-list-container .trans-select .af-select .af-select-list {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: none;
  border-top: 1px solid;
  -webkit-box-shadow: 0 1px 4px 0 rgba(34, 37, 45, 0.2);
  box-shadow: 0 1px 4px 0 rgba(34, 37, 45, 0.2);
  position: relative;
  border-top-color: #dcdee5;
  border-top-color: var(--disable-brand-secondary);
}

#transaction-list-container .trans-select .af-select .af-select-list .af-select-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  height: 3rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  line-height: 3rem;
  padding: 0 2rem;
  text-align: left;
}

#transaction-list-container .trans-select .af-select .af-select-list .af-select-item.active:after {
  content: '\e611';
  float: right;
  font-family: 'iconfont';
  font-size: 1.33333333rem;
}

#transaction-list-container .trans-select .af-select .af-select-list .af-select-item.hover {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}

#transaction-list-container .m-custom-selection-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 30px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-color: #eaecef;
  border-color: var(--background-type1-tertiary);
}

#transaction-list-container .m-custom-selection-wrapper > * {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

#transaction-list-container .m-custom-selection-wrapper .m-custom-type {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-right: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: 500;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  border-right-color: #eaecef;
  border-right-color: var(--background-type1-tertiary);
}

#transaction-list-container .m-custom-selection-wrapper .m-custom-type.m-custom-type-active {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}

#transaction-list-container .m-custom-selection-wrapper .m-calendar {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: 500;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}

#transaction-list-container .m-custom-selection-wrapper .m-calendar.m-custom-date-active {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}

#transaction-list-container .m-custom-selection-wrapper .arrow-icon {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-family: 'iconfont';
  width: auto;
}

#transaction-list-container .m-custom-selection-wrapper .arrow-icon:before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  content: '\e6A3';
  display: inline-block;
  font-size: 0.83333333rem;
}

#transaction-list-container .m-custom-selection-wrapper .arrow-icon.open:before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.m-nav-secondary {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: rgb(222, 226 ,230);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 1.33333333rem;
  height: 3.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 1.33333333rem 0 1.66666667rem;
  width: 100%;
}

.m-nav-secondary .m-nav-left {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}

.m-nav-secondary .m-nav-left .m-icon {
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
  margin-right: 1.58333333rem;
}

.m-nav-secondary .m-nav-left .m-icon :before {
  font-size: 1.33333333rem !important;
}

.m-nav-secondary .m-nav-left .m-icon.m-icon--back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-nav-secondary .m-nav-left .m-icon--close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-nav-secondary .m-nav-left .m-icon--close :before {
  font-size: 1.5rem !important;
}

.m-nav-secondary.withHome {
  padding: 0 0 0 1.66666667rem;
}

.m-nav-secondary a :visited,
.m-nav-secondary a :active,
.m-nav-secondary a :link,
.m-nav-secondary a :hover {
  color: #ffffff;
  color: var(--text-type2-primary);
  text-decoration: none;
}

.m-nav-secondary .title {
  font-size: 1.66666667rem;
  line-height: 2rem;
}

.m-nav-secondary .title.small-font-height {
  font-size: 1.066rem;
  line-height: 1.5rem;
}

.m-nav-secondary .m-login-balance {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
}

.m-nav-secondary .m-login-balance .m-login-jump span {
  padding: 0 0.66666667rem;
}

.m-nav-secondary .m-login-balance .m-login-jump span:last-of-type:before {
  border-left: 1px solid #ffffff;
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}

.m-nav-secondary .info-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}

.m-nav-secondary .m-nav-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}

.m-nav-secondary .home-link {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0 1.5rem 0 1.33333333rem;
}

.m-nav-secondary .home-link .home-icon::before {
  content: '\e6cb';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-nav-secondary .home-link .home-icon:before {
  font-size: 1.5rem;
}
</style>

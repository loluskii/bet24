<template>
  <div class="m-tran-detail-wrap">
    <!---->
    <div class="transaction-detail-v2-container">
      <div class="transaction-detail-v2-info">
        <div class="transaction-detail-v2__row amount">
          <p class="transaction-detail-v2__col">{{ data.description }}</p>
        </div>
        <div class="transaction-detail-v2__row">
          <p class="transaction-detail-v2__col header" data-cms-key="status">Amount</p>
          <div class="transaction-detail-v2__col data flex">
            <p data-op="trans-detail-status" class="">
              {{ type === 'pending_withdrawals' ? '-' : data.type === 'credit' ? '+' : '-' }}
              {{ data.amount }} {{ SportsbookGlobalVariable.CurrencyCode }}
            </p>
            <!---->
          </div>
        </div>
        <div class="transaction-detail-v2__row">
          <p class="transaction-detail-v2__col header" data-cms-key="status">Status</p>
          <div class="transaction-detail-v2__col data flex">
            <p data-op="trans-detail-status" class="">
              <i class="text-danger" v-if="data.status === 4">Cancelled</i>
              <i class="text-danger" v-if="data.status === 3">Rejected</i>
              <i class="text-danger" v-if="data.status === 2">Failed</i>
              <i class="text-success" v-if="data.status === 1">Successful</i>
              <i class="text-warning" v-if="data.status === 0">Pending</i>
            </p>
            <!---->
          </div>
        </div>
        <div class="transaction-detail-v2__row">
          <p class="transaction-detail-v2__col header" data-cms-key="type">Type</p>
          <p data-op="trans-detail-type" class="transaction-detail-v2__col data">
            {{ type === 'pending_withdrawals' ? 'Withdrawal' : data.subject }}
          </p>
        </div>
        <div class="transaction-detail-v2__row" v-if="type === 'transactions'">
          <p data-op="trans-detail-counter-type" class="transaction-detail-v2__col header">
            Deposit From
          </p>
          <p data-op="trans-detail-counter-value" class="transaction-detail-v2__col data">
            {{ data.channel }}
          </p>
        </div>
        <div class="transaction-detail-v2__row" v-if="type === 'transactions'">
          <p
            class="transaction-detail-v2__col header"
            data-cms-key="transaction_no"
            data-cms-page="page_transaction"
          >
            Transaction No.
          </p>
          <p data-op="trans-detail-pay-ch-tx-id" class="transaction-detail-v2__col data">
            {{ data.referenceNo }}
          </p>
        </div>
        <div class="transaction-detail-v2__row" v-else>
          <p
            class="transaction-detail-v2__col header"
            data-cms-key="transaction_no"
            data-cms-page="page_transaction"
          >
            Withdrawal Code
          </p>
          <p data-op="trans-detail-pay-ch-tx-id" class="transaction-detail-v2__col data">
            {{ data.withdrawal_code ?? 'N/A' }}
          </p>
        </div>
        <div class="transaction-detail-v2__row" v-if="type === 'transactions'">
          <p
            class="transaction-detail-v2__col header"
            data-cms-key="balance"
            data-cms-page="page_transaction"
          >
            After Balance
          </p>
          <p data-op="trans-detail-after-balance" class="transaction-detail-v2__col data">
            {{ data.balance }} {{ SportsbookGlobalVariable.CurrencyCode }}
          </p>
        </div>
        <div class="transaction-detail-v2__row" v-else>
          <p
            class="transaction-detail-v2__col header"
            data-cms-key="balance"
            data-cms-page="page_transaction"
          >
            Created at
          </p>
          <p data-op="trans-detail-after-balance" class="transaction-detail-v2__col data">
            {{ formatDate(data.created_at) }}
          </p>
        </div>
      </div>

      <br />
      <button
        v-if="type === 'pending_withdrawals'"
        @click.prevent="cancelRequest"
        class="af-button login-btn af-button--primary"
        :class="isLoading ? 'is-disabled' : ''"
        :disabled="isLoading"
      >
        <span> Cancel Request </span>
      </button>

      <!-- <div class="transaction-detail-v2-contact"><span>For assistance, reach
                    out to</span> <span class="link">Customer Service</span> <span>or</span> <a
                    href="tel:07008888888/09088999988" class="link"><span data-cms-key="call_us">call us</span></a>
            </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUtilsStore } from '../stores'
import { cancelPendingWithdrawal } from '../helpers'
import emitter from '../plugins/emitter'
const props = defineProps(['data', 'type'])
const { SportsbookGlobalVariable } = useUtilsStore()
const isLoading = ref(false)

const cancelRequest = async () => {
  let userConfirm = confirm('Are you sure you want to cancel this withdrawal?')
  if (userConfirm) {
    try {
      isLoading.value = true
      const res = await cancelPendingWithdrawal({ withdrawalId: props.data.id, comment: '' })
      isLoading.value = false
      window.location.reload()
    } catch (error) {
      emitter.emit('showDialogueToaster', 'Failed to cancel request')
      isLoading.value = false
    }
  }
}

function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
</script>

<style scoped>
.m-tran-detail-wrap {
  background-color: #ffffff;
  background-color: var(--background-general-secondary);
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  width: 100%;
  z-index: 33;
}

.m-tran-detail-wrap .m-gray-line {
  border-top: 1px solid;
  border-color: #f2f3f5;
  border-color: var(--background-type1-primary);
}

.m-tran-detail-wrap .request-details {
  color: var(--brand-highlight-text) !important;
  color: var(--brand-secondary) !important;
}

.m-tran-detail-wrap .request-details:after {
  content: '>';
  display: inline-block;
  margin-left: 0.83333333rem;
}

.m-tran-detail-wrap .m-my-dl {
  color: #353a45;
  color: var(--text-type1-primary);
  margin: 0.83333333rem auto 0;
  padding: 0.83333333rem 0 0;
  width: 90%;
}

.m-tran-detail-wrap .m-my-dl dl:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}

.m-tran-detail-wrap .m-my-dl dt {
  float: left;
  padding-left: 2px;
}

.m-tran-detail-wrap .m-my-dl dd {
  float: right;
}

.m-tran-detail-wrap .m-my-dl-part1 {
  font-size: 1.16666667rem;
}

.m-tran-detail-wrap .m-my-dl-part1 dd,
.m-tran-detail-wrap .m-my-dl-part1 dt {
  height: 2rem;
  line-height: 2rem;
  padding: 0.58333333rem 0;
}

.m-tran-detail-wrap .m-my-dl-part1 dd {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  padding-right: 1.5rem;
}

.m-tran-detail-wrap .m-my-dl-part1 dt {
  font-size: 1.33333333rem;
}

.m-tran-detail-wrap .m-my-dl-part1 .m-my-dl-em {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.83333333rem;
  font-weight: bold;
}

.m-tran-detail-wrap .m-my-dl-part2 {
  border-bottom: 1px solid;
  border-top: 1px solid;
  font-size: 1rem;
  padding: 1rem 0;
  border-color: #f2f3f5;
  border-color: var(--background-type1-primary);
}

.m-tran-detail-wrap .m-my-dl-part2 dl {
  padding: 0.75rem 0;
}

.m-tran-detail-wrap .m-my-dl-part2 dt,
.m-tran-detail-wrap .m-my-dl-part2 dd {
  height: 18px;
  line-height: 18px;
}

.m-tran-detail-wrap .m-my-dl-part2 dt {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.m-tran-detail-wrap .m-my-dl-part2 dd {
  padding-right: 0.33333333rem;
}

.m-tran-detail-wrap .m-my-dl-part2 dd.trans-detail-order-id.active {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}

.m-tran-detail-wrap .m-my-dl-part2 .m-loading-wrap {
  background-color: #ffffff;
  background-color: var(--background-general-secondary);
}

.m-tran-detail-wrap .m-my-dl-part2.no-top-space {
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.m-tran-detail-wrap .m-my-dl-part2 .additional-information-toggle {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  font-size: 1.16666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  border-color: #f2f3f5;
  border-color: var(--background-type1-primary);
}

.m-tran-detail-wrap .m-my-dl-part2 .additional-information-toggle span:first-child {
  margin-right: auto;
}

.m-tran-detail-wrap .m-my-dl-part2 .additional-information-container {
  max-height: 0;
  overflow: hidden;
}

.m-tran-detail-wrap .m-my-dl-part2 .additional-information-container.expanded {
  max-height: unset;
}

.m-tran-detail-wrap .m-my-dl-part2 dl.long-item {
  height: 12.5rem;
}

.m-tran-detail-wrap .m-my-dl-part2 dl.medium-item {
  height: 3.75rem;
}

.m-tran-detail-wrap .m-my-dl-part2 .linked-win-transaction-item {
  margin: 0.33333333rem;
}

.m-tran-detail-wrap .m-my-dl-rollback {
  font-size: 1rem;
  margin-top: 0.41666667rem;
  padding: 0 0 0.83333333rem;
}

.m-tran-detail-wrap .m-my-dl-rollback dl {
  padding: 0.75rem 0;
}

.m-tran-detail-wrap .m-my-dl-rollback dt,
.m-tran-detail-wrap .m-my-dl-rollback dd {
  height: 18px;
  line-height: 18px;
}

.m-tran-detail-wrap .m-my-dl-rollback dt {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.m-tran-detail-wrap .m-my-dl-rollback dd {
  padding-right: 0.33333333rem;
}

.m-tran-detail-wrap .m-trans-contat {
  border-top: 0.08333333rem solid;
  margin: 0 auto 1.66666667rem;
  padding-top: 0.83333333rem;
  text-align: center;
  width: 90%;
  border-top-color: #eaecef;
  border-top-color: var(--line-type1-primary);
  color: #3685e2;
  color: var(--highlight-hint);
}

.m-tran-detail-wrap .m-tran-tips {
  background-color: #ffffff;
  background-color: var(--background-general-secondary);
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 0.83333333rem;
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin: 0.41666667rem 0 0.66666667rem;
  text-align: center;
}

.m-tran-detail-wrap .m-rollback-title {
  border-top: 1px solid;
  font-size: 14px;
  margin: 0 auto;
  padding-top: 1.25rem;
  text-align: center;
  width: 90%;
  border-top-color: #f2f3f5;
  border-top-color: var(--background-type1-primary);
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.m-tran-detail-wrap .m-contact-line {
  border-top: 1px solid;
  border-top-color: #f2f3f5;
  border-top-color: var(--background-type1-primary);
}

.m-tran-detail-wrap .m-manual-check {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  gap: 0.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.66666667rem;
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}

.m-tran-detail-wrap .m-manual-check--tip {
  font-weight: 400;
}

.m-tran-detail-wrap .m-manual-check .update-status-button {
  max-width: 7.33333333rem;
  min-width: 7.33333333rem;
}

.m-tran-detail-wrap .view-btn {
  margin-top: -0.33333333rem;
  padding: 0.33333333rem 1rem;
}

.m-tran-detail-wrap .view-btn span {
  font-size: 12px;
}

.m-tran-detail-wrap .f-link {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  display: block;
  font-size: 1rem;
  line-height: 2.16666667rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
  text-align: center;
}

.m-tran-detail-wrap .transaction-relevant-information-free-text {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  margin: 0 1.66666667rem 1.66666667rem;
  text-align: justify;
}

.transaction-detail-v2-container {
  margin: 0 1.33333333rem;
  padding: 1.66666667rem 0 0;
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.transaction-detail-v2-container .transaction-detail-v2-info {
  border-bottom: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 1.33333333rem;
  padding-bottom: 1.25rem;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--line-type1-primary);
}

.transaction-detail-v2-container .transaction-detail-v2__row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.transaction-detail-v2-container .transaction-detail-v2__row.amount {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.transaction-detail-v2-container .transaction-detail-v2__col.header {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.transaction-detail-v2-container .transaction-detail-v2__col.data {
  color: #353a45;
  color: var(--text-type1-primary);
}

.transaction-detail-v2-container .transaction-detail-v2__col.data.flex {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  gap: 0.33333333rem;
}

.transaction-detail-v2-container .transaction-detail-v2__col.data .refresh-icon.disabled {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.transaction-detail-v2-container .transaction-detail-v2-progress-container {
  border-bottom: 1px solid;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 0.66666667rem;
  padding: 1rem 0 0.91666667rem;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--line-type1-primary);
}

.transaction-detail-v2-container
  .transaction-detail-v2-progress-container
  .progress-container:last-child {
  min-height: 0;
}

.transaction-detail-v2-container .transaction-detail-v2-contact {
  padding: 1.33333333rem 0;
  text-align: center;
}

.transaction-detail-v2-container .transaction-detail-v2-contact .link {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 1rem;
  font-weight: 400;
}
</style>

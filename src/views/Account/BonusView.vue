<template>
  <HeaderOther :header-title="'Bonus'"></HeaderOther>
  <!-- <div class="m-uc-nav-wrap">
    <ul class="m-uc-nav">
      <li class="m-nav-item m-nav-item--active">Sports Bonus</li>
      <li class="m-nav-item">Casino Bonus</li>
    </ul>
  </div> -->
  <section class="bonus-content">
    <div class="bonus-body" v-if="viewIsActive">
      <div class="bonus-header">
        <h3>Active Bonus</h3>
        <button @click.prevent="toggleHistory" class="btn">See History</button>
      </div>
      <template v-if="activeBonus && !isLoading">
        <div style="padding-top: 10px; padding-bottom: 10px">
          <div className="bonus_text">
            Available Bonus Fund:
            {{ couponStore.SportsbookGlobalVariable.CurrencyCode
            }}{{ formatNumber(userStore.sportBonusBalance) }}
          </div>
          <div className="bonus_text">
            Pending Bonus Fund:
            {{ couponStore.SportsbookGlobalVariable.CurrencyCode
            }}{{ formatNumber(pendingBalance) }}
          </div>
        </div>
        <BonusBar :bonus="activeBonus"></BonusBar>
        <table>
          <thead class="thead">
            <tr>
              <th>Date</th>
              <th>Stake</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in activeBonus.transactions" :key="index">
              <td>{{ formatDate(t.createdAt, 'DD/MM/YYYY') }}</td>
              <td>
                {{ couponStore.SportsbookGlobalVariable.CurrencyCode }}{{ formatNumber(t.amount) }}
              </td>
              <td>
                {{ couponStore.SportsbookGlobalVariable.CurrencyCode }}{{ formatNumber(t.balance) }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <LoadingSpinner v-else-if="isLoading"></LoadingSpinner>
      <div v-else class="no-bonus">
        <p>No available bonus</p>
      </div>
    </div>
    <div class="bonus-body" v-if="viewIsHistory">
      <div class="bonus-header">
        <h3>Bonus History</h3>
        <button @click.prevent="toggleHistory" class="btn">Go Back</button>
      </div>
      <div
        v-for="(bonus, index) in bonusHistory"
        :key="index"
        class="bonus"
        style="margin-bottom: 15px"
      >
        <div
          class="bonus-title"
          style="padding: 10px 0; border-bottom: 1px solid #cacaca; margin-bottom: 15px"
        >
          <h5 style="font-size: medium; font-weight: 500">{{ bonus.name }}</h5>
        </div>
        <table>
          <thead class="thead">
            <tr>
              <th>Date</th>
              <th>Stake</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, index) in bonus.transactions" :key="index">
              <td>{{ formatDate(t.createdAt, 'DD/MM/YYYY') }}</td>
              <td>
                {{ couponStore.SportsbookGlobalVariable.CurrencyCode }}{{ formatNumber(t.amount) }}
              </td>
              <td>
                {{ couponStore.SportsbookGlobalVariable.CurrencyCode }}{{ formatNumber(t.balance) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import { onMounted, ref } from 'vue'
import { getUserBonus, formatNumber } from '@/helpers'
import { useUsersStore, useCouponStore } from '@/stores'
import moment from 'moment'
// import dayjs from 'dayjs'
import BonusBar from '@/components/Betslip/BonusBar.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const userStore = useUsersStore()
const isLoading = ref(true)

const pendingBalance = ref(0)
const activeBonus = ref(null)
const bonusHistory = ref([])

const viewIsActive = ref(true)
const viewIsHistory = ref(false)
const couponStore = useCouponStore()

async function getBonus() {
  const res = await getUserBonus()
  isLoading.value = false
  if (res && res.bonus) {
    // find active bonus
    const active = res.bonus.find((item) => item.status === 1)
    activeBonus.value = active
    pendingBalance.value = active?.pendingAmount
    // find non active
    const bHistory = res.bonus
    bonusHistory.value = bHistory
  }
}

function toggleHistory() {
  viewIsActive.value = !viewIsActive.value
  viewIsHistory.value = !viewIsHistory.value
}

function formatDate(date, format) {
  // return
  let d = moment(date).format(format)
  return d
  // return moment(date).format(format)
}

onMounted(async () => {
  await getBonus()
})
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even),
tr.thead {
  background-color: #dddddd;
}
.m-gift-wrapper {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #1b1e25;
  color: var(--text-type1-tertiary);
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
  overflow: auto;
}

.m-gift-wrapper .m-uc-nav-wrap {
  height: 4.08333333rem;
  font-size: 1.2rem;
}

.m-uc-nav-wrap ul > li {
  font-size: 1.2rem !important;
}
.m-gift-wrapper .m-uc-nav {
  border-bottom: 1px solid #eaecef;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
}
.m-gift-wrapper .m-uc-nav.m-uc-nav-fixed {
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
}
.bonus-content {
  padding: 15px;
}

.bonus-content .bonus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bonus-content h3 {
  font-weight: bold;
  font-size: 20px;
}

button.btn {
  padding: 5px 12px;
  border-radius: 3px;
  background-color: transparent;
  border: 1px solid #262262;
  color: #262262;
}
</style>

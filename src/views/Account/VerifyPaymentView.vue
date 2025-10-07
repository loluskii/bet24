<template>
  <div class="verify-payment">
    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <div class="payment-status payment-success" v-if="isPaymentFail">
      <img src="@/assets/images/caution.png" style="height: 52px" />
      <h3>
        Your payment could not be verified. <br />
        Please contact support
      </h3>
      <button class="btn" type="button" @click.prevent="goHome">Go Home</button>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { awardBonus, verifyDeposit } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const isPaymentSuccess = ref(false)
const isPaymentFail = ref(false)
const isLoading = ref(true)
const usersStore = useUsersStore()

watch(
  () => [route.params.method],
  async ([method]) => {
    let ref

    switch (method) {
      case 'paystack':
        ref = route.query.trxref
        break
      case 'monnify':
        ref = route.query.paymentReference
        break
      case 'flutterwave':
        ref = route.query.tx_ref
        break
      case 'korapay':
        ref = route.query.reference
        break
      case 'fidelity':
        ref = route.query.txnRef
        break
      case 'smileandpay':
        ref = route.query.orderReference
        break
    }

    if (!ref) {
      // No reference param in query — redirect
      return router.push({ name: 'account-deposit' })
    }

    await verifyPaymentRef(method, ref)
  },
  { immediate: true }
)

const bonus = computed(() => {
  return usersStore.bonus
})

async function verifyPaymentRef(method, ref) {
  try {
    isLoading.value = true
    const res = await verifyDeposit(method, ref)
    isLoading.value = false
    if (res.success) {
      isPaymentSuccess.value = true
      if (bonus.value) {
        await awardBonus(bonus.value).then((res) => {
          usersStore.setActiveBonus(null)
        })
      }
      router.push({ name: 'account-transactions' })
    } else {
      isPaymentFail.value = true
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    isPaymentFail.value = true
  }
}

function goHome() {
  return router.push({ name: 'home' })
}
</script>

<style scoped>
.verify-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Set the height of the container to the full viewport height */
}

.payment-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

button.btn {
  margin-top: 10px;
  padding: 5px 15px;
  border-radius: 25px;
  border: 1px solid var(--brand-primary);
}
</style>

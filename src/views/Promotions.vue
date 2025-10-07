<template>
  <div class="x-load-bet">
    <HeaderOther :headerTitle="'Promotions'"></HeaderOther>
    <div v-if="pageMode === 'general-mode'" class="m-main-info p-3">
      <div v-if="promotions" class="row">
        <div v-for="promo in promotions" :key="promo.id" class="col-12">
          <div class="card mb-3">
            <img class="card-img-top" :src="promo.imageUrl" alt="Card image cap" />
            <div class="card-body p-2">
              <h5 class="card-title">{{ promo.title }}</h5>
              <!-- <p>{{ promo.content.slice(0,100) }}...</p> -->
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center p-2">
              <a
                class="btn btn-sm text-white"
                style="background-color: var(--brand-secondary)"
                @click.prevent="goToLink(promo.targetUrl)"
                :href="promo.targetUrl"
                target="_blank"
              >
                Play Now
              </a>
              <a href="" class="text-decoration-none btn-sm" @click.prevent="goToPromotion(promo)"
                >Read More...</a
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="d-flex flex-column align-items-center justify-content-center py-5">
        <p class="h4">No Promotions Availble.</p>
        <p class="text-muted">Kindly check back soon</p>
      </div>
    </div>
    <div v-if="pageMode === 'single-mode'" class="m-main-info p-3">
      <img :src="selectedPromotion.imageUrl" class="img-fluid" alt="" />
      <br />
      <div class="mt-3" v-html="selectedPromotion.content"></div>
      <button
        class="btn btn-block text-white mt-3"
        style="background-color: var(--brand-secondary)"
        @click.prevent="goToLink(selectedPromotion.targetUrl)"
      >
        Play Now
      </button>
      <button class="btn btn-block border mt-3" @click="pageMode = 'general-mode'">Go Back</button>
    </div>
  </div>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import { onMounted, ref } from 'vue'
import { getPromotions } from '../helpers'
import { useCouponStore } from '../stores'
import emitter from '../plugins/emitter'
import { useRouter } from 'vue-router'

const pageTitle = ref('Promotions')
const pageMode = ref('general-mode')
const bookingCode = ref('')
const isLoading = ref(false)
const couponStore = useCouponStore()
const router = useRouter()
const errorMesssage = ref('')
const promotions = ref([])
const selectedPromotion = ref({})

function goToPromotion(promo) {
  pageTitle.value = promo.title
  selectedPromotion.value = promo
  pageMode.value = 'single-mode'
}

function goToLink(link) {
  if (!link.startsWith('http') || !link.startsWith('https')) {
    link = `https://${link}` // Ensure it has the correct format
  }
  return (window.location.href = link)
}

onMounted(async () => {
  const res = await getPromotions()
  promotions.value = res.data ?? null
})
</script>

<style scoped>
@import url('@/assets/css/casino.css');
</style>

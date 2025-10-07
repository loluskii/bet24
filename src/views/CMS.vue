<template>
  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
  <div v-else>
    <HeaderOther :header-title="pageTitle"></HeaderOther>
    <div class="body">
      <div v-html="html"></div>
    </div>
  </div>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import { getCMS } from '@/helpers'
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useRoute } from 'vue-router'

const html = ref('')
const route = useRoute()
const isLoading = ref(false)
const pageTitle = ref(null)

onMounted(async () => {
  try {
    isLoading.value = true
    await getCMS(route.params.page).then((res) => {
      let result = Object.values(res.data)[0]
      pageTitle.value = result.title
      html.value = result.content
      isLoading.value = false
    })
  } catch (error) {
    alert('Page does not exist!')
    window.location.href = '/'
  }
})
</script>
<style scoped>
.body {
  padding: 1.5rem;
}
h2 {
  font-size: 1.33333333rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}
</style>

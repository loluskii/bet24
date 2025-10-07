<template>
  <div>
    <!-- Spacer div to match header height -->
    <div :style="`min-height: ${headerHeight}`"></div>
    <div
      ref="myHeader"
      class="mobile-navbar-wrap"
      style="position: fixed; top: 0rem; z-index: 1000"
    >
      <header class="mobile-navbar">
        <div class="navbar-wraper">
          <a href="/" class="mobile-navbar-logo">
            <img src="/logo.png" alt="" />
          </a>
          <div class="mobile-navbar-right">
            <span class="x-icon-search" @click="$router.push({ name: 'search' })"></span>
            <span v-if="authStore.isAuthenticated" class="x-login-yes">
              <span class="x-btn-deposit">
                <span class="x-btn-text" @click="$router.push({ name: 'account-deposit' })"
                  >Deposit</span
                >
                <div class="avatar-box" @click="$router.push({ name: 'account-me' })">
                  <span class="currency">{{ SportsbookGlobalVariable.CurrencyCode }}</span>
                  <span> {{ usersStore.balance }}</span>
                </div>
              </span>
            </span>
            <div v-else class="x-login-not">
              <div class="x-btn-join-now">
                <router-link :to="{ name: 'sign-up' }">Join Now</router-link>
              </div>
              <div class="x-btn-login">
                <router-link :to="{ name: 'sign-in' }">Log in</router-link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="drawer langs-drawer" style="display: none">
        <div class="drawer__mask"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore, useUsersStore } from '@/stores'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useUtilsStore } from '../stores'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const { SportsbookGlobalVariable } = useUtilsStore()
const myHeader = ref()
const headerHeight = ref('48px')
// Create a ResizeObserver to dynamically track header height
const resizeObserver = new ResizeObserver(() => {
  if (myHeader.value) {
    headerHeight.value = `${myHeader.value.offsetHeight}px`
  }
})

onMounted(() => {
  // Observe the header element
  if (myHeader.value) {
    resizeObserver.observe(myHeader.value)
  }

  // Load user data if authenticated
  if (authStore.isAuthenticated) {
    usersStore.loadCurrentUser()
  }
})

onBeforeUnmount(() => {
  // Disconnect the observer when the component is unmounted
  resizeObserver.disconnect()
})
</script>

<style scoped>
@import '@/assets/css/header-home.css';
</style>

// import "./assets/css/base.css";
// import "./assets/css/main.css";
// import "./assets/css/loading.css";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VOtpInput from 'vue3-otp-input'
import VueDatePicker from '@vuepic/vue-datepicker'
import applyBranding from './helpers/utils'
import Vue3Marquee from 'vue3-marquee'
import { securityConfig } from './config/security'
import { performanceMetrics, apiPerformance } from './utils/performance'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from 'vue-query'

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful')
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err)
      })
  })
}

// Start performance monitoring
performanceMetrics.start()

const startApp = async () => {
  try {
    const app = createApp(App)
    const pinia = createPinia()

    // Add performance monitoring
    app.config.performance = true

    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)

    // Apply security headers
    app.config.globalProperties.$security = securityConfig

    // Apply branding
    await applyBranding()

    // Initialize router with security headers
    router.beforeEach((to, from, next) => {
      // Add security headers to each route
      document.documentElement.style.setProperty('--csp', securityConfig.csp)
      next()
    })

    app.use(router)
    app.use(VueQueryPlugin)
    app.use(Vue3Marquee)

    // Lazy load components
    app.component('v-otp-input', VOtpInput)
    app.component('VueDatePicker', VueDatePicker)

    // Performance mark for app initialization
    performanceMetrics.mark('appInit')

    app.mount('#app')

    // Log performance metrics after mount
    performanceMetrics.logMetrics()
  } catch (error) {
    console.error('Failed to load app:', error)
  }
}

// Add performance monitoring
const startTime = performance.now()
startApp().then(() => {
  const loadTime = performance.now() - startTime
  console.log('App initialization time:', loadTime)
})

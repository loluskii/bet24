import { useCouponStore } from '@/stores/coupon.store'
import { useUtilsStore } from '@/stores'

const VERSION_KEY = 'app_version'
const VERSION_FILE = '/version.json'

export const clearAppCache = () => {
  // Clear all localStorage items except auth-related ones
  const itemsToKeep = ['users', 'auth'] // Add any other items you want to preserve
  const itemsToRemove = Object.keys(localStorage).filter((key) => !itemsToKeep.includes(key))

  itemsToRemove.forEach((key) => {
    localStorage.removeItem(key)
  })

  // Clear store states
  const couponStore = useCouponStore()
  const utilsStore = useUtilsStore()

  couponStore.clearBetslip()
  // Add any other store resets here

  // Clear service worker cache if exists
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName)
      })
    })
  }
}

export const checkVersion = async () => {
  try {
    const response = await fetch(VERSION_FILE)
    const data = await response.json()
    const currentVersion = localStorage.getItem(VERSION_KEY)

    // In development, don't clear cache on version change
    if (import.meta.env.DEV) {
      return false
    }

    if (!currentVersion || currentVersion !== data.version) {
      console.log(`New version detected: ${data.version}. Clearing cache...`)
      clearAppCache()
      localStorage.setItem(VERSION_KEY, data.version)
      return true
    }
    return false
  } catch (error) {
    console.error('Error checking version:', error)
    return false
  }
}

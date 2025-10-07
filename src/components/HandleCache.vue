<script setup>
import { ref, onMounted } from 'vue'
import packageApp from '../../package.json'

const isLoading = ref(true)
const isLatestVersionAvailable = ref(false)
const appVersion = ref(packageApp.version)

const clearCacheAndReload = () => {
  console.log('Clearing cache and hard reloading...')
  if (caches) {
    caches.keys().then((names) => {
      for (let name of names) caches.delete(name)
    })
  }
  window.location.reload(true)
}

const checkVersionMismatch = (latestVersion, currentVersion) => {
  const latestVersionArray = latestVersion.split(/\./g)
  const currentVersionArray = currentVersion.split(/\./g)
  while (latestVersionArray.length || currentVersionArray.length) {
    const a = Number(latestVersionArray.shift())
    const b = Number(currentVersionArray.shift())
    if (a === b) continue
    return a > b || isNaN(b)
  }
  return false
}

onMounted(() => {
  fetch(`/version.json?${new Date().getTime()}`, { cache: 'no-cache' })
    .then((response) => response.json())
    .then((meta) => {
      const latestVersion = meta.version
      const currentVersion = appVersion.value
      const shouldForceRefresh = checkVersionMismatch(latestVersion, currentVersion)
      if (shouldForceRefresh) {
        console.log(`New version - ${latestVersion}. Available, need to force refresh`)
        isLoading.value = false
        isLatestVersionAvailable.value = false
      } else {
        console.log(`Already latest version - ${latestVersion}. No refresh required.`)
        isLoading.value = false
        isLatestVersionAvailable.value = true
      }
    })
})

defineExpose({
  clearCacheAndReload
})
</script>

<template>
  <div>
    <slot :isLoading="isLoading" :isLatestVersionAvailable="isLatestVersionAvailable" />
  </div>
</template>

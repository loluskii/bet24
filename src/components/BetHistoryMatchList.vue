<template>
  <div>
    <div v-for="(match, index) in displayedMatches" :key="index">
      <!-- Render your match information here -->
      <ul class="teams">
        <li>{{ match.eventName }}</li>
      </ul>
    </div>
    <div v-if="remainingMatchesCount > 0">
      <ul class="teams">
        <li>
          ...(and {{ remainingMatchesCount }} other match{{
            remainingMatchesCount > 1 ? 'es' : ''
          }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    matches: Array // Your array of matches
  },
  computed: {
    displayedMatches() {
      // Display the first two matches
      return this.matches.slice(0, 2)
    },
    remainingMatchesCount() {
      // Calculate the count of remaining matches
      return Math.max(0, this.matches.length - 2)
    }
  }
}
</script>

<style></style>

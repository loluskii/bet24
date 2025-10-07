<template>
  <div class="tournament-pop">
    <div class="tournament-pop--header undefined" style="top: 0rem; z-index: 1000; position: fixed">
      <div>
        <span class="back" @click="$emit('close-select')"></span>
        <span class="tournament-pop--header__title">{{ props.category.categoryName }}</span>
      </div>
      <span class="home-icon"></span>
    </div>
    <LoadingSpinner v-if="isLoading"></LoadingSpinner>
    <template v-else>
      <div class="tournament-pop--body" style="height: 100%; margin-top: 3.6667rem">
        <div
          v-for="(tournament, t) in categoryTournaments"
          class="tournament"
          @click="selectTournament(tournament)"
          :class="{ checked: selected(tournament) }"
          :key="t"
        >
          <span class="checkbox"></span>
          <span class="name">{{ tournament.tournamentName }}</span>
          <span>{{ tournament.total }}</span>
        </div>
      </div>
      <div class="tournament-pop--footer">
        <div
          class="tournament-pop--footer__display-btn"
          :class="selectedTournaments.length ? 'active' : 'inactive'"
          @click="submit"
        >
          <span>Display</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { getTournamentsByCategories, slugify } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  sport: Object,
  category: Object
})

defineEmits(['close-select'])
const router = useRouter()
const categoryTournaments = ref([])
const selectedTournaments = ref([])
const isLoading = ref(false)

const selected = (id) => {
  return selectedTournaments.value.find((tournament) => tournament.tournamentID === id.tournamentID)
}

const selectTournament = (tournament) => {
  const index = selectedTournaments.value.findIndex(
    (cat) => cat.tournamentID === tournament.tournamentID
  )
  if (index === -1) {
    selectedTournaments.value.push(tournament) // Add the tournament if it's not already selected
  } else {
    selectedTournaments.value.splice(index, 1) // Remove the tournament if it's already selected
  }
}

const submit = () => {
  let selected = selectedTournaments.value
  const tournamentIDs = selected.map((item) => item.tournamentID)

  const tournaments = tournamentIDs.map((id) => `sr:tournament:${id}`).join('_')

  return router.push({
    name: 'fixtures-by-tournaments',
    params: {
      sport: props.sport.sportName,
      categories: `sr:category:${props.category.categoryID}`,
      tournaments: tournaments
    }
  })
}

onMounted(async () => {
  isLoading.value = true
  const res = await getTournamentsByCategories(props.category.categoryID)
  categoryTournaments.value = res.sports
  isLoading.value = false
})
defineComponent({
  name: 'az-tournaments-select'
})
</script>
<style scoped>
.m-azmenu {
  height: 100% !important;
}
.m-azmenu .tournament-pop {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100vw;
  z-index: 225;
}
.m-azmenu .tournament-pop--header {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: var(--brand-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.66666667rem;
  height: 3.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-left: 1.66666667rem;
  width: 100%;
}
.m-azmenu .tournament-pop--header .back {
  margin-right: 1.66666667rem;
}
.m-azmenu .tournament-pop--header .back:before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .tournament-pop--header .home-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0 1rem;
}
.m-azmenu .tournament-pop--header .home-icon:before {
  content: '\e6cb';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .tournament-pop--header .home-icon:before {
  font-size: 1.5rem;
}
.m-azmenu .tournament-pop--body {
  background: #ffffff;
  overflow-y: auto;
  padding: 1rem 0;
  width: 100%;
}
.m-azmenu .tournament-pop--body .tournament {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #353a45;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.33333333rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.83333333rem 2.08333333rem;
}
.m-azmenu .tournament-pop--body .tournament .name {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.m-azmenu .tournament-pop--body .tournament .checkbox {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  margin-right: 0.83333333rem;
  padding-bottom: 0.16666667rem;
  width: 10%;
}
.m-azmenu .tournament-pop--body .tournament .checkbox::before {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #dcdee5;
  border-radius: 0.25rem;
  content: '';
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-family: 'iconfont';
  font-size: 1rem;
  height: 1.25rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 1.25rem;
}
.m-azmenu .tournament-pop--body .tournament.checked .checkbox::before {
  background-color: var(--brand-secondary);
  border: 1px solid var(--brand-secondary);
  color: #ffffff;
  content: '\e611';
  font-size: 0.83333333rem;
}
.m-azmenu .tournament-pop--footer {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 4rem;
  width: 100%;
}
.m-azmenu .tournament-pop--footer__display-btn {
  background: var(--brand-secondary);
  color: #ffffff;
  font-size: 1.33333333rem;
  line-height: 4rem;
  text-align: center;
  width: 100%;
}
.m-azmenu .tournament-pop--footer__display-btn.inactive {
  background: #eaecef;
  color: #9ca0ab;
}
</style>

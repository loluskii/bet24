<template>
  <div class="fixed-wrap" style="position: fixed; top: 0rem; z-index: 1000; width: 100%">
    <div>
      <div class="m-openbet-header">
        <div v-if="authStore.isAuthenticated" class="is-login">
          <span class="balance"
            ><span>{{ SportsbookGlobalVariable.CurrencyCode }} </span>
            <span>{{ usersStore.balance }}</span></span
          >
        </div>
        <div v-else class="no-login">
          <span @click="$router.push({ name: 'sign-up' })">Register</span>
          <span @click="$router.push({ name: 'sign-in' })">Login</span>
        </div>
      </div>
    </div>
    <div class="m-snap-nav-wrap m-list-nav-type m-bets--nav" style="overflow: hidden">
      <ul class="m-snap-nav flex" style="width: 100%">
        <li
          class="m-list-nav-type-item m-snap-nav-item"
          :class="{ active: route.name === 'open-bets' }"
          @click="$router.push({ name: 'open-bets' })"
        >
          <span data-cms-key="open_bets">Open Bets</span>
        </li>
        <li
          :class="{ active: route.name === 'bet-history' }"
          @click="$router.push({ name: 'bet-history' })"
          class="m-list-nav-type-item m-snap-nav-item"
        >
          <span data-cms-key="bet_history">Bet History</span>
        </li>
      </ul>
      <i class="controls left-controls"></i>
      <i class="controls right-controls"></i>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore, useAuthStore, useUtilsStore } from '../stores'
import { useRoute } from 'vue-router'
import { defineProps, computed } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const { SportsbookGlobalVariable } = useUtilsStore()

defineProps({
  active: String
})
</script>
<style scoped>
.m-openbet-header {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #353a45;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  height: 3.66666667rem;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0 1.33333333rem;
  width: 100%;
}
.m-openbet-header .no-login {
  color: #ffffff;
  color: var(--text-type2-primary);
}
.m-openbet-header .no-login > span {
  padding: 0 0.66666667rem;
}
.m-openbet-header .no-login span:last-of-type:before {
  border-left: 1px solid #ffffff;
  border-color: #ffffff;
  border-color: var(--text-type2-primary);
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}
.m-openbet-header .is-login {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #fafd00;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-openbet-header .is-login .usr-img {
  border: 0.08333333rem solid #ffffff;
  border-color: #ffffff;
  border-color: var(--text-type2-primary);
  border-radius: 50%;
  height: 1.66666667rem;
  margin-right: 0.66666667rem;
  width: 1.66666667rem;
}
.m-openbet-header .is-login .balance {
  display: inline;
  vertical-align: bottom;
}
.m-openbet-header .is-login .hidden {
  font-size: 1.066rem;
  letter-spacing: 0.16666667rem;
}

.m-sportBets .m-list-nav-type {
  background-color: #353a45;
  /* background-color: var(--brand-primary); */
  padding: 0 2.08333333rem;
}
.m-sportBets .m-list-nav-type .m-list-nav-type-item {
  background-color: var(--brand-button-disabled);
  border-top-left-radius: 0.33333333rem;
  border-top-right-radius: 0.33333333rem;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.066rem;
  font-weight: bold;
  height: 3rem;
  line-height: 3rem;
  margin-right: 0.25rem;
  color: #ffffff;
  color: var(--c-openbet-label-text);
}
.m-sportBets .m-list-nav-type .m-list-nav-type-item:last-child {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-sportBets .m-list-nav-type .m-list-nav-type-item.active {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #353a45;
  color: var(--text-type1-primary);
}
.m-sportBets .m-list-nav-type .m-list-nav-type-item.m-snap-nav-item--disabled {
  opacity: 0.5;
  text-decoration: line-through;
}
</style>

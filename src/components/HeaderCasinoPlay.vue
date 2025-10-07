<template>
  <div class="m-nav-secondary withHome">
    <div class="m-nav-left">
      <span @click="$emit('open-leave-modal')" class="m-icon m-icon--back"></span>
    </div>
    <div class="info-container">
      <div class="m-nav-right">
        <template v-if="usersStore.currentUser">
          <div class="like-game">
            <!-- <i class="bi bi-star fw-bold"></i> -->
            <!-- <span>Love Game</span> -->
          </div>
          <!-- <span class="mx-3 border" style="height: 20px"></span> -->
          <!-- <div class="balance">
            <span class="fw-bold"
              >N {{ usersStore.currentUser.availableBalance.toLocaleString("en") }}</span
            >
          </div> -->
        </template>
        <a href="/sign-in" v-else>Log in</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useUsersStore } from '../stores'

const usersStore = useUsersStore()
defineEmits(['open-leave-modal'])

defineProps({
  headerTitle: String
})
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

.m-nav-secondary {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: rgb(222, 226 ,230);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 1.33333333rem;
  height: 3.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 1.33333333rem 0 1.66666667rem;
  width: 100%;
}
.m-nav-secondary .m-nav-left {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-left .m-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  /* margin-right: 1.58333333rem; */
}
.m-nav-secondary .m-nav-left .m-icon :before {
  font-size: 1.33333333rem !important;
}
.m-nav-secondary .m-nav-left .m-icon.m-icon--back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close :before {
  font-size: 1.5rem !important;
}
.m-nav-secondary.withHome {
  /* padding: 0 0 0 1.66666667rem; */
}
.m-nav-secondary a :visited,
.m-nav-secondary a :active,
.m-nav-secondary a :link,
.m-nav-secondary a :hover {
  color: #ffffff;
  color: var(--text-type2-primary);
  text-decoration: none;
}
.m-nav-secondary .title {
  font-size: 1.16666667rem;
  line-height: 2rem;
}
.m-nav-secondary .title.small-font-height {
  font-size: 1.066rem;
  line-height: 1.5rem;
}
.m-nav-secondary .m-login-balance {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span {
  padding: 0 0.66666667rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span:last-of-type:before {
  border-left: 1px solid #ffffff;
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}
.m-nav-secondary .info-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .home-link {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0;
  margin-left: 15px;
}
.m-nav-secondary .home-link .home-icon::before {
  content: '\e6cb';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.balance,
.like-game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* font-size: 12px; */
  text-align: center;
  align-content: center;
}
</style>

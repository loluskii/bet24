<template>
  <div class="es-dialog-wrap" id="esDialog0" style="visibility: visible">
    <div class="layout mask" style="z-index: 1000; position: fixed"></div>
    <div class="es-dialog m-dialog">
      <div class="es-dialog-body m-dialog-body">
        <div
          v-if="route.name === 'casino-bonus' || route.name === 'bonus-games'"
          class="es-dialog-main m-dialog-main"
          style="height: auto; color: white"
        >
          <div>
            {{ gamePlayModalText }}
          </div>
        </div>
        <div
          v-else
          class="es-dialog-main m-dialog-main"
          style="height: auto; color: white; text-align: center"
        >
          <img src="@/assets/images/party-popper.png" alt="congratulation" style="height: 30px" />
          <div>
            {{ modalText }}
          </div>
        </div>
      </div>
      <div class="m-dialog-footer es-dialog-footer" style="margin-top: 1rem; padding: 0">
        <div v-if="route.name !== 'home'" class="button-row">
          <div class="real-money-btn" @click="setBalanceType('real')">
            <div class="real-money-btn-text">Real Money</div>
          </div>
          <div class="bonus-btn" @click="setBalanceType('bonus')">
            <div class="bonus-btn-text">Bonus</div>
          </div>
        </div>
        <div v-else class="button-row">
          <div
            v-if="props.data.bonus.type === 'casino' && props.data.bonus.gameId !== undefined"
            class="real-money-btn"
            @click="goToCasino"
          >
            <div class="real-money-btn-text">Go to Casino</div>
          </div>
          <div class="bonus-btn" @click="goToBonus">
            <div class="bonus-btn-text">View Bonus</div>
          </div>
        </div>
        <div class="button-row">
          <div class="real-money-btn-cancel" @click="hideDialog">
            <div class="real-money-btn-text">Cancel</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores'
import emitter from '@/plugins/emitter'
import { slugify } from '@/helpers'
import { useUtilsStore } from '../stores'

const emits = defineEmits(['hide-dialogue'])
const props = defineProps({
  data: Object
})

const route = useRoute()
const router = useRouter()
const { SportsbookGlobalVariable } = useUtilsStore()
const utilsStore = useUtilsStore()

const modalText = computed(() => {
  return props.data.bonus.bonusType === 'free_rounds' && props.data.bonus.freeSpins
    ? `Congratulations! You have been gifted ${props.data.bonus.freeSpins} free spins.`
    : `Congratulations! You have been awarded a ${props.data.bonus.bonusType} bonus. You now have a bonus of
            ${SportsbookGlobalVariable.Currency} ${props.data.bonus.value}!
    `
})

const gamePlayModalText = computed(() => {
  return props.data.bonus.bonusType === 'free_rounds' && props.data.bonus.freeSpins
    ? `You have ${props.data.bonus.freeSpins} free spins on this game. Choose the balance to use for
            this session.`
    : `You have an active casino bonus of ${SportsbookGlobalVariable.Currency} ${props.data.bonus.value} for this game. Choose the balance to use for
            this session.
            `
})

const setBalanceType = (type) => {
  emits('hide-dialogue')
  return router.push({
    name: 'game-play',
    params: {
      game_name: slugify(props.data.game.title),
      game_id: props.data.game.id
    },
    query: {
      bonusId: props.data.bonus.bonusId,
      balanceType: type,
      bonusType: props.data.bonus.bonusType
    }
  })
}

const goToCasino = () => {
  emits('hide-dialogue')
  return router.push({
    name: 'casino-bonus'
  })
}

const goToBonus = () => {
  emits('hide-dialogue')
  return router.push('/Account/Bonus')
}

const hideDialog = () => {
  emits('hide-dialogue')
  utilsStore.casinoBonusShown = true
}

onMounted(() => {})
</script>

<style scoped>
.button-row {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0rem;
  column-gap: 10px;
}

.button-row div {
  font-weight: 500;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  width: 100%;
  color: white;
  font-size: 12px;
}

.button-row div.bonus-btn,
.button-row div.demo-btn {
  background-color: #dc4546;
}

.button-row div.real-money-btn {
  background-color: var(--brand-secondary);
}

.button-row div.real-money-btn-cancel,
.button-row div.real-money-btn-cancel .real-money-btn-text {
  border: 0.5px solid;
  height: 2rem !important;
  line-height: 2rem !important;
}

.es-dialog {
  background-color: #373b41;
  border-radius: 0.3rem;
  box-shadow:
    0 0 24px 0 rgba(0, 0, 0, 0.25),
    0 0 24px 0 rgba(112, 76, 76, 0.25);
  color: #353a45;
  font-family: 'Roboto', 'Microsoft Yahei', 'simsun';
  font-size: 1rem;
  line-height: 2rem;
  overflow: hidden;
  padding: 1.66666667rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  z-index: 1001;
}

.es-dialog-close {
  display: none;
  padding: 0.3rem 1rem;
  text-decoration: none;
}

.es-dialog-close em {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 0;
}

.es-dialog-close em::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.es-dialog-close em:before {
  font-size: 1.5rem;
}

.es-dialog-close em:active {
  -webkit-transform: scale(0.9, 0.9);
  -ms-transform: scale(0.9, 0.9);
  transform: scale(0.9, 0.9);
}

.es-dialog-wrap {
  visibility: hidden;
}

.es-dialog-wrap .layout {
  background: #353a45;
  height: 100%;
  left: 0;
  opacity: 0.4;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.es-dialog-wrap .overlay-animate-enter {
  opacity: 0;
}

.es-dialog-wrap .overlay-animate-enter-active {
  opacity: 0.4;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.es-dialog-wrap .overlay-animate-leave {
  opacity: 0.4;
}

.es-dialog-wrap .overlay-animate-leave-active {
  opacity: 0;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.es-dialog-wrap .body-overflow {
  overflow: hidden;
}

.es-dialog .es-dialog-head {
  padding: 0 2rem 0.66666667rem;
}

.es-dialog .es-dialog-head h1 {
  font-size: 1.66666667rem;
  font-weight: 700;
  min-height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin: 0;
  text-align: center;
  text-align: left;
}

.es-dialog .es-dialog-head .es-dialog-close {
  background: none;
  font-family: 'Microsoft YaHei', arial, simsun, SimHei;
  position: absolute;
  right: 5px;
  top: 1px;
}

.es-dialog .es-dialog-head .es-dialog-close em {
  cursor: default;
  font-style: normal;
}

.es-dialog .es-dialog-body {
  /* background-color: #fafafa;
  background-color: var(--background-general-primary); */
  margin: 0;
  /* min-height: 4rem; */
  padding: 0;
}

.es-dialog .es-dialog-footer .es-dialog-btn {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  cursor: pointer;
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.066rem;
  font-weight: 700;
  height: 3rem;
  line-height: 3rem;
  outline: none;
  padding: 0;
  text-align: left;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 30%;
}

.es-dialog.es-ani-show {
  -webkit-transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
}

.es-dialog.es-ani-hide {
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}

.es-dialog.es-dialog-ani-1 {
  opacity: 0.1;
}

.es-dialog.es-dialog-ani-2 {
  opacity: 0.1;
  -webkit-transform: scale(0.1);
  -ms-transform: scale(0.1);
  transform: scale(0.1);
}

.es-dialog.es-dialog-ani-3 {
  opacity: 0.1;
  -webkit-transform: scale(1.8);
  -ms-transform: scale(1.8);
  transform: scale(1.8);
}

.es-dialog.es-dialog-ani-4 {
  opacity: 0;
  -webkit-transform: perspective(300px) rotateY(90deg);
  transform: perspective(300px) rotateY(90deg);
}

.es-dialog.es-dialog-ani-5 {
  opacity: 0.1;
  -webkit-transform: scale(0.3);
  -ms-transform: scale(0.3);
  transform: scale(0.3);
}

.es-dialog.es-dialog-ani-6 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, 230);
  -ms-transform: matrix(1, 0, 0, 1, 0, 230);
  transform: matrix(1, 0, 0, 1, 0, 230);
}

.es-dialog.es-dialog-ani-7 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, -230);
  -ms-transform: matrix(1, 0, 0, 1, 0, -230);
  transform: matrix(1, 0, 0, 1, 0, -230);
}

.es-dialog-info .es-dialog-body .es-dialog-main,
.es-dialog-error .es-dialog-body .es-dialog-main,
.es-dialog-alert .es-dialog-body .es-dialog-main,
.es-dialog-confirm .es-dialog-body .es-dialog-main {
  vertical-align: middle;
}

.es-dialog-toast {
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  color: #fff;
  font-size: 1rem;
  padding-top: 0;
}

.es-dialog-toast.es-dialog {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.es-dialog-toast .es-dialog-body {
  min-height: auto;
}

.es-dialog-toast a {
  color: #ffc000;
  text-decoration: underline;
}

.es-dialog-toast a :link {
  color: #ffc000;
}

.es-dialog-toast a :visited {
  color: #ffc000;
}

.es-dialog-toast a :hover {
  color: #ffc000;
}

.es-dialog-toast .es-dialog-body,
.es-dialog-toast .es-dialog-body .es-dialog-main {
  background: transparent;
  min-height: inherit;
  text-align: center;
  color: white !important;
}

.es-dialog-toast .es-dialog-body .es-dialog-main {
  padding: 0.83rem 1.05rem;
}
</style>

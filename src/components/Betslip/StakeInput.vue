<template>
    <div class="m-input-keyboard-wrapper m-input mg-b-10">
      <div class="m-input-wrapper">
        <span>
          {{ title }}
        </span>
        
        <span class="text-right" v-if="combo">{{ combo.Combinations }}x</span>
        
        <span class="currency"><em>{{
          SportsbookGlobalVariable.CurrencyCode
            }}</em></span>
        <span 
          :tabindex="tabindex"
          type="textx" 
          disabled 
          class="m-keybord-input multiple-stake-input" 
          v-html="stake"
          v-if="canEdit"
          @click="toggleKeyboard">
        </span>
        <span v-else type="texts" class="text-right">{{ stake }}</span>
      </div>
      <div v-if="balanceLowerThanStake" class="m-error-info">
        <p>You need a balance of {{
          SportsbookGlobalVariable.CurrencyCode
        }} {{ betlistStake }} to place this bet. Please deposit an additional
          {{ amountNeededToStake }}</p>
        <p @click.prevent="goToDeposit" class="m-deposit-link-wrapper">
          <a class="m-deposit-link">
            <span>Go to Deposit</span>
          </a> <i class="arrow-right"></i>
        </p>
      </div>
      <BetlistStakeKeyboard :keyboard-visible="keyboardVisible" @button-click="onKeyClick"></BetlistStakeKeyboard>
    </div>

</template>

<script setup>
import BetlistStakeKeyboard from "./BetlistStakeKeyboard.vue";
import { computed, ref } from "vue";

import { useCouponStore, useUsersStore, useUtilsStore } from "@/stores";

import { useRouter } from "vue-router";

const props = defineProps({
  title: String,
  combination: Number,
  stake: Number,
  canEdit: Boolean,
  tabindex: Number,
  betSlipType: String,
  combo: Object,
});

const userStore = useUsersStore();
const couponStore = useCouponStore();
const { SportsbookGlobalVariable } = useUtilsStore();
const {coupon} = couponStore;

const router = useRouter();
const keyboardVisible = ref(false);

const emit = defineEmits(["toggle-betslip"]);

const betlistStake = computed(() => {
  return coupon.totalStake;
});

const balanceLowerThanStake = computed(() => {
  return userStore.currentUser && betlistStake.value > userStore.currentUser?.sportBonusBalance && betlistStake.value > userStore.currentUser?.availableBalance
})

const amountNeededToStake = computed(() => {
  let bal = betlistStake.value - userStore.currentUser?.availableBalance
  return `${SportsbookGlobalVariable.CurrencyCode} ${formatNumber(bal)}`;
})

const goToDeposit = () => {
  emit("toggle-betslip");
  return router.push({ name: 'account-deposit' })
}

const updateStake = (stake) => {
  // coupon.stake = stake;
  if(props.betSlipType === 'Combo') {
    return couponStore.updateComboWinnings(stake, props.combo);
  } else {
    return couponStore.updateWinnings({
      stake: stake,
      id: "all",
    });
  }
};

const toggleKeyboard = () => {
  keyboardVisible.value = !keyboardVisible.value;
};

function onKeyClick(type, value) {
  let stake = props.stake?.toString() || '';
  let finalStake;
  switch (type) {
    case "number":
      // Append clicked number to the display
      if (stake.length < 7) {
        if (typeof value === "number") {
          if (stake === "") {
            finalStake = value;
          } else {
            finalStake = parseFloat(stake) + value;
          }
        } else {
          finalStake = stake + value;
        }
        updateStake(finalStake);
      }
      break;
    case "dot":
      // Append dot to the display
      if (stake.length < 6 && !stake.includes(".")) {
        stake += ".";
        updateStake(stake);
      }
      break;
    case "double-zero":
      // Append double zero to the display
      if (stake.length < 6) {
        stake += "00";
        updateStake(stake);
      }
      break;
    case "clear":
      // Clear the display
      stake = "";
      updateStake(stake);
      break;
    case "delete":
      // Remove the last character from the display
      stake = stake.toString().slice(0, -1);
      updateStake(stake);
      break;
    case "done":
      // Handle the "Done" button click if needed
      keyboardVisible.value = false;
      break;
    // Add more cases for other button types if necessary
  }
}

</script>
<style>
</style>
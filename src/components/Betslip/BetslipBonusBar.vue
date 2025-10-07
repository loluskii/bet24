<template>
  <div id="bonus-progress-bar" class="real-theme">
    <div class="progress" :style="`width: ${(coupon.selections.length / 50) * 100}%`"></div>
    <p>Add more qualifying selections to boost your bonus</p>
  </div>
</template>

<script setup>
import { useCouponStore } from '@/stores'

const { coupon } = useCouponStore()
</script>
<style>
#bonus-progress-bar {
  border-radius: 8.5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-family: Roboto;
  font-size: 12px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: calc(100% - 30px);
  margin: auto;
  margin-bottom: 20px;
}
#bonus-progress-bar p {
  position: relative;
}
@media only screen and (min-width: 320px) and (max-width: 359px),
  only screen and (max-width: 320px) {
  #bonus-progress-bar p {
    -webkit-transform: scale(0.8);
    -ms-transform: scale(0.8);
    transform: scale(0.8);
    -webkit-transform-origin: center;
    -ms-transform-origin: center;
    transform-origin: center;
  }
}
@media only screen and (min-width: 360px) and (max-width: 375px) {
  #bonus-progress-bar p {
    -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);
    -webkit-transform-origin: center;
    -ms-transform-origin: center;
    transform-origin: center;
  }
}
#bonus-progress-bar .progress {
  border-radius: 8.5px;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  -webkit-transition: width 0.2s ease;
  transition: width 0.2s ease;
}
#bonus-progress-bar .progress.with-opacity {
  opacity: 70%;
}
#bonus-progress-bar.real-theme {
  background-color: #d6ebdc;
  background-color: var(--c-betslip-to-win-bg);
  /* color: v; */
  color: var(--brand-primary);
}
#bonus-progress-bar.real-theme .progress {
  background-color: rgba(13, 151, 55, 0.5);
  background-color: var(--brand-primary);
  opacity: 0.3;
}
#bonus-progress-bar.sim-theme {
  background-color: rgba(250, 253, 0, 0.2);
  color: #9ca0ab;
}
#bonus-progress-bar.sim-theme .progress {
  background-color: #fafd00;
}
</style>

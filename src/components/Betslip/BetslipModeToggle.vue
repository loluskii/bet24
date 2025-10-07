<template>
  <div>
    <span
      v-if="!couponStore.betslipMode"
      @click="couponStore.mode = 'sim'"
      class="vue-toggles light"
      role="switch"
      tabindex="0"
      aria-readonly="false"
      test-id="toggle"
      unchecked=""
      style="
        position: relative;
        width: 140px;
        height: 30px;
        border: 1px solid rgb(147, 147, 147);
        opacity: 1;
        cursor: pointer;
      "
    >
      <span
        aria-hidden="true"
        class="vue-toggles__dot"
        test-id="dot"
        style="
          background: var(--brand-secondary);
          width: auto;
          border-radius: 9999px;
          height: 30px;
          min-width: 22px;
          min-height: 22px;
          padding: 1px 17px;
          font-weight: bold;
        "
      >
        REAL
      </span>
      <span
        class="vue-toggles__text"
        test-id="text"
        style="
          font-family: 'Anton', serif !important;
          font-size: 14px;
          color: var(--sim-primary);
          right: 13%;
          margin-left: auto;
        "
        >SIMULATE</span
      >
    </span>
    <span
      v-else
      @click="couponStore.mode = 'real'"
      class="vue-toggles"
      role="switch"
      tabindex="0"
      aria-readonly="false"
      test-id="toggle"
      unchecked=""
      style="
        position: relative;
        width: 140px;
        height: 30px;
        border: 1px solid rgb(147, 147, 147);
        opacity: 1;
        cursor: pointer;
      "
    >
      <span class="vue-toggles__text" test-id="text" style="left: 13%">REAL</span>

      <span
        aria-hidden="true"
        class="vue-toggles__dot"
        test-id="dot"
        style="
          font-size: 14px;
          font-family: 'Anton', serif !important;
          background: var(--sim-primary);
          width: auto;
          border-radius: 9999px;
          height: 30px;
          min-width: 22px;
          min-height: 22px;
          padding: 1px 17px;
          margin-left: auto;
          color: black;
        "
      >
        SIMULATE
      </span>
    </span>
  </div>
</template>
<script setup>
import { useCouponStore } from '@/stores'

const couponStore = useCouponStore()
</script>
<style scoped>
.light {
  background: -moz-linear-gradient(
    -45deg,
    transparent 0%,
    transparent 45%,
    #ffffff 50%,
    transparent 55%,
    transparent 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    right bottom,
    color-stop(0%, transparent),
    color-stop(45%, transparent),
    color-stop(50%, #ffffff),
    color-stop(55%, transparent),
    color-stop(100%, transparent)
  );
  background: -webkit-linear-gradient(
    -45deg,
    transparent 0%,
    transparent 45%,
    #ffffff 50%,
    transparent 55%,
    transparent 100%
  );
  background: -o-linear-gradient(
    -45deg,
    transparent 0%,
    transparent 45%,
    #ffffff 50%,
    transparent 55%,
    transparent 100%
  );
  background: -ms-linear-gradient(
    -45deg,
    transparent 0%,
    transparent 45%,
    #ffffff 50%,
    transparent 55%,
    transparent 100%
  );
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 45%,
    #ffffff 50%,
    transparent 55%,
    transparent 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='transparent', endColorstr='transparent', GradientType=1);
  background-repeat: no-repeat;
  background-position: 0px;
  background-size: 300%;
}

.light {
  animation: light 3s infinite;
  -webkit-animation: light 3s infinite;
}

@keyframes light {
  0% {
    background-position: -600px;
  }

  100% {
    background-position: 0px;
  }
}

@-webkit-keyframes light {
  0% {
    background-position: -600px;
  }

  100% {
    background-position: 0px;
  }
}
</style>

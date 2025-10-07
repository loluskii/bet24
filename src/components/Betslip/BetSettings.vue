<template>
  <div class="bet-setting-panel-container">
    <div data-op="bet-setting-panel-close" class="popup-modal"></div>
    <div class="select-container">
      <div class="m-close" @click="$emit('close')">
        <svg
          viewBox="0 0 46 22"
          xmlns="http://www.w3.org/2000/svg"
          height="46"
          width="46"
          class="svg-icon-base"
        >
          <g fill="none" fill-rule="evenodd">
            <path d="M45.64 22H0L19.958 1.615a4 4 0 015.657 0L45.64 22z" fill="#353A45"></path>
            <path
              fill="#FFF"
              fill-rule="nonzero"
              d="M27.192 20.25l1.058-1.057L24.058 15l4.192-4.192-1.058-1.058L23 13.943 18.808 9.75l-1.058 1.058L21.942 15l-4.192 4.193 1.058 1.057L23 16.058z"
            ></path>
          </g>
        </svg>
      </div>
      <div class="content">
        <div class="m-head">
          <div class="title" data-cms-key="bet_settings">Bet Settings</div>
        </div>
        <div class="m-body">
          <div class="select-list">
            <div>
              <div class="container select-item" theme="light" style="padding-right: 1.33333rem">
                <div class="item-title">Auto-remove suspended events</div>
                <div
                  class="toggle-container"
                  :class="{ active: autoRemoveSusEvents }"
                  style="height: 1.25rem; width: 2.5rem"
                  @click="autoRemoveSusEvents = !autoRemoveSusEvents"
                >
                  <div
                    class="toggle-background"
                    style="border-radius: 1.25rem; height: 0.75rem; width: 2rem"
                  ></div>
                  <div
                    class="toggle-bar"
                    style="border-radius: 1.25rem; height: 1.25rem; width: 1.25rem"
                    :style="autoRemoveSusEvents ? 'transform: translateX(1.25rem)' : ''"
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <div
                class="container select-item"
                theme="light"
                data-op="accept_odds_changes"
                style="padding-right: 1.33333rem"
              >
                <div class="item-title" data-cms-key="accept_odds_changes">Accept odds changes</div>
                <div
                  class="toggle-container"
                  style="height: 1.25rem; width: 2.5rem"
                  :class="{ active: acceptChanges }"
                  @click="couponStore.coupon.acceptChanges = !couponStore.coupon.acceptChanges"
                >
                  <div
                    class="toggle-background"
                    style="border-radius: 1.25rem; height: 0.75rem; width: 2rem"
                  ></div>
                  <div
                    class="toggle-bar"
                    style="border-radius: 1.25rem; height: 1.25rem; width: 1.25rem"
                    :style="acceptChanges ? 'transform: translateX(1.25rem)' : ''"
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <div
                class="container select-item no-border"
                theme="light"
                data-op="retain_selections_after_rebet"
                style="padding-right: 1.33333rem"
              >
                <div class="item-title">Retain selections after Rebet</div>
                <div class="toggle-container" style="height: 1.25rem; width: 2.5rem">
                  <div
                    class="toggle-background"
                    style="border-radius: 1.25rem; height: 0.75rem; width: 2rem"
                  ></div>
                  <div
                    class="toggle-bar"
                    style="border-radius: 1.25rem; height: 1.25rem; width: 1.25rem"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCouponStore } from '@/stores'
import { computed, ref } from 'vue'

const couponStore = useCouponStore()
const autoRemoveSusEvents = ref(false)
const acceptChanges = computed(() => {
  return couponStore.coupon.acceptChanges
})
</script>
<style scoped>
.popup-modal {
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  left: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}
.select-container {
  border-top: 0.41666667rem solid;
  bottom: 0;
  font-family: 'Roboto';
  left: 0;
  position: fixed;
  width: 100%;
  border-top-color: #f2f3f5;
  /* border-top-color: var(--background-type1-primary); */
  background-color: #fafafa;
  /* background-color: var(--background-general-primary); */
  color: #353a45;
  /* color: var(--text-type1-primary); */
}
.select-container .m-close {
  height: 46px;
  position: absolute;
  right: 1px;
  top: -39px;
  width: 46px;
}
.select-container .m-head {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 1.66666667rem 1.33333333rem;
}
.select-container .m-head .title {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  -webkit-box-flex: 1.2;
  -webkit-flex-grow: 1.2;
  -ms-flex-positive: 1.2;
  flex-grow: 1.2;
  font-size: 1.33333333rem;
  font-weight: 700;
  line-height: 1.33333333rem;
}
.select-container .m-body {
  max-height: 69vh;
  overflow-y: auto;
}
.select-container .select-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
}
.select-container .select-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-weight: 700;
  height: 4rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1rem 1.33333333rem;
  border-bottom-color: #eaecef;
  /* border-bottom-color: var(--line-type1-primary); */
}
.select-container .select-item.no-border {
  border-bottom: none;
}
.select-container .select-item .item-title {
  font-size: 1rem;
  line-height: 1rem;
}
.select-container .select-item .more-icon {
  color: #9ca0ab;
}

/* Yoggle */
.toggle-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  position: relative;
}
.toggle-container .toggle-background,
.toggle-container .toggle-bar {
  background-color: #9ca0ab;
}
.toggle-container .toggle-background {
  left: 50%;
  opacity: 0.5;
  overflow: hidden;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  z-index: 0;
}
.toggle-container .toggle-bar {
  -webkit-box-shadow: 0 0.7px 3px rgba(0, 0, 0, 0.4);
  box-shadow: 0 0.7px 3px rgba(0, 0, 0, 0.4);
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  z-index: 0;
}
.toggle-container.active .toggle-background,
.toggle-container.active .toggle-bar {
  background-color: var(--brand-primary);
}
</style>

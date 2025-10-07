<template>
  <div class="x-load-bet">
    <HeaderOther :headerTitle="'Code Hub'" :styles="'position: fixed; top: 0'"></HeaderOther>
    <div class="code-hub-content">
      <TabWrapper :active="activeTab" @set-active="setActive" />
      <div v-if="activeTab === 'code-hub'" class="code-hub-list-container">
        <div class="code-hub-list-filter space-from-top-navbar">
          <!-- <OptionsContainer /> -->
        </div>
        <div
          class="scroll-wrap scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          <div class="code-hub-list-item-container">
            <CodeHubItem v-for="code in codes" :code="code" :key="code.betslipId" />
          </div>
          <div class="loading-more-wrapper" style="position: relative"></div>
          <div class="bottom-ele"></div>
        </div>
      </div>
      <LoadCode v-else />
    </div>
  </div>
</template>

<script setup>
import HeaderOther from '@/components/HeaderOther.vue'
import CodeHubItem from '@/components/CodeHub/CodeHubItem.vue'
import TabWrapper from '@/components/CodeHub/TabWrapper.vue'
import LoadCode from '@/components/CodeHub/LoadCode.vue'
import OptionsContainer from '../components/CodeHub/OptionsContainer.vue'
import { onMounted, ref } from 'vue'
import { getCodeHubItems, getNext7Days } from '../helpers'
const codes = ref([])
const activeTab = ref('code-hub')

async function getCodes() {
  let payload = {
    from: getNext7Days()[0],
    to: getNext7Days()[7],
    betType: 0
  }
  const res = await getCodeHubItems(payload)
  codes.value = res.data.data
}

function setActive(data) {
  activeTab.value = data
}
onMounted(async () => {
  await getCodes()
})
</script>

<style scoped>
.code-hub-root {
  font-family: Roboto;
}
.code-hub-root .sport-text {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  gap: 1.33333333rem;
}
.code-hub-root .sport-text span {
  font-size: 1.16666667rem;
}
.code-hub-root .tab-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: transparent;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--line-type1-primary);
}
.code-hub-root .tab-wrapper .tab-list {
  max-width: 100%;
  overflow: hidden;
  width: 100%;
}
.code-hub-root .tab-wrapper.justify-content-space-around {
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
.code-hub-root .nav-tab-item {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.16666667rem;
  height: 4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;
}
.code-hub-root .nav-tab-item.active {
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--brand-highlight-text);
  border-bottom-color: var(--brand-secondary);
  font-weight: bold;
}
.code-hub-root .tab-item {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.16666667rem;
  height: 4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
}
.code-hub-root .tab-item.router-link-active {
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--brand-highlight-text);
  border-bottom-color: var(--brand-secondary);
  font-weight: bold;
}
.code-hub-root .width-100 {
  width: 100%;
}
.m-topnav {
  position: fixed;
  z-index: 9999;
}
.code-hub-content {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  margin-top: 3.66666667rem;
}
.code-hub-header-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1rem;
  padding-left: 0;
  position: relative;
}
.code-hub-header-right .z-1000 {
  z-index: 1000;
}
.code-hub-header-right::before {
  background-color: #9ca0ab;
  background-color: var(--line-type1-secondary);
  content: '';
  height: 1.33333333rem;
  margin-right: 1rem;
  position: relative;
  width: 0.08333333rem;
}
.code-hub-header-right .custom-codes-icon {
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
  cursor: pointer;
}
.code-hub-header-right .custom-code-entry-hint.hint-container {
  padding: 0.66666667rem 1rem;
  width: 21.33333333rem;
}
.code-hub-header-right .custom-code-entry-hint.hint-container .hint-content {
  font-size: 1rem;
}
.code-hub-header-right .custom-code-entry-hint.hint-container .svg-icon-base {
  height: 1rem;
  padding-left: 0.33333333rem;
  width: 1rem;
}
.loading-icon-input {
  -webkit-animation: rotation-0885939a 2s infinite linear;
  animation: rotation-0885939a 2s infinite linear;
  left: 21.41666667rem;
  position: absolute;
}
@-webkit-keyframes rotation-0885939a {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}
@keyframes rotation-0885939a {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}
.code-hub-list-container .space-from-top-navbar {
  left: 0;
  position: -webkit-sticky;
  position: sticky;
  right: 0;
  top: 3.66666667rem;
  z-index: 500;
}
.code-hub-list-container .code-hub-list-item-container {
  padding: 0.66666667rem;
  position: relative;
}
.code-hub-list-container
  .code-hub-list-item-intersection-observer-wrap
  + .code-hub-list-item-intersection-observer-wrap {
  margin-top: 0.66666667rem;
}
.code-hub-list-container .loading-more-wrapper .m-loading-wrap {
  min-height: 58px;
}
.booking-code {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 501;
}
</style>

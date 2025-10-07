<template>
  <div class="tab-wrapper justify-content-space-around">
    <div class="tab-list">
      <div class="m-snap-nav-wrap" style="overflow: hidden">
        <ul
          class="m-snap-nav flex"
          style="
            transform: translate(0px, 0px) translateZ(0px);
            transition-duration: 350ms;
            transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
          "
        >
          <li
            class="nav-tab-item m-snap-nav-item d-flex"
            role="link"
            aria-label="Popular Codes"
            style="display: flex !important"
            :class="active === 'code-hub' ? 'active' : ''"
            @click="$emit('set-active', 'code-hub')"
          >
            <span data-cms-key="popular_codes" data-cms-page="page_code_hub">Popular Codes</span>
          </li>
          <li
            class="nav-tab-item m-snap-nav-item"
            role="link"
            aria-label="Load Code"
            style="display: flex !important"
            :class="active === 'load-code' ? 'active' : ''"
            @click="$emit('set-active', 'load-code')"
          >
            <span data-cms-key="load_code" data-cms-page="page_code_hub">Load Code</span>
          </li>
        </ul>
        <i class="controls left-controls"></i>
        <i class="controls right-controls"></i>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['active'])
defineEmits(['set-active'])
</script>

<style>
.tab-wrapper {
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
}
.tab-wrapper .tab-list {
  max-width: 100%;
  overflow: hidden;
  width: 100%;
}
.tab-wrapper.justify-content-space-around {
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
.nav-tab-item {
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
  font-size: 1.16666667rem !important;
  height: 4rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;
}
.tab-wrapper .nav-tab-item.active {
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--brand-highlight-text);
  border-bottom-color: var(--brand-secondary);
  font-weight: bold;
}
.tab-wrapper .tab-item {
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
.tab-wrapper .tab-item.router-link-active {
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: var(--brand-highlight-text);
  border-bottom-color: var(--brand-secondary);
  font-weight: bold;
}
.tab-wrapper .width-100 {
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
</style>

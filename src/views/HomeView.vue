<template lang="">
  <div>
    <HeaderHome></HeaderHome>
    <div></div>
    <div class="home">
      <!-- Banner Carousel -->
      <Carousel></Carousel>
      <!-- Banner Carousel -->
      <!-- SportsList Carousel -->
      <SportsListCarousel></SportsListCarousel>
      <!-- SportsList Carousel -->
      <!-- Popular Sports -->
      <keep-alive>
        <PopularSports></PopularSports>
      </keep-alive>
      <!-- Popular Sports -->
      <keep-alive>
        <LiveContainer></LiveContainer>
      </keep-alive>
      <!-- Highlights -->
      <Highlights></Highlights>
      <!-- Highlights -->
    </div>
  </div>
</template>
<script setup>
import HeaderHome from '@/components/HeaderHome.vue'
import Carousel from '@/components/Home/Carousel.vue'
import SportsListCarousel from '@/components/Home/SportsListCarousel.vue'
import LiveContainer from '@/components/Home/LiveContainer.vue'
import PopularSports from '@/components/Home/PopularSports.vue'
import Highlights from '@/components/Home/HighlightsContainer.vue'
import emitter from '@/plugins/emitter'
import { useUsersStore, useUtilsStore } from '../stores'
import { onMounted } from 'vue'

const userStore = useUsersStore()
const utilsStore = useUtilsStore()

onMounted(async () => {})
</script>

<style>

.m-sports, .home {
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
}

.m-sports .m-sports-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  /* background-color: #fafafa; */
  /* background-color: var(--background-type1-secondary); */
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  line-height: 1.75rem;
  padding: 0.83333333rem;
  width: 100%;
}

.m-sports .m-sports-title.fixed {
  position: fixed;
  top: 3.66666667rem;
  z-index: 220;
}

.m-sports .m-sports-title .m-title-sport {
  border-right: solid 0.5px;
  border-right-color: #9ca0ab;
  border-right-color: var(--line-type1-secondary);
  margin-right: 1rem;
  padding-right: 1rem;
}

.m-sports .m-sports-title .m-title-sport.filter {
  border-right: none;
}

.m-sports .m-sports-title .m-sport-type .m-sport-type-item {
  color: #353a45;
  color: var(--c-prematch-sport-item-text);
  font-size: 1.066rem;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
}

.m-sports .m-sports-title .m-sport-type .m-sport-type-item.active {
  color: var(--brand-highlight-text);
  /* color: var(--brand-quaternary); */
  font-weight: bold;
}

.m-sports .m-sports-title .filter-control {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: solid #353a45 0.08333333rem;
  border-color: #353a45;
  border-color: var(--c-prematch-filter-control-border);
  border-radius: 0.16666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: normal;
  height: 2.33333333rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-left: 1rem;
  padding: 0 0.33333333rem 0 0.33333333rem;
}

.m-sports .m-sports-title .filter-control .m-icon-close {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0 0.41666667rem;
}

.m-sports .m-sports-title .filter-control .m-icon-close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-sports .m-sports-title .filter-control .m-icon-close:before {
  font-size: 0.83333333rem;
}

.m-sports .m-sports-title .filter-control svg.filterSvgIcon {
  height: 1.66666667rem;
  width: 1.66666667rem;
}

.m-sports .m-sports-title .filter-control svg.filterSvgIcon path {
  fill: #353a45;
  fill: var(--text-type1-primary);
}

.m-sports .m-sports-title .filter-control svg.filterSvgIcon circle {
  stroke: #353a45;
  fill: var(--text-type1-primary);
}

.m-sports .m-sports-title .filter-control.active {
  background: #d6ebdc;
  background: var(--brand-background-secondary);
  border-color: #d6ebdc;
  border-color: var(--brand-background-secondary);
  color: #096b27;
  padding: 0 0.5rem 0 0;
  width: auto;
}

.m-sports .m-sports-title .filter-control.active .m-icon-clear {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0 0.66666667rem 0 0.75rem;
}

.m-sports .m-sports-title .filter-control.active .m-icon-clear::before {
  content: '\e602';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-sports .m-sports-title .filter-control.active .m-icon-clear:before {
  color: rgba(9, 107, 39, 0.3);
  font-size: 1.066rem;
}

.m-sports .m-sports-title .filter-control.active .range {
  border-right: solid 0.08333333rem rgba(9, 107, 39, 0.2);
  font-weight: bold;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  margin-right: 0.66666667rem;
  padding: 0 0.66666667rem 0 0.33333333rem;
}

.m-sports .m-sports-title .filter-control.active svg.filterSvgIcon g path {
  fill: #096b27;
}

.m-sports .m-sports-title .filter-control.active svg.filterSvgIcon g circle {
  stroke: #096b27;
}

.m-sports .m-overlay {
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  top: 7.58333333rem;
  width: 100%;
  z-index: 220;
}

.m-sports .m-filter-pop.m-filter {
  border-top: 1px solid;
  border-top-color: #eaecef;
  border-top-color: var(--brand-border-type1);
  position: fixed;
  top: 7.58333333rem;
  z-index: 221;
}

.m-sports .view-all {
  border-top: 1px solid #f2f3f5;
  border-color: #f2f3f5;
  border-color: var(--brand-border-type1);
}

.m-sports .view-all a,
.m-sports .view-all a:hover,
.m-sports .view-all a:visited,
.m-sports .view-all a:active,
.m-sports .view-all a:after {
  color: var(--brand-primary);
  text-decoration: none;
}

.m-sports .m-pre-opts {
  position: relative;
  width: 100%;
}

.m-sports .m-pre-opts .m-bet-content .m-league .m-league-conent {
  margin-top: 0.33333333rem;
}

.m-sports .m-pre-opts.m-tabs {
  position: relative;
  width: 100%;
  /* background-color: rgb(6,0,25); */
}

.m-sports .m-pre-opts.m-tabs .m-tabs-nav {
  border-bottom: 1px solid #f2f3f5;
  border-color: #f2f3f5;
  border-color: var(--c-prematch-tab-border);
  margin: 0 auto;

  background-color: rgb(0,14,34);
}

.m-sports .m-pre-opts.m-tabs .m-tabs-tab {
  color: #353a45;
  color: var(--c-prematch-tab-name-text);
  -webkit-box-flex: initial;
  -webkit-flex: initial;
  -ms-flex: initial;
  flex: initial;
  font-size: 1.066rem;
  line-height: 3.66666667rem;
  padding: 0 1.33333333rem;
  width: calc(100vw / 3);
}

.m-sports .m-pre-opts.m-tabs .m-tabs-tab.m-tabs-tab-active {
  color: #1b1e25;
  color: var(--c-prematch-tab-name-active);
  border-bottom: 0.23333333rem solid var(--brand-primary);
  font-weight: bold;
}

.m-sports .m-pre-opts.m-tabs .m-tabs-tabpane .m-date-row {
  margin-bottom: -1px;
}

.m-sports .m-pre-opts.m-tabs .m-tabs-ink-bar {
  background-color: transparent;
  bottom: 0;
  height: 0.23333333rem;
}

.m-sports .m-pre-opts.nav-fixed {
  padding-top: 11.91666667rem;
}

.m-sports .m-pre-opts.nav-fixed > .m-tabs-nav {
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
  left: 0;
  margin: 0 auto;
  position: fixed;
  right: 0;
  top: 3.66666667rem;
  -webkit-transition: top 0.3s ease !important;
  transition: top 0.3s ease !important;
  width: 70%;
  z-index: 219;
}

.m-sports .m-pre-opts.nav-fixed > .m-tabs-nav:before {
  background-color: #fafafa;
  background-color: var(--background-type1-secondary);
  bottom: 0;
  content: '';
  height: 100%;
  margin-left: 50%;
  position: absolute;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 100vw;
  z-index: -1;
}

.m-sports .m-pre-opts.nav-fixed.nav-up > .m-tabs-nav {
  position: fixed;
  top: 7.58333333rem;
}

.m-sports-table .m-date-row {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 2rem;
  line-height: 2rem;
  padding: 0 0.83333333rem;
}

.m-sports-table .m-date-row .m-date {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1rem;
}

.m-sports-table .m-date-row .market-title {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  width: 55%;
}

.m-sports-table .m-date-row .market-title > div {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 0.83333333rem;
  text-align: center;
}

.m-sports-table .m-sports-row {
  margin: 0 0.83333333rem;
}

.m-sports-table .m-inner-ads {
  display: block;
  margin: 0.83333333rem;
}

.m-sports-table .m-inner-ads img {
  display: block;
  width: 100%;
}
</style>

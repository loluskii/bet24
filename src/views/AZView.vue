<template>
  <div class="m-azmenu" id="azmenu">
    <template v-if="!selectTournaments">
      <div class="top">
        <a href="/Search" class="azmenu-search-wrap"
          ><span>Teams/Players, League, Game ID</span> <span class="m-icon m-icon-search"></span
        ></a>
      </div>
      <div class="sport-menu" style="position: relative">
        <div class="tab-wrap">
          <div class="az-tabs m-tabs m-tabs-mini m-tabs-no-animation" style="overflow: hidden">
            <div class="m-tabs-nav" style="width: 100%">
              <div class="m-tabs-tab" style="font-weight: bold">Sports</div>
            </div>
            <div class="m-tabs-content" style="transform: translateX(0%) translateZ(0px)">
              <div class="m-tabs-tabpane">
                <div class="tab-pane-content">
                  <div class="tab-pane-left">
                    <div
                      class="right-panel-item"
                      :class="sport.sportID === activeSport.sportID ? 'active' : ''"
                      v-for="(sport, index) in sportsMenu"
                      :key="index"
                      @click="setActiveSport(sport)"
                    >
                      <span>{{ sport.sportName }}</span>
                    </div>
                  </div>
                  <div class="tab-pane-right">
                    <template v-if="!isLoading">
                      <div class="right-panel-item__header">A-Z</div>
                      <template v-for="(category, i) in countriesList" :key="i">
                        <div
                          class="right-panel-item"
                          v-if="category.categoryID && category.categoryID !== 0"
                          @click="redirectToFixturesView(category)"
                        >
                          <span>{{ category.categoryName }}</span>
                          <span>{{ category.total }}</span>
                        </div>
                        <!-- <p class="right-panel-item" v-else>No Data Available</p> -->
                      </template>
                    </template>
                    <LoadingSpinner v-else />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <AZTournmentSelect
      v-else
      @close-select="selectTournaments = false"
      :category="activeCategory"
      :sport="activeSport"
      :loading="isLoading"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useUtilsStore } from '../stores/utils.store'
import { getCategoriesBySport, FEED_TOGGLE } from '../helpers'
const { sportsMenu } = useUtilsStore()
// import { useRouter } from 'vue-router'
import AZTournmentSelect from '@/components/AZTournmentSelect.vue'
import LoadingSpinner from '../components/Loaders/LoadingSpinner.vue'

const countriesList = ref([])
const selectTournaments = ref(false)
const utilsStore = useUtilsStore()

const page = ref()
const isLoading = ref(false)

const activeCategory = ref(null)

const activeSport = reactive({
  sportName: 'Soccer',
  sportID: 1
})

async function getCountriesList() {
if(!FEED_TOGGLE)return
  isLoading.value = true
  const sports = await getCategoriesBySport(activeSport.sportID)
  const existingIndex = utilsStore.categoriesList.findIndex(
    (sport) => sport.id === activeSport.sportID
  )
  const updatedCategories = {
    id: activeSport.sportID,
    name: activeSport.sportName,
    categories: sports.sports
  }
  existingIndex === -1
    ? utilsStore.categoriesList.push(updatedCategories)
    : (utilsStore.categoriesList[existingIndex] = updatedCategories)
  countriesList.value = sports.sports
  isLoading.value = false
}

async function setActiveSport(sport) {
  activeSport.sportName = sport.sportName
  activeSport.sportID = sport.sportID
  await getCountriesList()
}

function redirectToFixturesView(category) {
  selectTournaments.value = true
  activeCategory.value = category

  // return router.push({
  //   name: 'fixtures-by-category',
  //   params: {
  //     sport: activeSport.sportName,
  //     category: slugify(category.categoryName),
  //     category_id: category.categoryID
  //   }
  // })
}

onMounted(async () => {
  await getCountriesList()
  document.getElementById('azmenu').style.height = 'calc(100% - 48px)'
})
</script>

<style type="text/css">
.m-azmenu {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #eaecef;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(100% - 48px);
}
.m-azmenu .tab-pane-content {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.m-azmenu .tab-pane-content.tab-pane-promotions {
  height: 91%;
  overflow: auto;
}
.m-azmenu .m-tabs-tabpane {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
}
.m-azmenu .tab-pane-left {
  border-right: solid 1px #eaecef;
  color: #eaecef;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 1.33333333rem;
  height: 91%;
  overflow-y: auto;
  width: 40%;
}
.m-azmenu .tab-pane-right {
  color: #eaecef;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 1.066rem;
  height: 100%;
  overflow-y: auto;
  width: 60%;
}
.m-azmenu .tab-pane-right .no-odds {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #353a45;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 100%;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.m-azmenu .sport-item {
  padding: 0.83333333rem;
}
.m-azmenu .sport-item.active {
  color: var(--brand-primary);
}
.m-azmenu .right-panel-item {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.83333333rem;
}
.m-azmenu .right-panel-item.active {
  color: var(--brand-highlight-text);
  font-weight: bold !important;
}
.m-azmenu .right-panel-item__header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-weight: bold;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.83333333rem;
}
.m-azmenu .right-panel-item__header .all {
  font-weight: normal;
}
.m-azmenu .right-panel-item__header a:hover,
.m-azmenu .right-panel-item__header a:visited,
.m-azmenu .right-panel-item__header a:active,
.m-azmenu .right-panel-item__header a {
  color: #353a45;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  text-decoration: none;
  width: 100%;
}
.m-azmenu .right-panel-item__header .right-chevron:before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .right-panel-item__header .right-chevron::before {
  font-size: 0.83333333rem;
  font-weight: normal;
  margin-left: 0.41666667rem;
}
.m-azmenu .no-data {
  color: #9ca0ab;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  margin-top: 30%;
  text-align: center;
}
.m-azmenu .no-data:before {
  content: '\e624';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .no-data p {
  font-size: 1.066rem;
}
.m-azmenu .no-data:before {
  color: #dcdee5;
  font-size: 2.5rem;
}
.m-azmenu .top {
  background: var(--brand-primary);
  border-top: 1px solid transparent;
  padding: 0;
}
.m-azmenu .top a:hover,
.m-azmenu .top a:visited,
.m-azmenu .top a:active,
.m-azmenu .top a {
  color: #ffffff;
  text-decoration: none;
}
.m-azmenu .top .azmenu-search-wrap {
  background-color: #ffffff;
  border-radius: 0.16666667rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  line-height: 1.33333333rem;
  margin: 1.66666667rem 1.25rem 1.6rem;
  padding: 0.5rem 0.66666667rem;
}
.m-azmenu .top .azmenu-search-wrap span {
  color: #9ca0ab;
}
.m-azmenu .top .azmenu-search-wrap .m-icon-search {
  display: inline-block;
  vertical-align: middle;
}
.m-azmenu .top .azmenu-search-wrap .m-icon-search:before {
  content: '\e613';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .top .azmenu-search-wrap .m-icon-search::before {
  font-size: 1.33333333rem;
  padding-right: 0.33333333rem;
}
.m-azmenu .top .m-azmenu-nav {
  color: #353a45;
  margin-top: 0.25rem;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item {
  padding: 0;
  text-align: center;
  overflow-wrap: break-word;
  -webkit-hyphens: manual;
  -ms-hyphens: manual;
  hyphens: manual;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item:not(:last-child) {
  padding-right: 5px;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item:first-child {
  padding-left: 0.83333333rem;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item:last-child {
  padding-right: 0.83333333rem;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item > a {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: 1rem 0.33333333rem;
  white-space: pre-line;
  width: calc(100% / 4);
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item .sprot-icon {
  display: block;
  text-align: center;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item .sprot-icon.m-virtual-icon:before {
  content: '\e68a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item .sport-text {
  display: block;
  font-size: 0.83333333rem;
  line-height: 0.91666667rem;
}
.m-azmenu .tab-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  overflow: hidden;
  width: 100vw;
}
.m-azmenu .tab-wrap .az-tabs {
  width: 100%;
}
.m-azmenu .tab-wrap .az-tabs.m-tabs {
  height: 100%;
  position: relative;
}
.m-azmenu .tab-wrap .az-tabs.m-tabs .m-tabs-nav {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  width: 100%;
}
.m-azmenu .tab-wrap .az-tabs.m-tabs .m-tabs-nav .m-tabs-tab {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #eaecef;
  font-size: 1.066rem;
  font-weight: 500;
  line-height: 3.66666667rem;
  margin: 0;
  padding: 0;
  width: 3.33333333rem;
}
.m-azmenu .tab-wrap .az-tabs.m-tabs .m-tabs-nav .m-tabs-ink-bar {
  background: var(--brand-primary);
  bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.m-azmenu .tab-wrap .az-tabs .m-tabs-tabpane {
  border-top: 1px #eaecef solid;
  height: 100%;
  overflow: hidden;
}
.m-azmenu .tab-wrap .m-tabs-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 100%;
  position: relative;
}
.m-azmenu .sport-menu {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  z-index: 3;
}

.m-azmenu .top .m-azmenu-nav .m-azmenu-nav-item .sprot-icon {
  display: block;
  margin-bottom: 0.33333333rem;
  text-align: center;
  width: 1.75rem;
}
</style>

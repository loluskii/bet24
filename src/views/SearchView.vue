<template>
  <div class="m-search">
    <div class="m-search--bar m-col2">
      <div class="m-l-left" @click="$router.push({ name: 'home' })">
        <i class="m-icon-back"></i>
      </div>
      <form id="search" class="m-l-right">
        <div class="m-input-wap-wrapper">
          <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>

          <input
            role=""
            aria-label=""
            type="search"
            name=""
            placeholder="Teams/Players, Leagues, Game ID"
            autocomplete="off"
            class="m-input-wap fs-exclude"
            v-model="searchQuery"
            @input="handleInput"
            @keydown.enter.prevent="handleEnter"
          />
        </div>
      </form>
    </div>
    <div v-if="resultsIsEmpty && !isLoading">
      <div></div>
      <div>
        <div class="m-error-wrapper">
          <div>
            <span class="m-error-msg m-empty">No results at this time</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-else-if="searchQuery === '' && !isLoading" class="m-search--history">
      <div class="m-title m-col2">
        <div class="m-l-left">Search History</div>
        <div class="m-l-right">Clear</div>
      </div>
      <ul class="m-list">
        <li class="m-l-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            height="14px"
            width="14px"
            class="search-icon svg-icon-base"
          >
            <path
              d="M13.64 11.898L10.884 9.14c-.041-.04-.087-.072-.13-.106a5.811 5.811 0 00.946-3.183A5.85 5.85 0 105.85 11.7c1.176 0 2.269-.35 3.186-.948.034.044.064.09.105.13l2.758 2.758c.24.24.555.36.87.36.315 0 .63-.12.87-.36.48-.48.48-1.26.002-1.742M5.849 9.851A4.007 4.007 0 011.847 5.85a4.007 4.007 0 014.002-4.002A4.007 4.007 0 019.851 5.85a4.007 4.007 0 01-4.002 4.001"
              fill="currentColor"
              fill-rule="nonzero"
            ></path>
          </svg>
          pardubice
        </li>
      </ul>
    </div> -->
    <LoadingSpinner v-if="isLoading" />
    <LiveGroup
      :fixturesData="liveSports"
      v-if="!resultsIsEmpty && !isLoading && liveSports.length"
      :markets="results.markets"
    />
    <PrematchGroup
      :fixturesData="prematchSports"
      v-if="!resultsIsEmpty && !isLoading && prematchSports.length"
      :markets="results.markets"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { debounce } from 'lodash'
import PrematchGroup from '@/components/Search/PrematchGroup.vue'
import LiveGroup from '@/components/Search/LiveGroup.vue'
import { searchFixtures } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const searchQuery = ref('')
const results = ref({
  fixtures: []
})
const isLoading = ref(false)

const resultsIsEmpty = computed(() => {
  return results.value.fixtures === undefined
})

const handleInput = (event) => {
  debouncedSearch(event.target.value)
}

const handleEnter = async (event) => {
  event.preventDefault()
  isLoading.value = true
  searchFixtures(event.target.value)
    .then((res) => {
      results.value = res
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      isLoading.value = false
    })
}

// Debounced search function
const debouncedSearch = debounce((query) => {
  if (isLoading.value || results.value.fixtures.length) {
    return
  }
  isLoading.value = true
  console.log('Searching for:', query)
  // Place your search logic here, e.g., making an API call
  searchFixtures(query)
    .then((res) => {
      results.value = res
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      isLoading.value = false
    })
}, 3000) // Adjust the debounce delay as needed
const prematchSports = computed(() => {
  if (results.value.fixtures) {
    const arr = []
    results.value.fixtures.forEach((fixture) => {
      if (fixture?.matchStatus === 'Not started') {
        const sport = arr.find((item) => item.sportName === fixture.sportName)
        if (sport) {
          sport.fixtures.push(fixture)
        } else {
          arr.push({
            sportID: fixture.sportID,
            sportName: fixture.sportName,
            fixtures: [fixture]
          })
        }
      }
    })
    return arr
  } else {
    return []
  }
})

const liveSports = computed(() => {
  if (results.value.fixtures) {
    const arr = []
    results.value.fixtures.forEach((fixture) => {
      if (fixture?.matchStatus !== 'Not started' && fixture?.matchStatus !== 'Ended') {
        const sport = arr.find((item) => item.sportName === fixture.sportName)
        if (sport) {
          sport.fixtures.push(fixture)
        } else {
          arr.push({
            sportID: fixture.sportID,
            sportName: fixture.sportName,
            fixtures: [fixture]
          })
        }
      }
    })
    return arr
  } else {
    return []
  }
})
</script>

<style type="text/css">
.m-search {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  min-height: 100%;
}
.m-search .m-col2 {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  width: 100%;
}
.m-search .m-col2 .m-l-left {
  display: table-cell;
}
.m-search .m-col2 .m-l-right {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
}
.m-search .m-error-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  padding: 20% 2.66666667rem 0;
}
.m-search .m-error-wrapper > div {
  display: table-cell;
  text-align: center;
  width: 100%;
}
.m-search .m-error-wrapper .m-icon-loading {
  -webkit-animation: loading-rotate 2s linear infinite;
  animation: loading-rotate 2s linear infinite;
  display: block;
  height: 2.5rem;
  text-align: center;
}
.m-search .m-error-wrapper .m-icon-loading::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-search .m-error-wrapper .m-icon-loading:before {
  color: #dcdee5;
  font-size: 2.5rem;
  line-height: 1;
}
.m-search .m-error-wrapper .m-text-msg {
  color: #dcdee5;
  display: block;
  font-size: 1rem;
  line-height: 1.33333333rem;
  margin-top: 2.5rem;
}
.m-search .m-error-wrapper .m-error-msg {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  display: block;
  font-size: 1.066rem;
  line-height: 1.58333333rem;
  margin-bottom: 2.25rem;
}
.m-search .m-error-wrapper .m-error-msg::before {
  content: '\e624';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-search .m-error-wrapper .m-error-msg:before {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
  display: block;
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 1.25rem;
}
.m-search .m-error-wrapper .m-btn {
  border: 1px solid var(--brand-highlight-text);
  border-radius: 0.25rem;
  color: var(--brand-highlight-text);
  display: inline-block;
  height: 3rem;
  line-height: 3rem;
  padding: 0 2.33333333rem;
}
.m-search .m-error-wrapper .m-empty::before {
  content: '\e61b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-search .m-error-wrapper .m-empty:before {
  font-size: 3rem;
  line-height: 1;
}
.m-result-grey {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}
@-webkit-keyframes loading-rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading-rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.m-search--bar {
  background: var(--brand-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  grid-template-columns: 3.66666667rem 1fr;
  padding: 0.58333333rem 0;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  z-index: 201;
}
.m-search--bar .m-l-left {
  text-align: center;
  width: 3.66666667rem;
}
.m-search--bar .m-l-right {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 1.25rem;
}
.m-search--bar .m-input-wap-wrapper {
  background-color: #ffffff;
  background-color: var(--c-search-input-bg);
  border: none;
  border-radius: 0.16666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1rem;
  height: 2.16666667rem;
  line-height: 1.066rem;
  padding: 0 0.25rem;
  width: 100%;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon {
  text-align: center;
  text-indent: 0.16666667rem;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon + .m-input-wap {
  padding-right: 3.33333333rem;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap {
  background-color: #ffffff;
  background-color: var(--c-search-input-bg);
  border: none !important;
  height: 2.16666667rem;
  padding-left: 0.16666667rem;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap::-webkit-input-placeholder {
  color: #9ca0ab;
  color: var(--c-search-input-placeholder-text);
}
.m-search--bar .m-input-wap-wrapper .m-input-wap::-moz-placeholder {
  color: #9ca0ab;
  color: var(--c-search-input-placeholder-text);
}
.m-search--bar .m-input-wap-wrapper .m-input-wap::-ms-input-placeholder {
  color: #9ca0ab;
  color: var(--c-search-input-placeholder-text);
}
.m-search--bar .m-input-wap-wrapper .m-input-wap::placeholder {
  color: #9ca0ab;
  color: var(--c-search-input-placeholder-text);
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon:before {
  font-size: 1rem;
}
.m-search--bar .m-input-wap-wrapper.m-input-wap-wrapper--active {
  border: none;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon--clickable:hover {
  color: #33ea6a !important;
}
.m-search--bar .m-input-wap-wrapper .m-input-wap-icon--clickable:active {
  color: var(--brand-highlight-text) !important;
}
.m-search--bar .m-icon-back {
  color: #ffffff;
  color: var(--text-type2-primary);
  display: inline-block;
  height: 2.5rem;
  line-height: 2.5rem;
}
.m-search--bar .m-icon-back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-search--bar .m-icon-back:before {
  font-size: 1.066rem;
  line-height: 1;
}
.m-search--bar input[type='search']::-webkit-search-cancel-button {
  display: none;
}
.m-search--bar input[type='search'] {
  -webkit-appearance: none;
}

.m-search--history .m-title {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr;
  padding: 1rem 1.33333333rem;
}
.m-search--history .m-l-left,
.m-search--history .m-l-right {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 50%;
}
.m-search--history .m-l-right {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1rem;
  line-height: 1.066rem;
  text-align: right;
}
.m-search--history .m-l-left {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.066rem;
  line-height: 1.33333333rem;
}
.m-search--history .m-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 0 1.33333333rem;
  width: 100%;
}
.m-search--history .m-list .m-l-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1rem;
  max-width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m-search--history .m-list .search-icon {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  margin-right: 1.33333333rem;
}
.es-dialog.search-history-clear .es-dialog-body .es-dialog-main {
  color: rgba(0, 0, 0, 0.54);
  color: var(--c-search-history-dialog-color);
  font-size: 1.33333333rem;
}
</style>

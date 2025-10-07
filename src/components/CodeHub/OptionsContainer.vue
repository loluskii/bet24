<template>
  <div data-v-51a6e872="" class="select-container">
    <div
      data-v-51a6e872=""
      role="menu"
      aria-label="time filter"
      data-op="time-filter-menu"
      class="select"
    >
      <p data-v-51a6e872="" class="text">Time</p>
      <span data-v-51a6e872="" class="icon"
        ><svg
          data-v-51a6e872=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="svg-icon-base"
          style="height: 1.5rem; width: 1.5rem"
        >
          <path
            d="M10 6.666l6.667 5.926H3.333L10 6.666z"
            fill="currentColor"
            fill-rule="nonzero"
          ></path></svg
      ></span>
    </div>
    <div
      data-v-51a6e872=""
      role="menu"
      aria-label="folds filter"
      data-op="folds-filter-menu"
      class="select"
    >
      <p data-v-51a6e872="" class="text">Folds</p>
      <span data-v-51a6e872="" class="icon"
        ><svg
          data-v-51a6e872=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="svg-icon-base"
          style="height: 1.5rem; width: 1.5rem"
        >
          <path
            d="M10 6.666l6.667 5.926H3.333L10 6.666z"
            fill="currentColor"
            fill-rule="nonzero"
          ></path></svg
      ></span>
    </div>
    <div
      data-v-51a6e872=""
      role="menu"
      aria-label="odds filter"
      data-op="odds-filter-menu"
      class="select"
    >
      <p data-v-51a6e872="" class="text">Odds</p>
      <span data-v-51a6e872="" class="icon"
        ><svg
          data-v-51a6e872=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="svg-icon-base"
          style="height: 1.5rem; width: 1.5rem"
        >
          <path
            d="M10 6.666l6.667 5.926H3.333L10 6.666z"
            fill="currentColor"
            fill-rule="nonzero"
          ></path></svg
      ></span>
    </div>
    <div
      data-v-51a6e872=""
      role="menu"
      aria-label="sort filter"
      data-op="sort-filter-menu"
      class="select"
    >
      <p data-v-51a6e872="" class="text">Sort</p>
      <span data-v-51a6e872="" class="icon"
        ><svg
          data-v-51a6e872=""
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="svg-icon-base"
          style="height: 1.5rem; width: 1.5rem"
        >
          <path
            d="M10 6.666l6.667 5.926H3.333L10 6.666z"
            fill="currentColor"
            fill-rule="nonzero"
          ></path></svg
      ></span>
    </div>
  </div>
  <div class="options-container">
    <div class="mask" style="display: none"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.code-hub-list-filter[data-v-51a6e872] {
  position: relative;
}
.code-hub-list-filter .select-container[data-v-51a6e872] {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-family: 'Roboto', 'Microsoft Yahei', 'simsun';
  font-weight: 500;
  overflow-x: hidden;
  background-color: #fafafa;
  color: #353a45;
}
.code-hub-list-filter .select-container .select[data-v-51a6e872] {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-style: solid;
  border-width: 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  font-size: 1rem;
  gap: 4px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1rem;
  width: 25%;
  color: #353a45;
  border-color: #eaecef;
}
.code-hub-list-filter .select-container .select[data-v-51a6e872]:nth-child(1) {
  border-left-width: 0;
}
.code-hub-list-filter .select-container .select[data-v-51a6e872]:nth-last-child(1) {
  border-right-width: 0;
}
.code-hub-list-filter .select-container .select .text[data-v-51a6e872] {
  -webkit-flex-shrink: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: clip;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.code-hub-list-filter .select-container .select .icon[data-v-51a6e872] {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transform-origin: center;
  -ms-transform-origin: center;
  transform-origin: center;
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  transition: -webkit-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  transition:
    transform 0.2s ease-in-out,
    -webkit-transform 0.2s ease-in-out;
  color: #9ca0ab;
}
.code-hub-list-filter .select-container .select.active .icon[data-v-51a6e872] {
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transform: rotate(0deg);
}
.code-hub-list-filter .select-container .select.isInSearch[data-v-51a6e872] {
  color: var(--brand-highlight-text);
  color: var(--brand-quaternary);
}
.code-hub-list-filter .options-container[data-v-51a6e872] {
  position: absolute;
  width: 100%;
  z-index: 1;
}
.code-hub-list-filter .options-container .mask[data-v-51a6e872] {
  height: calc(100vh);
  height: calc(100dvh);
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  width: 100%;
}
.code-hub-list-filter .options-container .mask.mask-bg[data-v-51a6e872] {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

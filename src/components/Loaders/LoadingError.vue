<template>
  <div class="m-loading-wrap">
    <div class="m-loading light">
      <div class="loading-fail">
        <p class="fail-text" data-cms-key="data_failed_loading_tip" data-cms-page="common_feedback">
          Data failed loading. Please reload.
        </p>
        <div class="fail-btn" @click="$router.go(0)">Reload</div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style></style>

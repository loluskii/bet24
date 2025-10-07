<template>
  <div class="dialog-mask" style="background-color: rgba(53, 58, 69, 0.4); z-index: 1000">
    <div class="dialog-wrapper" style="align-items: center; inset: auto">
      <div class="dialog-container">
        <div class="calendar-container">
          <div class="close icon-font-base" @click="$emit('hide')" style="font-size: 1rem"></div>
          <p class="title" data-cms-key="choose_date_range" data-cms-page="page_transaction">
            Choose Date Range
          </p>
          <div class="m-select-option-wrapper"></div>
          <div class="m-select-date-wrapper">
            <div class="m-select-date-container">
              <p data-cms-key="from">From</p>
              <div class="m-select-date">
                <span>{{ formattedStartDate }}</span>
              </div>
            </div>
            <div class="m-select-date-container">
              <p data-cms-key="to">To</p>
              <div class="m-select-date">
                <span>{{ formattedEndDate }}</span>
              </div>
            </div>
          </div>
          <div class="option">
            <div class="date-com">
              <VueDatePicker
                v-model="dateRange"
                range
                :start-date="formattedStartDate"
                :inline="true"
                :enable-time-picker="false"
                :disabled-dates="disableDates"
                @range-start="onRangeStart"
                @range-end="onRangeEnd"
              />
            </div>
          </div>

          <div class="button-wrapper">
            <button class="af-button button-update af-button--primary" @click.prevent="submit">
              <span
                ><span data-cms-key="update" data-cms-page="common_functions">Update</span></span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'

// Reactive property to hold the selected date range
const dateRange = ref('')
const formattedStartDate = ref('')
const formattedEndDate = ref('')
const emit = defineEmits(['set-date', 'hide'])

// Function to disable dates before today
function disableDates(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to midnight to compare only the date
  return date < today
}

const onRangeStart = (value) => {
  formattedStartDate.value = moment(value).format('YYYY-MM-DD')
}

const onRangeEnd = (value) => {
  formattedEndDate.value = moment(value).format('YYYY-MM-DD')
}

const submit = () => {
  emit('set-date', {
    start: formattedStartDate.value,
    end: formattedEndDate.value
  })
}

onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
  dateRange.value = [startDate, endDate]
  formattedStartDate.value = moment(startDate).format('YYYY-MM-DD')
  formattedEndDate.value = moment(endDate).format('YYYY-MM-DD')
})
</script>

<style scoped>
:root {
  --dp-cell-size: 100%;
}

.dp__theme_light {
  --dp-primary-color: var(--brand-secondary);
}

.dialog-mask {
  background-color: #353a45;
  bottom: 0;
  height: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
}
.dialog-mask .dialog-wrapper {
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
  position: relative;
  width: 100%;
}
.dialog-mask .dialog-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  max-height: 100%;
  overflow: auto;
  width: 100%;
  /* width */
  /* Track */
  /* Handle */
  /* Handle on hover */
}
.dialog-mask .dialog-container::-webkit-scrollbar {
  width: 3px;
}
.dialog-mask .dialog-container::-webkit-scrollbar-track {
  background: #f2f3f5;
}
.dialog-mask .dialog-container::-webkit-scrollbar-thumb {
  background: #9ca0ab;
}
.dialog-mask .dialog-container::-webkit-scrollbar-thumb:hover {
  background: #353a45;
}
.fade-enter-active,
.fade-leave-active {
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dp__action_row {
  display: none !important;
}

.container {
  position: relative;
  min-height: 60vh;
}
.container .button-wrapper {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -webkit-flex-direction: row-reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  margin-bottom: 1rem;
}
.container .button-wrapper .button-update {
  margin-left: 0.66666667rem;
}
.container .button-wrapper button {
  margin-top: 0;
  width: 100%;
}

.calendar-container {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #353a45;
  color: var(--text-type1-primary);
  min-height: 70vh;
  max-height: 80vh;
  padding: 0 16px;
  position: absolute;
  z-index: 20;
  width: -webkit-fill-available;
}
.calendar-container.calendar-container-in-pc {
  min-height: auto;
  padding: 0 25px;
}
.calendar-container .close {
  position: absolute;
  right: 1rem;
  top: 0.66666667rem;
}
.calendar-container .right {
  position: relative;
  right: 107%;
}
.calendar-container .right .date-bottom {
  left: 6.66666667rem;
  position: relative;
}
.calendar-container .title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 1rem;
  padding-top: 1.75rem;
  text-align: center;
}
.calendar-container .from-to-wrapper {
  margin-bottom: 0.66666667rem;
  margin-top: 2.33333333rem;
}
.calendar-container .from-to {
  font-size: 1.066rem;
}
.calendar-container .to {
  left: 0.66666667rem;
  position: relative;
}
.calendar-container .notice {
  color: #e41827;
  color: var(--warning-primary);
}
.calendar-container .error-info {
  color: #e41827;
  color: var(--warning-primary);
  text-align: center;
}
.calendar-container .button-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
.calendar-container .button-wrapper .button-update {
  border-radius: 2px;
  font-weight: bold;
  height: 4rem;
}

.calendar-container .button-wrapper.button-wrapper-pc {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -webkit-flex-direction: row-reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 32px 0;
}
.calendar-container .button-wrapper.button-wrapper-pc > .button-update {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 45%;
  -ms-flex: 0 1 45%;
  flex: 0 1 45%;
  height: 3rem;
}
.calendar-container .button-wrapper.button-wrapper-pc > .button-back {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 45%;
  -ms-flex: 0 1 45%;
  flex: 0 1 45%;
  height: 3rem;
  margin: 0;
}
.calendar-container .announcement-wrapper {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  text-align: center;
  margin-top: 1.33333333rem;
}
.calendar-container .announcement-wrapper .text-customer-service {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  text-decoration: none;
}
.calendar-container .m-select-option-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  margin-bottom: 16px;
  position: relative;
}
.calendar-container .m-select-option-wrapper .m-select-option {
  background-color: #dcdee5;
  background-color: var(--disable-brand-secondary);
  color: #353a45;
  color: var(--text-type1-primary);
  cursor: pointer;
  -webkit-box-flex: 100%;
  -webkit-flex: 100%;
  -ms-flex: 100%;
  flex: 100%;
  margin-right: 12px;
  padding: 8px 8px;
  text-align: center;
}
.calendar-container .m-select-option-wrapper .m-select-option:last-child {
  margin: 0;
}
.calendar-container .m-select-option-wrapper .m-select-option.isActive {
  background-color: #353a45;
  background-color: var(--line-type1-tertiary);
  color: #ffffff;
  color: var(--absolute-type1);
}
.calendar-container .calendar-feature-notice {
  left: 1rem;
  left: 0;
  position: absolute;
  top: 3.2rem;
  width: 271px;
  z-index: 20;
}
.calendar-container .m-select-date-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
}
.calendar-container .m-select-date-wrapper .m-select-date-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 14px;
  margin-right: 10px;
}
.calendar-container .m-select-date-wrapper .m-select-date-container:last-child {
  margin: 0;
}
.calendar-container .m-select-date {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: solid 1px #eaecef;
  border-radius: 2px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 0.91666667rem;
  padding: 8px 16px;
  border-color: #eaecef;
}
.calendar-container .m-select-date .select-index,
.calendar-container .m-select-date .subtract-date,
.calendar-container .m-select-date .add-date {
  cursor: pointer;
  display: inline-block;
  font-size: 1.066rem;
  line-height: 4rem;
  width: 9.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.calendar-container .m-select-date .select-index.empty,
.calendar-container .m-select-date .subtract-date.empty,
.calendar-container .m-select-date .add-date.empty {
  opacity: 0.4;
}
.calendar-container .m-select-date .select-index.disable,
.calendar-container .m-select-date .subtract-date.disable,
.calendar-container .m-select-date .add-date.disable {
  background-color: #dcdee5;
  background-color: var(--disable-brand-secondary);
  color: rgba(156, 160, 171, 0.5);
  opacity: 1;
}
.calendar-container .m-select-date .subtract-date,
.calendar-container .m-select-date .add-date {
  display: inline-block;
  margin: 0;
  width: 20%;
}
.calendar-container .m-select-date .subtract-date::before,
.calendar-container .m-select-date .add-date::before {
  content: '\e604';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.calendar-container .m-select-date .add-date::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.calendar-container .option .date-com {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border-radius: 2px;
  padding-top: 0.83333333rem;
}
.calendar-container .option .date-com .date-bottom {
  height: 4.33333333rem;
  left: 50%;
  position: relative;
}
.calendar-container .option .date-com .date-bottom span {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  display: inline-block;
  font-size: 1.066rem;
  line-height: 3.33333333rem;
  margin-right: 10px;
  padding: 0 0.75rem;
}
.calendar-container .option .date-com .date-bottom span.unchange {
  color: #dcdee5;
  color: var(--disable-brand-secondary);
}
.calendar-container .option .vdp-datepicker {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: #353a45;
  color: var(--text-type1-primary);
}
.calendar-container .active {
  border: 1px solid var(--brand-highlight-text);
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
}
</style>

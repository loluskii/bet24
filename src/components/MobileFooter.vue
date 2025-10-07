<template>
  <div class="m-bottom-nav">
    <!-- <div class="switch-theme">
      <img src="/cog.gif" style="height: 30px" alt="" srcset="" />
    </div> -->
    <div
      v-show="utilsStore.showBetslipCount"
      @click="showBetslip"
      class="betslip-float-wrapper"
      :class="betslipMode ? 'sim-theme' : 'real-theme'"
    >
      <!-- <div class="bg"></div> -->
      <div class="count-wrapper">
        <span class="count" v-if="betType !== 'Split'">{{ betslipCount > 0 ? totalOdds : 0 }}</span>
        <span v-if="betType === 'Split'" style="display: flex; align-items: center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label=""
            class="kz-icon-s icon--color-white-snow"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#FFF"
              fill-rule="evenodd"
              d="M18 12.9H6V11.479H18V12.9ZM18 16.4526C18 16.845 17.6819 17.1632 17.2895 17.1632H14.2105C13.8181 17.1632 13.5 16.845 13.5 16.4526C13.5 16.0602 13.8181 15.7421 14.2105 15.7421H17.2895C17.6819 15.7421 18 16.0602 18 16.4526ZM18 10.1053H6V8.68421H18V10.1053ZM18 7.26316H6V5.84211H18V7.26316ZM3 21L4.5 19.5789L6 21L7.5 19.5789L9 21L10.5 19.5789L12 21L13.5 19.5789L15 21L16.5 19.5789L18 21L19.5 19.5789L21 21V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V21Z"
              clip-rule="evenodd"
            ></path>
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#FFF"
              fill-rule="evenodd"
              d="M18 12.9H6V11.479H18V12.9ZM18 16.4526C18 16.845 17.6819 17.1632 17.2895 17.1632H14.2105C13.8181 17.1632 13.5 16.845 13.5 16.4526C13.5 16.0602 13.8181 15.7421 14.2105 15.7421H17.2895C17.6819 15.7421 18 16.0602 18 16.4526ZM18 10.1053H6V8.68421H18V10.1053ZM18 7.26316H6V5.84211H18V7.26316ZM3 21L4.5 19.5789L6 21L7.5 19.5789L9 21L10.5 19.5789L12 21L13.5 19.5789L15 21L16.5 19.5789L18 21L19.5 19.5789L21 21V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V21Z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
        <span
          class="betslip"
          style="font-size: 1rem"
          :style="betslipMode ? 'color: #000;' : 'color: #fff'"
          >BETSLIP</span
        >
      </div>
      <div v-if="betslipCount > 0" class="notification">{{ betslipCount }}</div>
    </div>
    <div v-if="utilsStore.showMobileNavigation" class="m-bottom-fixed">
      <template v-if="!routeIsCasino">
        <div class="m-btn-button">
          <router-link :to="{ name: 'home' }">
            <section>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="icon"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path
                  d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                />
              </svg>
            </section>
            <span class="label">Home</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'az_menu' }">
            <section>
              <svg
                width="26"
                height="23"
                viewBox="0 0 26 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
              >
                <path d="M0 23H26V18.4H0V23ZM0 0V4.6H26V0H0ZM0 13.8H26V9.2H0V13.8Z" />
              </svg>
            </section>
            <span class="label">AZ Menu</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'casino-games' }">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
            >
              <path
                d="M6.15625 20.5208C6.72627 20.5208 7.21102 20.3216 7.61049 19.923C8.00997 19.5244 8.20925 19.0397 8.20833 18.4688C8.20742 17.8978 8.00814 17.4135 7.61049 17.0159C7.21284 16.6182 6.7281 16.4185 6.15625 16.4167C5.5844 16.4148 5.10011 16.6146 4.70338 17.0159C4.30664 17.4172 4.1069 17.9015 4.10417 18.4688C4.10143 19.036 4.30117 19.5208 4.70338 19.923C5.10558 20.3252 5.58988 20.5245 6.15625 20.5208ZM6.15625 8.20833C6.72627 8.20833 7.21102 8.00905 7.61049 7.61049C8.00997 7.21193 8.20925 6.72719 8.20833 6.15625C8.20742 5.58532 8.00814 5.10102 7.61049 4.70338C7.21284 4.30573 6.7281 4.10599 6.15625 4.10417C5.5844 4.10234 5.10011 4.30208 4.70338 4.70338C4.30664 5.10467 4.1069 5.58896 4.10417 6.15625C4.10143 6.72354 4.30117 7.20828 4.70338 7.61049C5.10558 8.0127 5.58988 8.21198 6.15625 8.20833ZM12.3125 14.3646C12.8825 14.3646 13.3673 14.1653 13.7667 13.7667C14.1662 13.3682 14.3655 12.8834 14.3646 12.3125C14.3637 11.7416 14.1644 11.2573 13.7667 10.8596C13.3691 10.462 12.8843 10.2622 12.3125 10.2604C11.7407 10.2586 11.2564 10.4583 10.8596 10.8596C10.4629 11.2609 10.2632 11.7452 10.2604 12.3125C10.2577 12.8798 10.4574 13.3645 10.8596 13.7667C11.2618 14.169 11.7461 14.3682 12.3125 14.3646ZM18.4688 20.5208C19.0388 20.5208 19.5235 20.3216 19.923 19.923C20.3225 19.5244 20.5217 19.0397 20.5208 18.4688C20.5199 17.8978 20.3206 17.4135 19.923 17.0159C19.5253 16.6182 19.0406 16.4185 18.4688 16.4167C17.8969 16.4148 17.4126 16.6146 17.0159 17.0159C16.6191 17.4172 16.4194 17.9015 16.4167 18.4688C16.4139 19.036 16.6137 19.5208 17.0159 19.923C17.4181 20.3252 17.9024 20.5245 18.4688 20.5208ZM18.4688 8.20833C19.0388 8.20833 19.5235 8.00905 19.923 7.61049C20.3225 7.21193 20.5217 6.72719 20.5208 6.15625C20.5199 5.58532 20.3206 5.10102 19.923 4.70338C19.5253 4.30573 19.0406 4.10599 18.4688 4.10417C17.8969 4.10234 17.4126 4.30208 17.0159 4.70338C16.6191 5.10467 16.4194 5.58896 16.4167 6.15625C16.4139 6.72354 16.6137 7.20828 17.0159 7.61049C17.4181 8.0127 17.9024 8.21198 18.4688 8.20833ZM2.73611 24.625C1.98368 24.625 1.33978 24.3573 0.804417 23.822C0.269051 23.2866 0.000912037 22.6422 0 21.8889V2.73611C0 1.98368 0.268139 1.33978 0.804417 0.804417C1.34069 0.269051 1.98459 0.000912037 2.73611 0H21.8889C22.6413 0 23.2857 0.268139 23.822 0.804417C24.3582 1.34069 24.6259 1.98459 24.625 2.73611V21.8889C24.625 22.6413 24.3573 23.2857 23.822 23.822C23.2866 24.3582 22.6422 24.6259 21.8889 24.625H2.73611Z"
              />
            </svg>
            <span class="label" data-cms-key="games">Casino</span>
          </router-link>
        </div>
        <div class="m-btn-button active">
          <router-link :to="{ name: 'open-bets' }">
            <span v-if="props.openBetCount > 0" class="open-bets">{{ props.openBetCount }}</span>
            <section>
              <svg
                width="28"
                height="27"
                viewBox="0 0 28 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
              >
                <path
                  d="M23.7787 17.4724C24.6435 15.417 24.8425 13.1422 24.3476 10.9679C23.8528 8.79348 22.689 6.82885 21.0198 5.3501C19.3507 3.87134 17.2601 2.95283 15.0419 2.72366C12.8238 2.49449 10.5896 2.96619 8.65333 4.07245L7.32933 1.75645C9.3529 0.600249 11.6442 -0.00534523 13.9748 3.5546e-05C16.3053 0.00541632 18.5938 0.621584 20.612 1.78711C26.5987 5.24445 28.892 12.6444 26.1027 18.8138L27.892 19.8471L22.3373 22.7991L22.1173 16.5138L23.7787 17.4724ZM4.112 9.19778C3.24686 11.2534 3.04771 13.5284 3.54256 15.7031C4.0374 17.8777 5.20135 19.8426 6.87076 21.3214C8.54018 22.8003 10.6311 23.7188 12.8496 23.9477C15.068 24.1766 17.3024 23.7045 19.2387 22.5978L20.5613 24.9138C18.5376 26.0698 16.2463 26.6751 13.9157 26.6695C11.5852 26.6639 9.29676 26.0475 7.27867 24.8818C1.292 21.4244 -1.00133 14.0258 1.78933 7.85511L0 6.82445L5.55333 3.87111L5.77333 10.1564L4.112 9.19778ZM9.27867 16.0018H16.612C16.7888 16.0018 16.9584 15.9315 17.0834 15.8065C17.2084 15.6815 17.2787 15.5119 17.2787 15.3351C17.2787 15.1583 17.2084 14.9887 17.0834 14.8637C16.9584 14.7387 16.7888 14.6684 16.612 14.6684H11.2787C10.3946 14.6684 9.54676 14.3173 8.92164 13.6921C8.29652 13.067 7.94533 12.2192 7.94533 11.3351C7.94533 10.4511 8.29652 9.60321 8.92164 8.97809C9.54676 8.35297 10.3946 8.00178 11.2787 8.00178H12.612V6.66845H15.2787V8.00178H18.612V10.6684H11.2787C11.1019 10.6684 10.9323 10.7387 10.8073 10.8637C10.6822 10.9887 10.612 11.1583 10.612 11.3351C10.612 11.5119 10.6822 11.6815 10.8073 11.8065C10.9323 11.9315 11.1019 12.0018 11.2787 12.0018H16.612C17.4961 12.0018 18.3439 12.353 18.969 12.9781C19.5941 13.6032 19.9453 14.4511 19.9453 15.3351C19.9453 16.2192 19.5941 17.067 18.969 17.6921C18.3439 18.3173 17.4961 18.6684 16.612 18.6684H15.2787V20.0018H12.612V18.6684H9.27867V16.0018Z"
                />
              </svg>
            </section>
            <span class="label">Open Bets</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'account-me' }">
            <section>
              <svg
                width="23"
                height="25"
                viewBox="0 0 23 25"
                fill="none"
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2771 11.6783C14.1566 11.6783 16.6343 9.10686 16.6343 5.75829C16.6343 2.45086 14.1429 0 11.2771 0C8.41086 0 5.92 2.50457 5.92 5.78571C5.92 9.10686 8.41143 11.6783 11.2771 11.6783ZM2.86629 24.08H19.688C21.7909 24.08 22.5406 23.4777 22.5406 22.2989C22.5406 18.8434 18.2149 14.076 11.2771 14.076C4.32629 14.076 0 18.8434 0 22.2989C0 23.4777 0.750286 24.08 2.86629 24.08Z"
                />
              </svg>
            </section>
            <span class="label">Me</span>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="m-btn-button">
          <router-link :to="{ name: 'casino-games' }">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
            >
              <path
                d="M6.15625 20.5208C6.72627 20.5208 7.21102 20.3216 7.61049 19.923C8.00997 19.5244 8.20925 19.0397 8.20833 18.4688C8.20742 17.8978 8.00814 17.4135 7.61049 17.0159C7.21284 16.6182 6.7281 16.4185 6.15625 16.4167C5.5844 16.4148 5.10011 16.6146 4.70338 17.0159C4.30664 17.4172 4.1069 17.9015 4.10417 18.4688C4.10143 19.036 4.30117 19.5208 4.70338 19.923C5.10558 20.3252 5.58988 20.5245 6.15625 20.5208ZM6.15625 8.20833C6.72627 8.20833 7.21102 8.00905 7.61049 7.61049C8.00997 7.21193 8.20925 6.72719 8.20833 6.15625C8.20742 5.58532 8.00814 5.10102 7.61049 4.70338C7.21284 4.30573 6.7281 4.10599 6.15625 4.10417C5.5844 4.10234 5.10011 4.30208 4.70338 4.70338C4.30664 5.10467 4.1069 5.58896 4.10417 6.15625C4.10143 6.72354 4.30117 7.20828 4.70338 7.61049C5.10558 8.0127 5.58988 8.21198 6.15625 8.20833ZM12.3125 14.3646C12.8825 14.3646 13.3673 14.1653 13.7667 13.7667C14.1662 13.3682 14.3655 12.8834 14.3646 12.3125C14.3637 11.7416 14.1644 11.2573 13.7667 10.8596C13.3691 10.462 12.8843 10.2622 12.3125 10.2604C11.7407 10.2586 11.2564 10.4583 10.8596 10.8596C10.4629 11.2609 10.2632 11.7452 10.2604 12.3125C10.2577 12.8798 10.4574 13.3645 10.8596 13.7667C11.2618 14.169 11.7461 14.3682 12.3125 14.3646ZM18.4688 20.5208C19.0388 20.5208 19.5235 20.3216 19.923 19.923C20.3225 19.5244 20.5217 19.0397 20.5208 18.4688C20.5199 17.8978 20.3206 17.4135 19.923 17.0159C19.5253 16.6182 19.0406 16.4185 18.4688 16.4167C17.8969 16.4148 17.4126 16.6146 17.0159 17.0159C16.6191 17.4172 16.4194 17.9015 16.4167 18.4688C16.4139 19.036 16.6137 19.5208 17.0159 19.923C17.4181 20.3252 17.9024 20.5245 18.4688 20.5208ZM18.4688 8.20833C19.0388 8.20833 19.5235 8.00905 19.923 7.61049C20.3225 7.21193 20.5217 6.72719 20.5208 6.15625C20.5199 5.58532 20.3206 5.10102 19.923 4.70338C19.5253 4.30573 19.0406 4.10599 18.4688 4.10417C17.8969 4.10234 17.4126 4.30208 17.0159 4.70338C16.6191 5.10467 16.4194 5.58896 16.4167 6.15625C16.4139 6.72354 16.6137 7.20828 17.0159 7.61049C17.4181 8.0127 17.9024 8.21198 18.4688 8.20833ZM2.73611 24.625C1.98368 24.625 1.33978 24.3573 0.804417 23.822C0.269051 23.2866 0.000912037 22.6422 0 21.8889V2.73611C0 1.98368 0.268139 1.33978 0.804417 0.804417C1.34069 0.269051 1.98459 0.000912037 2.73611 0H21.8889C22.6413 0 23.2857 0.268139 23.822 0.804417C24.3582 1.34069 24.6259 1.98459 24.625 2.73611V21.8889C24.625 22.6413 24.3573 23.2857 23.822 23.822C23.2866 24.3582 22.6422 24.6259 21.8889 24.625H2.73611Z"
              />
            </svg>
            <span class="label" data-cms-key="games">Home</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'casino-providers' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              stroke="#626262"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-gem icon providers"
            >
              <path d="M6 3h12l4 6-10 13L2 9Z" />
              <path d="M11 3 8 9l4 13 4-13-3-6" />
              <path d="M2 9h20" />
            </svg>
            <span class="label" data-cms-key="games">Providers</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'casino-search' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              stroke="#626262"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-scan-search icon providers"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
              <path d="m16 16-1.9-1.9" />
            </svg>
            <span class="label" data-cms-key="games">Search</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'casino-category' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#626262"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-component icon category"
            >
              <path
                d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"
              />
              <path
                d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"
              />
              <path
                d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"
              />
              <path
                d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"
              />
            </svg>
            <span class="label" data-cms-key="games">Categories</span>
          </router-link>
        </div>
        <div class="m-btn-button">
          <router-link :to="{ name: 'home' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c6c6c"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-circle-x"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <span class="label" data-cms-key="games">Exit Casino</span>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { useUtilsStore, useCouponStore } from '@/stores'
import { computed } from 'vue'
import { formatTotalOdds } from '@/helpers'
import { useRoute } from 'vue-router'

const props = defineProps({
  openBetCount: Number
})

const utilsStore = useUtilsStore()
const couponStore = useCouponStore()
const route = useRoute()

const betslipCount = computed(() => {
  return couponStore.coupon.selections.length
})

const betslipMode = computed(() => {
  return couponStore.betslipMode
})

const totalOdds = computed(() => {
  return formatTotalOdds(couponStore.coupon.totalOdds)
})

const emit = defineEmits(['show-betslip'])
const betType = computed(() => {
  return couponStore.coupon.bet_type
})

function showBetslip() {
  return emit('show-betslip')
}

const routeIsCasino = computed(() => {
  let route_names = [
    'casino-games',
    'casino-search',
    'games-by-category',
    'casino-providers',
    'casino-category',
    'games-by-provider',
    'casino-bonus'
  ]
  return route_names.includes(route.name)
})
</script>
<style scoped>
.bottomNav-icon,
a {
  fill: #9ca0ab;
  /* color: #9ca0ab !important; */
}

.bottomNav-icon.active {
  fill: #9ca0ab;
  /* color: #9ca0ab !important; */
}

.bottomNav-svg {
  padding-bottom: 4px;
}

.m-bottom-nav {
  font-family: Roboto;
}

.m-bottom-nav .m-fast-betslip-wrap {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  bottom: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 223;
}

.m-bottom-nav .m-fast-betslip-wrap > * {
  background-color: #ffffff;
  background-color: var(--c-betslip-quickbet-bg);
  -webkit-box-shadow: 0 -0.16666667rem 0.5rem 0 rgba(27, 30, 37, 0.3);
  box-shadow: 0 -0.16666667rem 0.5rem 0 rgba(27, 30, 37, 0.3);
  position: relative;
  width: 100%;
}

.m-bottom-nav .m-bottom-fixed {
  background-color: var(--background-type1-primary);
  padding-top: 10px;
  padding-bottom: 10px;
  bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 200;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 1rem;
  height: 40px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0 1.25rem;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: 20%;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button a {
  display: flex;
  justify-content: center;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button .open-bets {
  background-color: #ffffff;
  border-radius: 10px;
  color: #000000;
  display: inline-block;
  left: 63%;
  line-height: 1.5;
  min-width: 1.5rem;
  position: absolute;
  top: -4px;
  font-size: 10px;
  vertical-align: middle;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button svg {
  height: 22px;
  margin-bottom: 20px;
  width: 22px;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button svg.icon {
  fill: #6c6c6c;
  /* color: #6c6c6c; */
}

.m-bottom-nav .m-bottom-fixed .m-btn-button svg.icon.providers,
.m-bottom-nav .m-bottom-fixed .m-btn-button svg.icon.category {
  stroke: #6c6c6c;
  fill: none;
  /* color: #6c6c6c; */
}

.m-bottom-nav .m-bottom-fixed .m-btn-button a.x-active svg.icon {
  fill: var(--brand-secondary);
}

.m-bottom-nav .m-bottom-fixed .m-btn-button a.x-active svg.icon.providers,
.m-bottom-nav .m-bottom-fixed .m-btn-button a.x-active svg.icon.category {
  stroke: var(--brand-secondary);
  fill: none;
}

.m-bottom-nav .m-bottom-fixed .m-btn-button .label {
  bottom: 0;
  color: #6c6c6c;
  font-size: 12px;
  position: absolute;
  -webkit-transform: scale(0.75);
  -ms-transform: scale(0.75);
  transform: scale(0.75);
}

.m-bottom-nav .m-bottom-fixed .m-btn-button a.x-active .label {
  color: #fff;
}

.m-bottom-nav .betslip-float-wrapper,
.m-bottom-nav .switch-theme {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  bottom: 5rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 3.75rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: relative;
  position: fixed;
  right: 4px;
  width: 3.75rem;
  z-index: 219;
}

.m-bottom-nav .switch-theme {
  bottom: 15rem;
  right: 0px;
  background-color: #e41827;
  border-bottom-left-radius: 0.41666667rem;
  border-top-left-radius: 0.41666667rem;
}

.m-bottom-nav .betslip-float-wrapper .bg {
  background-color: #ffffff;
  background-color: var(--c-betslip-float-bg);
  border-bottom-left-radius: 0.41666667rem;
  border-top-left-radius: 0.41666667rem;
  height: 100%;
  opacity: 80%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.m-bottom-nav .betslip-float-wrapper .count-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #e41827;
  background-color: var(--warning-primary);
  border-radius: 5px;
  color: #ffffff;
  color: var(--brand-tertiary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-weight: bold;
  height: 45px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  flex-direction: column;
  /* margin-top: 0.33333333rem; */
  width: 45px;
  font-size: 1rem;
  z-index: 2;
}

.notification {
  background: var(--brand-secondary);
  border-radius: 100%;
  /* display: inline-block; */
  color: #fff;
  font-weight: 700;
  /* padding: 0 2px; */
  text-align: center;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 0.64286rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* line-height: 12px; */
  /* padding: 2px; */
  z-index: 5;
  width: 16px;
  height: 16px;
}

.betslip-float-wrapper .notification {
  position: absolute;
  top: -2px;
  right: -2px;
}

.m-bottom-nav .betslip-float-wrapper .betslip {
  color: #1b1e25;
  color: var(--c-betslip-float-text);
  font-size: 1rem;
  font-weight: 500;
  -webkit-transform: scale(0.75);
  -ms-transform: scale(0.75);
  transform: scale(0.75);
  z-index: 2;
}

.m-bottom-nav .real-theme .count-wrapper {
  background-color: var(--brand-primary);
  color: #ffffff;
}

.m-bottom-nav .sim-theme .count-wrapper {
  background-color: var(--sim-primary);
  color: #1b1e25;
  color: var(--background-type2-primary);
}

.m-bottom-nav .slide-enter-active,
.m-bottom-nav .slide-leave-active {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.m-bottom-nav .slide-enter,
.m-bottom-nav .slide-leave-to {
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
}

.m-bottom-nav .m-bet-count {
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
}

.m-bottom-nav .m-anime-scale {
  -webkit-transform: scale(1.4);
  -ms-transform: scale(1.4);
  transform: scale(1.4);
}
</style>

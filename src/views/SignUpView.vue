<template>
  <div id="popupLogin" style="height: 100%">
    <div class="register-and-login">
      <div id="enterMobile" class="page-container page-fixed">
        <div class="change-region-wrap">
          <span @click="$router.push({ name: 'home' })" class="close"></span>
        </div>
        <div class="enter-mobile-container" v-if="activeStep === 1">
          <form>
            <div class="enter-mobile-label">
              <p>Join {{ brandName }} with your mobile number</p>
            </div>
            <div
              class="verifyInputs mb-4 m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
              :class="registerError ? 'm-input-wap-wrapper--error' : ''"
            >
              <div class="m-input-wap-prepend m-input-wap-prepend--default">
                <div>+{{ SportsbookGlobalVariable.dialCode }}</div>
              </div>
              <i
                @click="clear"
                v-if="formData.phone_no != ''"
                class="m-input-wap-icon m-input-wap-icon--clickable m-input-wap-icon--show m-icon-delete"
              ></i>
              <input
                type="number"
                v-model="formData.phone_no"
                placeholder="Mobile Number"
                maxlength="11"
                @blur="validateUsername($event)"
                class="m-input-wap fs-exclude data-hj-suppress"
              />
            </div>
            <div class="verifyInputs mb-4 m-input-wap-wrapper">
              <input
                type="password"
                v-model="formData.password"
                placeholder="Password"
                class="m-input-wap fs-exclude data-hj-suppress"
              />
            </div>
            <div class="verifyInputs m-input-wap-wrapper">
              <input
                type="text"
                v-model="formData.promoCode"
                placeholder="Promo code (optional)"
                class="m-input-wap fs-exclude data-hj-suppress"
              />
            </div>
            <div v-if="registerError" class="error-message">
              <p>
                {{ registerErrorMessage }}
              </p>
            </div>
            <button
              :class="!formData.phone_no || !formData.password || isLoading ? 'is-disabled' : ''"
              class="af-button enter-mobile-btn af-button--primary"
              type="button"
              @disabled="!formData.phone_no || !formData.password || isLoading"
              @click.prevent="registerUser"
            >
              <span v-if="!isLoading"> Continue </span>
              <span v-else> Loading... </span>
            </button>
          </form>
          <div class="action-label" @click="toLogin">Already have an account? Log In</div>
        </div>
        <div v-else class="enter-mobile-container">
          <form>
            <div class="enter-mobile-label">
              <p>Verify Your Number</p>
              <span style="font-size: 15px; font-weight: 400"
                >We've sent you a 6-digit code to +234 {{ formData.phone_no }}</span
              >
            </div>
            <div id="verify-otp-container" class="text-center">
              <div class="m-pin-code-wrapper mg-b-16">
                <form>
                  <v-otp-input
                    ref="otpInput"
                    v-model:value="bindModal"
                    input-classes="m-pin-code-input fs-exclude"
                    separator="  "
                    :num-inputs="6"
                    :should-auto-focus="true"
                    input-type="number"
                    :placeholder="['*', '*', '*', '*', '*', '*']"
                    @on-complete="storeOTP"
                  />
                </form>
              </div>
              <div style="position: relative">
                <span
                  class="grey pointer"
                  :class="{ disabled: isDisabled }"
                  @click="resendOtp"
                  :disabled="isDisabled"
                  :style="{
                    fontWeight: 'bold',
                    color: isDisabled ? '#aaa' : ''
                  }"
                >
                  {{ isDisabled ? `Send Again in ${remainingTime}s` : 'Send Again' }} </span
                >&nbsp;
              </div>
            </div>
            <div v-if="registerError" class="error-message" style="text-align: center">
              <p>
                {{ registerErrorMessage }}
              </p>
            </div>
            <button
              :class="isLoading ? 'is-disabled' : ''"
              class="af-button enter-mobile-btn af-button--primary"
              type="button"
              @disabled="isLoading"
              @click.prevent="verifyOTPRequest"
            >
              <span v-if="!isLoading"> Continue </span>
              <span v-else> Please wait... </span>
            </button>
          </form>
          <div class="action-label" @click="restartProcess">Go Back</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Import ref from Vue 3
import { useRouter, useRoute } from 'vue-router'
import {
  CLIENT_ID,
  formattedPhoneNumber,
  sendOTP,
  verifyUsername,
  register,
  verifyOTP
} from '../helpers'
import { useAuthStore, useUtilsStore } from '../stores'
import Cookies from 'js-cookie'

// Use ref for reactive data properties
const authStore = useAuthStore()
const { brandName, SportsbookGlobalVariable } = useUtilsStore()
const utilsStore = useUtilsStore()
const formData = ref({
  phone_no: null,
  password: null,
  promoCode: null
})
// const showPassword = ref(false)
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const registerError = ref(false)
const registerErrorMessage = ref('')
const activeStep = ref(1)
const OTP = ref('')
const isDisabled = ref(false)
const remainingTime = ref(60)
let timer

// Define methods using the Composition API
const clear = () => {
  formData.value.phone_no = null
}

const startTimer = () => {
  isDisabled.value = true
  remainingTime.value = 60

  if (timer) clearInterval(timer) // Clear any existing timer

  timer = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value === 0) {
      clearInterval(timer)
      isDisabled.value = false
    }
  }, 1000)
}

const registerUser = async () => {
  if (String(formData.value.phone_no).trim().length < 9) {
    registerError.value = true
    registerErrorMessage.value = 'Please enter a valid phone number'
    return
  }
  isLoading.value = true
  let phoneNumber = String(formData.value.phone_no).trim().replace(/^0/, '')
  const internationalNumber = `234${phoneNumber}`
  let payload = {
    clientID: CLIENT_ID,
    phoneNumber: internationalNumber
  }

  await doRegistration()

  // const res = await sendOTP(payload);
  // isLoading.value = false;

  // if (res.data.status) {
  //   activeStep.value = 2;
  //   startTimer();
  // } else {
  //   registerError.value = true;
  //   registerErrorMessage.value = res.data.message;
  // }
}

const resendOtp = async () => {
  if (!isDisabled.value && remainingTime.value === 0) {
    let phoneNumber = String(formData.value.phone_no).replace(/^0/, '')
    const internationalNumber = `234${phoneNumber}`
    let payload = {
      clientID: CLIENT_ID,
      phoneNumber: internationalNumber
    }

    const res = await sendOTP(payload)
    if (res.data.status) {
      startTimer()
    }
  }
}

const storeOTP = async (data) => {
  OTP.value = data
}

const verifyOTPRequest = async () => {
  isLoading.value = true
  let phoneNumber = formattedPhoneNumber(formData.value.phone_no)
  const internationalNumber = `234${phoneNumber}`
  let payload = {
    clientID: CLIENT_ID,
    phoneNumber: internationalNumber,
    code: OTP.value
  }

  const res = await verifyOTP(payload)
  if (res.data.status) {
    await doRegistration()
  } else {
    isLoading.value = false
    registerError.value = true
    registerErrorMessage.value = res.data.message
  }
}

const doRegistration = async () => {
  isLoading.value = true
  registerError.value = false
  registerErrorMessage.value = ''
  let phoneNumber = formattedPhoneNumber(formData.value.phone_no)
  const internationalNumber = `234${phoneNumber}`

  const payload = {
    username: phoneNumber,
    password: formData.value.password,
    phone: internationalNumber,
    clientId: CLIENT_ID,
    promoCode: formData.value.promoCode
  }

  // Get trackingToken from cookie
  const trackingToken = Cookies.get('clickId')
  if (trackingToken) {
    payload.trackingToken = trackingToken
  }

  try {
    const res = await register(payload)
    utilsStore.clickId = null
    if (res.data.success) {
      await authStore.doLogin(payload)
      isLoading.value = false
      // Optionally clear the cookie after registration
      Cookies.remove('clickId')
    } else {
      isLoading.value = false
      registerError.value = true
      registerErrorMessage.value = 'Something went wrong, process your request.'
    }
  } catch (error) {
    isLoading.value = false
    registerError.value = true
    registerErrorMessage.value = error.message
  }
}

const restartProcess = () => {
  activeStep.value = 1
  formData.value.phone_no = null
  formData.value.password = null
  registerError.value = false
  registerErrorMessage.value = ''
}

const validateUsername = async (e) => {
  const username = formattedPhoneNumber(e.target.value)
  await verifyUsername({
    username,
    clientId: CLIENT_ID
  }).then((res) => {
    if (res.responseMessage === 'SUCCESSFUL') {
      registerError.value = true
      registerErrorMessage.value = 'Phone number already registered'
    } else {
      registerError.value = false
      registerErrorMessage.value = ''
    }
  })
}
const toLogin = () => {
  // Access router through the `router` property of the `this.$route` object
  return router.push({ name: 'sign-in' })
}

onMounted(() => {
  if (route.query.clickid || route.query.token) {
    Cookies.set('clickId', route.query.clickid || route.query.token)
  }
})
</script>

<style>
.register-and-login {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  display: block;
  height: 100%;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
}

.register-and-login .head-container {
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
}

.register-and-login .warn-label {
  background-color: #e41827;
  background-color: var(--warning-primary);
  color: #ffffff;
  font-size: 0.83333333rem;
  height: 2.16666667rem;
  line-height: 2.16666667rem;
  text-align: center;
  width: 100%;
}

.register-and-login .page-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
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
  height: 100%;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  padding: 8.91666667rem 2.5rem 1.66666667rem;
  width: 100%;
}

.register-and-login .page-container.page-fixed {
  padding: 1.66666667rem 0 1.66666667rem;
}

.enter-mobile.es-dialog .es-dialog-footer .es-dialog-btn {
  border-top: 1px solid #d4d4d4;
  width: 100%;
}

#enterMobile .enter-mobile-top-banner {
  margin-top: -1.66666667rem;
  width: 100%;
}

#enterMobile .enter-mobile-top-banner img {
  width: 100%;
}

#enterMobile .change-region-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.33333333rem;
  line-height: 1.5rem;
  padding: 0rem 1.25rem 0 2.5rem;
  width: 100%;
}

#enterMobile .change-region-wrap .m-icon-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#enterMobile .change-region-wrap .m-icon-right::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}

#enterMobile .change-region-wrap .close {
  float: right;
}

#enterMobile .change-region-wrap .close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#enterMobile .change-region-wrap .close:before {
  font-size: 1.25rem;
}

#enterMobile .enter-mobile-container {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
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
  padding: 5.41666667rem 2.5rem 0;
  width: 100%;
}

#enterMobile .enter-mobile-container form {
  width: 100%;
}

#enterMobile .enter-mobile-container form .progress-container {
  height: 62px;
}

#enterMobile .enter-mobile-container .enter-mobile-label {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.66666667rem;
  font-weight: bold;
  line-height: 2rem;
  margin-bottom: 2rem;
  margin-top: 0.83333333rem;
  text-align: center;
  width: 100%;
}

#enterMobile .enter-mobile-container .m-input-wap-wrapper--active {
  border: 1px solid var(--brand-highlight-text);
}

#enterMobile .enter-mobile-container .verifyInputs {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 4rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}
#enterMobile .enter-mobile-container .verifyInputs .m-loading-circle-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

#enterMobile .enter-mobile-container .verifyInputs input {
  height: 100%;
  padding: 1.41666667rem 10px;
}

#enterMobile .enter-mobile-container .error-message {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 1rem;
  line-height: 1.67;
  margin-top: 0.08333333rem;
  min-height: 1.66666667rem;
  text-align: left;
  width: 100%;
}

#enterMobile .enter-mobile-container .error-message .err-login-btn {
  color: #3656a3;
}

#enterMobile .enter-mobile-container .enter-mobile-btn {
  background-color: var(--brand-secondary);
  color: white;
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 3.95833333rem;
  margin-top: 1.91666667rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}

#enterMobile .enter-mobile-container .action-label {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 1.066rem;
  margin-top: 1.75rem;
  text-align: center;
  width: 100%;
}

#enterMobile .mobile-warning-info {
  font-size: 12px;
  font-weight: bold;
  padding: 5px;
}

.wap-register.es-dialog .es-dialog-head h1 {
  font-size: 1.66666667rem;
  height: auto;
}

#verify-otp-container {
  color: #353a45;
  color: var(--text-type1-primary);
}

#verify-otp-container .m-loading-wrap {
  background-color: #ffffff;
  min-height: initial;
}

#verify-otp-container .m-loading-wrap .m-loading .loading {
  background-color: #ffffff;
}

#verify-otp-container .m-loading-wrap {
  background-color: var(--background-type1-quaternary);
  min-height: initial;
}

#verify-otp-container .m-loading-wrap .m-loading .loading {
  background-color: var(--background-type1-quaternary);
}

#verify-otp-container .split-line {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  height: 1px;
  margin: 1.66666667rem 0;
  width: 100%;
}

#verify-otp-container .sec-left {
  color: #353a45;
  color: var(--text-type1-primary);
}
</style>

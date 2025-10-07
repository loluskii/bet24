<template>
  <div class="register-and-login">
    <div class="head-container">
      <div class="m-nav-secondary" id="top-navbar">
        <div class="m-nav-left">
          <span @click="$emit('restart')" class="m-icon m-icon--back"></span>
        </div>
        <div class="info-container">
          <div @click="$router.push({ name: 'home' })" class="m-nav-right">
            <div><span class="close"></span></div>
          </div>
        </div>
      </div>
    </div>
    <div id="findAccount" v-if="activeStep === 1" class="page-container">
      <div class="find-account-container">
        <form>
          <div class="find-account-label">
            <p>Find Account</p>
          </div>
          <div class="action-label" style="white-space: pre-line">
            To reset your password, please confirm <br />your account first.
          </div>
          <div
            class="verifyInputs m-input-wap-wrapper m-input-wap-group m-input-wap-group--prepend"
            :class="userError ? 'm-input-wap-wrapper--error' : ''"
          >
            <div class="m-input-wap-prepend m-input-wap-prepend--default">
              <div>{{ SportsbookGlobalVariable.DialCode }}</div>
            </div>
            <i class="m-input-wap-icon m-input-wap-icon--clickable m-icon-delete"></i>
            <input
              type="number"
              name=""
              placeholder="Mobile Number"
              maxlength="10"
              class="m-input-wap fs-exclude"
              v-model="phoneNumber"
            />
          </div>
          <div class="error-message">{{ userErrorMessage }}</div>
          <button
            class="af-button find-account-btn af-button--primary"
            :class="submitDisabled ? 'is-disabled' : ''"
            @click.prevent="findAccount"
          >
            <span v-if="!isLoading"> Continue </span>
            <span v-else> Please wait... </span>
          </button>
        </form>
      </div>
    </div>
    <div v-else-if="activeStep === 2" class="enter-mobile-container">
      <form>
        <div class="enter-mobile-label">
          <p>Verify Your Number</p>
          <span style="font-size: 15px; font-weight: 400"
            >We’ve sent you a 6-digit code to +234 {{ phoneNumber }}</span
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
          <!-- <div style="position: relative">
                <span class="grey pointer">Send Again</span>&nbsp;
              </div> -->
        </div>
        <div v-if="otpError" class="error-message" style="text-align: center">
          <p>
            {{ otpErrorMessage }}
          </p>
        </div>
        <button
          :class="isLoading ? 'is-disabled' : ''"
          class="af-button enter-mobile-btn af-button--primary"
          type="button"
          @click.prevent="verifyOTPRequest"
        >
          <span v-if="!isLoading"> Continue </span>
          <span v-else> Please wait... </span>
        </button>
      </form>
      <!-- <div class="action-label" @click="restartProcess">Go Back</div> -->
    </div>
    <div id="resetPassword" v-else-if="activeStep === 3" class="page-container">
      <div class="reset-password-container">
        <form>
          <div class="reset-password-label">
            <p>Reset Password</p>
          </div>
          <div class="action-label">
            Your password must be at least 8 characters long and must contain at least one upper
            case letter, one lower case letter and one number.
          </div>
          <div class="verifyInputs m-input-wap-wrapper">
            <input
              type="password"
              v-model="password"
              placeholder="New Password"
              class="m-input-wap m-input-wap__password fs-exclude"
            />
          </div>
          <div v-show="!isPasswordValid" class="error-message">
            <div v-for="error in passwordErrors" :key="error">{{ error }}</div>
          </div>
          <button
            class="af-button reset-password-btn af-button--primary"
            :class="isPasswordValid ? '' : 'is-disabled'"
            @click.prevent="savePassword"
          >
            <span> Confirm </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  verifyUsername,
  CLIENT_ID,
  sendOTP,
  verifyOTP,
  resetPassword,
  formattedPhoneNumber
} from '../helpers'
import emitter from '../plugins/emitter'
import { useUtilsStore } from '../stores'
const emit = defineEmits(['restart'])

const isLoading = ref(false)
const { SportsbookGlobalVariable } = useUtilsStore()
const phoneNumber = ref('')
const activeStep = ref(1)
const password = ref('')
const userError = ref(false)
const userErrorMessage = ref('')
const OTP = ref('')
const otpError = ref(false)
const otpErrorMessage = ref('')

const submitDisabled = computed(() => {
  return String(phoneNumber.value).trim().length < 1 || isLoading.value
})

async function findAccount() {
  if (submitDisabled.value) return

  isLoading.value = true
  const phone = formattedPhoneNumber(phoneNumber.value)

  try {
    const res = await verifyUsername({ username: phone, clientId: CLIENT_ID })
    isLoading.value = false

    if (res.responseMessage === 'SUCCESSFUL') {
      let payload = {
        clientID: CLIENT_ID,
        phoneNumber: `234${phone}`
      }
      const otp = await sendOTP(payload)

      if (otp.status) {
        activeStep.value = 2
      } else {
        isLoading.value = false
        otpErrorMessage.value = otp.data.message
      }
    } else {
      userError.value = true
      userErrorMessage.value = res.responseMessage
    }
  } catch (err) {
    isLoading.value = false
    otpErrorMessage.value = 'Error processing your request'
  }
}

const storeOTP = async (data) => {
  OTP.value = data
}

const verifyOTPRequest = async () => {
  isLoading.value = true
  const phone = formattedPhoneNumber(phoneNumber.value)
  const internationalNumber = `234${phone}`
  let payload = {
    clientID: CLIENT_ID,
    phoneNumber: internationalNumber,
    code: OTP.value
  }

  const res = await verifyOTP(payload)
  if (res.data.status) {
    activeStep.value = 3
  } else {
    isLoading.value = false
    otpError.value = true
    otpErrorMessage.value = res.data.message || 'Invalid OTP'
  }
}

const savePassword = async () => {
  isLoading.value = true
  let payload = {
    username: String(phoneNumber.value).replace(/^0/, ''),
    password: password.value,
    clientId: CLIENT_ID
  }

  const res = await resetPassword(payload)
  if (res.success) {
    emitter.emit('showDialogueToaster', 'Passwowrd Reset Successful')
    setInterval(() => {
      emitter.emit('hideDialogueToaster')
    }, 3000)

    // test this
    emit('restart')
  }
}

const passwordErrors = computed(() => {
  const errors = []
  // Check if password length is at least 8 characters
  if (password.value.length >= 1 && password.value.length < 8) {
    errors.push('Password must be at least 8 characters long.')
  }
  // Check if password contains at least one uppercase letter
  if (password.value.length >= 1 && !/[A-Z]/.test(password.value)) {
    errors.push('Please add an uppercase letter.')
  }
  // Check if password contains at least one lowercase letter
  if (password.value.length >= 1 && !/[a-z]/.test(password.value)) {
    errors.push('Please add a lowercase letter.')
  }
  // Check if password contains at least one number
  if (password.value.length >= 1 && !/\d/.test(password.value)) {
    errors.push('Please add a number.')
  }
  return errors
})

const isPasswordValid = computed(() => passwordErrors.value.length === 0)

function restartProcess() {}
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
.register-and-login .m-nav-secondary {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  height: 4.66666667rem;
}
.register-and-login .m-nav-secondary .m-icon.m-icon--back {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.register-and-login .m-nav-secondary .close {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}
.register-and-login .m-nav-secondary .close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.register-and-login .m-nav-secondary .close:before {
  font-size: 1.25rem;
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

#findAccount {
  margin-top: -3.33333333rem;
}
#findAccount form {
  width: 100%;
}
#findAccount .find-account-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
}
#findAccount .find-account-container .find-account-label {
  width: 100%;
  height: 1.41666667rem;
  font-size: 1.83333333rem;
  font-weight: bold;
  line-height: 0.77;
  text-align: center;
  color: #353a45;
  color: var(--text-type1-primary);
}
#findAccount .find-account-container .m-input-wap-wrapper--active {
  border: 1px solid var(--brand-highlight-text);
}
#findAccount .find-account-container .action-label {
  width: 100%;
  margin-top: 1.23333333rem;
  margin-bottom: 3.33333333rem;
  height: 1.66666667rem;
  font-size: 1rem;
  line-height: 1.66666667rem;
  text-align: center;
  color: #353a45;
  color: var(--text-type1-primary);
}
#findAccount .find-account-container .verifyInputs {
  height: 4rem;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
}
#findAccount .find-account-container .verifyInputs .m-loading-circle-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#findAccount .find-account-container .verifyInputs input {
  height: 100%;
  padding: 1.41666667rem 10px;
}
#findAccount .find-account-container .error-message {
  margin-top: 0.08333333rem;
  width: 100%;
  font-size: 1rem;
  line-height: 1.67;
  text-align: left;
  min-height: 1.66666667rem;
  color: #e41827;
  color: var(--warning-primary);
}
#findAccount .find-account-container .find-account-btn {
  /* margin-top: 2.25rem; */
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: var(--brand-highlight-text);
  background-color: var(--brand-secondary);
  border: none;
  height: 3.95833333rem;
  font-size: 1.066rem;
  color: white;
}

#findAccount .find-account-container .find-account-btn.is-disabled {
  background-color: #9ca0ab;
}
#findAccount .find-account-container .af-icon-loading:before {
  content: '\e648';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#findAccount .find-account-container .af-icon-loading {
  display: inline-block;
  -webkit-animation: loading-rotate 2s linear infinite;
  animation: loading-rotate 2s linear infinite;
}
.m-nav-secondary {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: rgb(222, 226 ,230);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  font-size: 1.33333333rem;
  height: 3.66666667rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 1.33333333rem 0 1.66666667rem;
  width: 100%;
}
.m-nav-secondary .m-nav-left {
  -webkit-box-align: end;
  -webkit-align-items: flex-end;
  -ms-flex-align: end;
  align-items: flex-end;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-left .m-icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  margin-right: 1.58333333rem;
}
.m-nav-secondary .m-nav-left .m-icon:before {
  font-size: 1.33333333rem !important;
}
.m-nav-secondary .m-nav-left .m-icon--back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-left .m-icon--close:before {
  font-size: 1.5rem !important;
}
.m-nav-secondary.withHome {
  padding: 0 0 0 1.66666667rem;
}
.m-nav-secondary a:visited,
.m-nav-secondary a:active,
.m-nav-secondary a:link,
.m-nav-secondary a:hover {
  color: #ffffff;
  color: var(--text-type2-primary);
  text-decoration: none;
}
.m-nav-secondary .title {
  font-size: 1.66666667rem;
  line-height: 2rem;
}
.m-nav-secondary .title.small-font-height {
  font-size: 1.066rem;
  line-height: 1.5rem;
}
.m-nav-secondary .m-login-balance {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span {
  padding: 0 0.66666667rem;
}
.m-nav-secondary .m-login-balance .m-login-jump span:last-of-type:before {
  border-left: 1px solid #ffffff;
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}
.m-nav-secondary .info-container {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
}
.m-nav-secondary .m-nav-right .m-icon-search {
  color: #ffffff;
  color: var(--brand-tertiary);
  height: 2rem;
  line-height: 2rem;
  padding: 0.41666667rem 0.83333333rem;
}
.m-nav-secondary .m-nav-right .m-icon-search::before {
  content: '\e613';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .m-nav-right .m-icon-search:before {
  font-size: 1.5rem;
}
.m-nav-secondary .home-link {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  padding: 0 1.5rem 0 1.33333333rem;
}
.m-nav-secondary .home-link .home-icon::before {
  content: '\e6cb';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-nav-secondary .home-link .home-icon:before {
  font-size: 1.5rem;
}

.enter-mobile-container {
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
.enter-mobile-container form {
  width: 100%;
}
.enter-mobile-container form .progress-container {
  height: 62px;
}
.enter-mobile-container .enter-mobile-label {
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
.enter-mobile-container .m-input-wap-wrapper--active {
  border: 1px solid var(--brand-highlight-text);
}
.enter-mobile-container .verifyInputs {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 4rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}
.enter-mobile-container .verifyInputs .m-loading-circle-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.enter-mobile-container .verifyInputs input {
  height: 100%;
  padding: 1.41666667rem 10px;
}
.enter-mobile-container .error-message {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 1rem;
  line-height: 1.67;
  margin-top: 0.08333333rem;
  min-height: 1.66666667rem;
  text-align: left;
  width: 100%;
}
.enter-mobile-container .error-message .err-login-btn {
  color: #3656a3;
}
.enter-mobile-container .enter-mobile-btn {
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
.enter-mobile-container .action-label {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  font-size: 1.066rem;
  margin-top: 1.75rem;
  text-align: center;
  width: 100%;
}

#resetPassword {
  margin-top: -2.08333333rem;
  position: relative;
}
#resetPassword .header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  left: 1.66666667rem;
  position: absolute;
  top: 1.66666667rem;
}
#resetPassword .header .icon-back {
  -webkit-align-self: flex-start;
  -ms-flex-item-align: start;
  align-self: flex-start;
  margin: 1.33333333rem 0;
}
#resetPassword .header .icon-back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#resetPassword .header .icon-back:before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1.066rem;
}
#resetPassword .reset-password-container {
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
  width: 100%;
}
#resetPassword .reset-password-container form {
  width: 100%;
}
#resetPassword .reset-password-container .reset-password-label {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.83333333rem;
  font-weight: bold;
  height: 1.41666667rem;
  line-height: 0.77;
  text-align: center;
  width: 100%;
}

#resetPassword .reset-password-container .action-label {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.066rem;
  line-height: 1.66666667rem;
  margin: 1.066rem 0;
  text-align: center;
  width: 100%;
}
#resetPassword .reset-password-container .action-label.confirm {
  margin: 1.33333333rem 0 3.33333333rem 0;
}
#resetPassword .reset-password-container .verifyInputs {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 4rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}
#resetPassword .reset-password-container .verifyInputs .m-loading-circle-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#resetPassword .reset-password-container .verifyInputs input {
  font-size: 1.066rem;
  height: 100%;
  padding: 1.41666667rem 20px;
}
#resetPassword .reset-password-container .error-message {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 1rem;
  line-height: 1.67;
  margin-top: 0.08333333rem;
  min-height: 1.66666667rem;
  text-align: left;
  width: 100%;
}
#resetPassword .reset-password-container .reset-password-btn {
  background-color: var(--brand-secondary);
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.33333333rem;
  height: 3.95833333rem;
  margin-top: 2.08333333rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}
</style>

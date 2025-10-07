<template>
  <div id="popupLogin" style="height: 100%">
    <div v-if="!isForgotPasswordView" class="register-and-login">
      <div id="loginStep" class="page-container page-fixed">
        <div class="change-region-wrap">
          <span class="current-country" style="font-weight: bold">Sign In</span>
          <router-link to="/">
            <span class="close"></span>
          </router-link>
        </div>
        <div class="login-container">
          <form style="width: 100%">
            <div
              class="verifyInputs x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend"
            >
              <div class="x-input-wap-prepend x-input-wap-prepend--default">
                <div>+234</div>
              </div>
              <i
                style="display: none"
                class="x-input-wap-icon x-input-wap-icon--clickable x-input-wap-icon--show m-icon-delete"
              ></i>
              <input
                type="number"
                placeholder="Mobile Number"
                maxlength="10"
                class="x-input-wap fs-exclude"
                v-model="phoneNumber"
              />
            </div>
            <div class="error-message"></div>
            <div class="verifyInputs x-input-wap-wrapper">
              <i
                class="m-input-wap-text--icon"
                v-if="!showPassword"
                @click="togglePassword"
                style=""
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="20px"
                  width="20px"
                  class="svg-icon-base"
                >
                  <path
                    d="M22.212 1.545a.726.726 0 010 1.02L2.59 22.455a.705.705 0 01-1.007 0 .728.728 0 010-1.02l3.748-3.799c-1.29-1.094-2.495-2.54-3.614-4.34l-.174-.284a1.46 1.46 0 010-1.508c2.893-4.785 6.37-7.18 10.431-7.18 1.807 0 3.503.474 5.086 1.422l4.146-4.201a.705.705 0 011.006 0zM19.783 7.96c.87.91 1.7 1.993 2.49 3.248l.18.29a1.46 1.46 0 010 1.52c-2.926 4.782-6.418 7.173-10.478 7.173a9.605 9.605 0 01-3.53-.66l2.946-2.987a4.234 4.234 0 003.605-1.227 4.364 4.364 0 001.21-3.654l3.378-3.424a1.07 1.07 0 00.2-.28zm-5.13 5.277a2.874 2.874 0 01-1.71 1.734l1.71-1.734zM11.977 7.93a4.26 4.26 0 00-3.738 2.235 4.378 4.378 0 00.124 4.397l1.046-1.06a2.914 2.914 0 01.554-3.287 2.818 2.818 0 013.243-.562l1.045-1.06a4.207 4.207 0 00-2.274-.663z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </i>
              <i class="m-input-wap-text--icon" v-else @click="togglePassword"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="20px"
                  width="20px"
                  class="svg-icon-base"
                >
                  <path
                    d="M22.477 11.166C20.261 6.749 16.687 4.028 11.992 4c-4.696-.028-8.27 2.75-10.486 7.166a2.12 2.12 0 000 1.675c2.217 4.41 5.79 7.13 10.486 7.159 4.695.028 8.297-2.749 10.513-7.166a2.078 2.078 0 00-.028-1.668zm-10.485 5.84A5.074 5.074 0 017.3 13.921a4.96 4.96 0 011.095-5.458 5.123 5.123 0 015.53-1.089A5.007 5.007 0 0117.056 12a4.97 4.97 0 01-1.48 3.54 5.104 5.104 0 01-3.585 1.466zm0-7.11c-1.177 0-2.132.942-2.132 2.104 0 1.162.955 2.103 2.132 2.103s2.13-.941 2.13-2.103c0-1.162-.953-2.103-2.13-2.103z"
                    fill="currentColor"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Password"
                class="x-input-wap fs-exclude"
              />
            </div>
            <div data-op="login-pswd-err" class="error-message">
              {{ authStore.authError }}
            </div>
            <button
              @click.prevent="login"
              class="af-button login-btn af-button--primary"
              :class="
                authStore.loading || password === '' || phoneNumber === '' ? 'is-disabled' : ''
              "
              :disabled="authStore.loading || password === '' || phoneNumber === ''"
            >
              <span v-if="!authStore.loading"> Login </span>
              <span v-else> Loading... </span>
            </button>
          </form>
          <div class="action-wrap">
            <div @click="showForgotPassword">
              <span>Forgot Password</span>
              ?
            </div>
            <div class="blank-block"></div>
            <div>
              <router-link :to="{ name: 'sign-up' }"> Create New Account</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VerifyUsernameBlock v-else @restart="restartProcess"></VerifyUsernameBlock>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores'
import VerifyUsernameBlock from '@/components/VerifyUsernameBlock.vue'
import { CLIENT_ID, formattedPhoneNumber } from '../helpers'

const authStore = useAuthStore()
const phoneNumber = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  return (showPassword.value = !showPassword.value)
}

const isForgotPasswordView = ref(false)

function showForgotPassword() {
  isForgotPasswordView.value = true
}

function restartProcess() {
  isForgotPasswordView.value = false
}

async function login() {
  // if (!phoneNumber.value || String(phoneNumber.value).trim().length >= 9) {
  //   authStore.authError = "Please enter a valid phone number";
  //   return;
  // }
  try {
    let payload = {
      username: formattedPhoneNumber(String(phoneNumber.value).trim()),
      password: password.value,
      clientId: CLIENT_ID
    }
    await authStore.doLogin(payload)
  } catch (err) {
    authStore.authError = err.message || 'Login failed'
  }
}

onMounted(() => {
  authStore.authError = ''
})
</script>

<style scoped>
.enter-mobile.es-dialog .es-dialog-footer .es-dialog-btn {
  border-top: 1px solid #d4d4d4;
  width: 100%;
}
#loginStep {
  position: relative;
}
#loginStep .change-region-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 1.33333333rem;
  line-height: 1.5rem;
  padding: 2rem 2.5rem 2rem 2.5rem;
  width: 100%;
}

#loginStep .change-region-wrap .m-icon-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#loginStep .change-region-wrap .m-icon-right::before {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}
#loginStep .change-region-wrap .close {
  float: right;
}
#loginStep .change-region-wrap .close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#loginStep .change-region-wrap .close:before {
  font-size: 1.25rem;
}

#loginStep .login-container {
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
  padding: 0 2.5rem 0;
  width: 100%;
}
#loginStep .login-container .verifyInputs {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 1.066rem;
  height: 3.66666667rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
}
#loginStep .login-container .verifyInputs .m-loading-circle-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#loginStep .login-container .verifyInputs input {
  height: 100%;
  padding: 1rem 10px;
}
#loginStep .login-container .error-message {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 1rem;
  line-height: 1.67;
  margin-top: 0.08333333rem;
  min-height: 1.66666667rem;
  text-align: left;
  width: 100%;
}
#loginStep .login-container .login-btn {
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 1.3rem;
  height: 3.95833333rem;
  margin-top: 1.91666667rem;
  padding-left: 1px;
  padding-right: 1px;
  width: 100%;
  border-radius: 4px;
}
#loginStep .login-container .login-btn {
  background-color: var(--brand-secondary);
}

#loginStep .login-container .login-btn:disabled {
  background-color: #9ca0ab;
}
#loginStep .login-container .action-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;

  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-top: 1.75rem;
  width: 100%;
  text-decoration: none;
}
#loginStep .login-container .action-wrap a {
  color: var(--brand-secondary) !important;
}
#loginStep .login-container .action-wrap div {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
#loginStep .login-container .action-wrap div.blank-block {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}

.x-input-wap-wrapper .m-input-wap-text--icon {
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
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 42px;
  color: #9ca0ab;
  border-radius: 8px;
}
</style>

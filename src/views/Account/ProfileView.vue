<template>

  <div class="m-ac-form-wrap" v-if="isAccountVerification">
    <HeaderProfile :header-title="'Account Verification'" @back-to-profile="handleBackToProfile"></HeaderProfile>
    <form>
      <p style="font-size: 17px">Verify your account today and enjoy faster withdrawals and higher limits</p>
      <br />
      <VueSelect
        v-model="documentType"
        :options="[
          { label: 'International Passport', value: 'international_passport' },
          { label: 'Drivers License', value: 'drivers_license' },
          { label: 'Phone Number', value: 'phone_number' },
          { label: 'Voters Card', value: 'voters_card' },
          { label: 'National Identification Number', value: 'nin' },
          { label: 'Bank Account', value: 'bank_account' },
        ]"
        placeholder="Select an valid ID"
      />
      <template v-if="documentType === 'bank_account'">
        <div style="margin-top: 10px;"></div>
        <VueSelect
          v-model="bankCode"
          :options="banksList"
          :get-option-label="option => option.name"
          :get-option-value="option => option.bank_id"
          placeholder="Select Bank"
        />
      </template>
      <!-- <br /> -->
      <div class="x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend" v-if="['international_passport','drivers_license','phone_number','voters_card','nin','bank_account'].includes(documentType)">
        <input type="text" placeholder="ID Number" maxlength="10" class="x-input-wap fs-exclude"
          v-model="documentNumber" style="padding: 10px 15px;" />
      </div>

      <div class="x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend" v-if="['international_passport'].includes(documentType)">
        <input type="text" placeholder="Last Name" maxlength="10" class="x-input-wap fs-exclude"
          v-model="lastName" style="padding: 10px 15px;" />
      </div>
      <!---->
      <div class="m-btn-wrapper">
        <button class="af-button af-button--success" :disabled="isLoading"  :class="{'is-disabled': isLoading}" @click.prevent="submitKycRequest">
          <span> Verify </span>
        </button>
      </div>
    </form>
  </div>
  <template v-else>
    <div v-if="!showInputFieldView" class="m-uc-wrapper myAccount">
      <HeaderOther :header-title="'Profile'"></HeaderOther>
      <div class="m-ac-info-wrap">
        <ul style="position: relative">
          <li class="lock">
            <em>Username</em><span>{{ currentUser.username }}</span>
          </li>
          <li class="lock" :class="details?.firstName ? '' : 'with-arrow'"
            @click="showInput('First Name', 'text', details?.firstName, false)">
            <em>First Name</em><span>{{
              details?.firstName ? details?.firstName : "Not Set"
            }}</span>
          </li>
          <li class="lock" :class="details?.lastName ? '' : 'with-arrow'"
            @click="showInput('Last Name', 'text', details?.lastName, false)">
            <em>Last Name</em><span>{{ details?.lastName ? details?.lastName : "Not Set" }}</span>
          </li>
          <li :class="currentUser.email ? '' : 'with-arrow'"
            @click="showInput('Email', 'email', currentUser.email, false)">
            <em>Email</em><span>{{ currentUser.email ? currentUser.email : "Not Set" }}</span>
          </li>
          <li class="lock">
            <em>Phone Number</em><span>+234 {{ details?.username }}</span>
          </li>
          <li class="lock" :class="details?.address ? '' : 'with-arrow'"
            @click="showInput('Address', 'text', details?.address, false)">
            <em>Address</em><span><span>{{
              details?.address ? details?.address : "Not Set"
            }}</span></span>
          </li>
          <li class="lock" :class="details?.city ? '' : 'with-arrow'"
            @click="showInput('City', 'text', details?.city, false)">
            <em>City</em><span><span>{{ details?.city ? details?.city : "Not Set" }}</span></span>
          </li>
          <li class="with-arrow" @click="
            showInput('Update Password', 'password', null, null, 'password')
            ">
            <em data-cms-key="birthday">Change your password</em><span></span>
          </li>
          <li class="with-arrow" @click="isAccountVerification = true">
            <em>Account Verification</em><span></span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="m-uc-wrapper myAccount">
      <div class="m-ac-form-wrap">
        <HeaderProfile :header-title="inputTitle" @back-to-profile="handleBackToProfile"></HeaderProfile>
        <form>
          <div tabindex="6" class="m-input-wrapper">
            <div class="x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend"  v-if="!isPasswordUpdate" >
              <input :type="textType" :placeholder="inputTitle" class="x-input-wap fs-exclude"
                style="padding: 10px 15px;" v-model="inputValue"/>
            </div>
            <template v-else>
              <div class="x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend">
                <input type="password" placeholder="Old Password" class="x-input-wap fs-exclude"
                  style="padding: 10px 15px;" v-model="oldPassword"/>
              </div>
              <div class="x-input-wap-wrapper x-input-wap-group x-input-wap-group--prepend">
                <input type="password" placeholder="New Password" class="x-input-wap fs-exclude"
                  style="padding: 10px 15px;" v-model="newPassword"/>
              </div>
            </template>
          </div>
          <!---->
          <div class="m-btn-wrapper">
            <button class="af-button af-button--success" @click.prevent="saveUpdate">
              <span> {{ buttonText }} </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
</template>

<script setup>
import HeaderOther from "@/components/HeaderOther.vue";
import { useUsersStore } from "@/stores";
import { ref, computed } from "vue";
import HeaderProfile from "../../components/HeaderProfile.vue";
import { updateProfile, CLIENT_ID, updatePassword, processAccountVerification } from "@/helpers";
import emitter from "../../plugins/emitter";
import { useUtilsStore } from "../../stores";
import VueSelect from "vue3-select-component";
import { last } from "lodash";


const usersStore = useUsersStore();
const utilsStore = useUtilsStore()

const currentUser = computed(() => {
  return usersStore.currentUser
})

const details = computed(() => {
  return usersStore.currentUser
})

const banksList = computed(() => {
  return utilsStore.banksList
})

const inputTitle = ref("");
const textType = ref("text");
const inputValue = ref("");
const showInputFieldView = ref(false);
const isPasswordUpdate = ref(false);
const isAccountVerification = ref(false)
const documentNumber = ref('')
const documentType = ref('')
const bankCode = ref('')
const lastName = ref('')
const isLoading = ref(false)

const oldPassword = ref('')
const newPassword = ref('')

const buttonText = ref('Save')

function showInput(title, text_type, value_exists, editable, inputType = null) {
  if (!editable && value_exists) return
  console.log(inputType)
  showInputFieldView.value = true
  inputTitle.value = title
  if (!value_exists && value_exists !== null) {
    textType.value = text_type
  } else if (value_exists !== null && editable) {
    textType.value = text_type
  } else if (inputType && inputType === 'password') {
    isPasswordUpdate.value = true
  }
}

function handleBackToProfile() {
  showInputFieldView.value = false;
  isPasswordUpdate.value = false;
  isAccountVerification.value = false
}

async function saveUpdate() {
  let url
  let payload = {
    userID: currentUser.value.id,
    roleId: currentUser.value.roleId,
    email: currentUser.value.email ?? '',
    firstName: details.value?.firstName ?? '',
    lastName: details.value?.lastName ?? '',
    phone: details.value?.phone ?? '',
    address: details.value?.address ?? '',
    city: details.value?.city ?? '',
    gender: details.value?.gender ?? ''
    // date_of_birth: details.value?.date_of_birth ?? ''
  }
  switch (inputTitle.value) {
    case 'First Name':
      payload.firstName = inputValue.value
      break
    case 'Last Name':
      payload.lastName = inputValue.value
      break
    case 'Email':
      payload.email = inputValue.value
      break
    case 'Address':
      payload.address = inputValue.value
      break
    case 'City':
      payload.city = inputValue.value
      break
    case 'Gender':
      payload.gender = inputValue.value
      break
    case 'Date of Birth':
      payload.date_of_birth = inputValue.value
      break
    case 'Update Password':
      payload = {
        clientId: CLIENT_ID,
        oldPassword: oldPassword.value,
        password: newPassword.value
      }
      break
    default:
      break
  }
  let res
  if (isPasswordUpdate.value) {
    if (oldPassword.value === '' || newPassword.value === '') return
    buttonText.value = 'Saving...'
    res = await updatePassword(payload)
  } else {
    buttonText.value = 'Saving...'
    res = await updateProfile(payload)
  }
  buttonText.value = 'Save'
  if (res.success) {
    await usersStore.loadCurrentUser();
    alert("Update Successful!");
    showInputFieldView.value = false;
    isPasswordUpdate.value = false;
    inputTitle.value = "";
    inputValue.value = "";
    textType.value = "text";
  } else {
    alert(`Error: ${res.message}`)
  }
}

async function submitKycRequest(){
  try {
    isLoading.value = true
    if(documentType.value == '' || documentNumber.value == ''){
      emitter.emit(
        "showDialogueToaster",
        'Please fill all fields!',
      );
      return
    }
    let payload = {
      documentType: documentType.value,
      documentNumber: documentNumber.value,
			clientId: CLIENT_ID
    }
    if(documentType.value === 'bank_account'){
      payload.bankCode = bankCode.value
    }
    if(documentType.value === 'international_passport'){
      payload.lastName = lastName.value
    }

    const res = await processAccountVerification(payload);
		if(!res.success){
			emitter.emit(
	      "showDialogueToaster",
	      res.message[0],
	    );
		}else{
			emitter.emit(
	      "showDialogueToaster",
	      res.message,
	    );
			setTimeout(() => {
				handleBackToProfile();
			},1000)
		}
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    emitter.emit(
      "showDialogueToaster",
      error,
    );
  }
}

</script>
<style scoped>
.x-input-wap-wrapper {
  border-radius: 3px !important;
  margin-top: 10px;
  border-color: #dcd8d8 !important;
}
.x-input-wap-wrapper .x-input-wap {
  height: 38px !important;
  border-radius: 3px !important;
}
.m-uc-wrapper {
  background-color: #fff;
}

.m-uc-wrapper .mg-b-40 {
  margin-bottom: 3.33333333rem;
}

.m-uc-wrapper .displayName {
  color: #000000;
  color: var(--text-default);
  font-size: 1.33333333rem;
  font-weight: 700;
  margin: 1.66666667rem 0 2rem 0;
  padding: 0 4.9%;
}

.m-uc-wrapper .m-ac-info-wrap .verify-btn {
  border: 1px solid var(--brand-highlight-text);
  border-radius: 4px;
  color: var(--brand-highlight-text);
  font-size: 1.066rem;
  font-weight: 500;
  margin-left: 10px;
  margin-right: auto;
  padding: 0 1.25rem;
}

.m-uc-wrapper .m-ac-info-wrap li {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid;
  border-bottom-color: #eaecef;
  border-bottom-color: var(--brand-border-type1);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 2.16666667rem;
  line-height: 2.16666667rem;
  padding: 1.066rem 1.33333333rem 1.066rem 4.9%;
  position: relative;
}

/* .m-uc-wrapper .m-ac-info-wrap li > span {
  color: var(--brand-primary) !important;
} */
.m-uc-wrapper .m-ac-info-wrap li>span.gray {
  color: #9ca0ab !important;
}

.m-uc-wrapper .m-ac-info-wrap li.lock>span {
  color: #9ca0ab !important;
}

.m-uc-wrapper .m-ac-info-wrap li.with-arrow::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-uc-wrapper .m-ac-info-wrap li.with-arrow::before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  line-height: 1;
  position: absolute;
  right: 0.5rem;
  top: 1.5rem;
}

.m-uc-wrapper .m-ac-info-wrap li.with-check>span {
  color: #9ca0ab !important;
}

.m-uc-wrapper .m-ac-info-wrap li em {
  color: #353a45;
  color: var(--text-type1-primary);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1.066rem;
  font-weight: normal;
}

.m-uc-wrapper .m-ac-info-wrap li>span {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1.066rem;
  margin-right: 1rem;
  max-width: 50%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-uc-wrapper .m-ac-info-wrap li>span.block {
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  font-size: 0.66666667rem;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  padding: 0.5rem 0.66666667rem;
}

.m-uc-wrapper .m-ac-info-wrap li>span.unverified {
  background-color: var(--brand-highlight-text);
  color: #ffffff !important;
  font-size: 0.66666667rem;
  height: 1.33333333rem;
  line-height: 1.33333333rem;
  padding: 0.58333333rem 1rem;
}

.m-uc-wrapper .noticed {
  margin: 2.25rem 2.5rem 1.75rem;
}

.m-uc-wrapper .noticed p {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
}

.m-uc-wrapper .m-input-wrapper {
  width: 100%;
}

.m-uc-wrapper .m-input-wrapper .m-input {
  border: 1px solid #9ca0ab;
  border-radius: 0.16666667rem;
  font-size: 1rem;
  height: 4rem;
  line-height: 2.66666667rem;
  padding: 0.66666667rem 0.75rem;
  border-color: #9ca0ab;
  border-color: var(--line-type1-secondary);
}

.m-uc-wrapper .m-input-wrapper .m-input-com {
  display: block;
  position: static;
}

.m-uc-wrapper .m-input-wrapper .m-input-icon {
  right: 0.66666667rem;
  width: 1.66666667rem;
}

.m-uc-wrapper .m-input-wrapper .m-input-icon::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-uc-wrapper .m-input-wrapper .m-input-icon::before {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border-radius: 1.66666667rem;
  font-size: 1rem;
  height: 1.66666667rem;
  line-height: 1.66666667rem;
  position: absolute;
  right: 0;
  text-align: center;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);
  width: 1.66666667rem;
  color: #353a45;
  color: var(--text-type1-primary);
}

.m-uc-wrapper .m-input-wrapper .m-input-icon+.m-input {
  padding-right: 2.33333333rem;
}

.m-uc-wrapper .m-input-wrapper .m-input-icon.m-input-icon--clickable:hover {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
}

.m-uc-wrapper .m-input-wrapper .m-input-icon.m-input-icon--clickable:hover+.m-input {
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
}

.m-uc-wrapper .m-input-wrapper .m-input-text--icon {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #3656a3;
  font-size: 1.066rem;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding-right: 0.83333333rem;
  text-align: left;
  width: 3.75rem;
}

.m-uc-wrapper .m-input-wrapper .m-input-text--icon+.m-input {
  padding-right: 3.75rem;
}

.m-uc-wrapper .m-input-wrapper.m-input-wrapper--error .m-input {
  border-color: #e41827 !important;
  border-color: var(--warning-primary) !important;
}

.m-uc-wrapper .m-input-wrapper.m-input-wrapper--error .m-input-prepend {
  border-color: #e41827 !important;
  border-color: var(--warning-primary) !important;
}

.m-uc-wrapper .m-input-wrapper.m-input-wrapper--active .m-input {
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
}

.m-uc-wrapper .m-input-wrapper:nth-of-type(2).m-input-wrapper--active .m-input {
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-secondary);
}

.m-uc-wrapper .m-input-group--prepend {
  border: 1px solid var(--brand-highlight-text) !important;
  border-radius: 0.16666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0.33333333rem 0.5rem;
  border-color: var(--brand-highlight-text) !important;
  border-color: var(--brand-secondary) !important;
}

.m-uc-wrapper .m-input-group--prepend .m-input-prepend,
.m-uc-wrapper .m-input-group--prepend .m-input {
  border: none !important;
}

.m-uc-wrapper .m-input-group--prepend .m-input-prepend {
  font-size: 1.33333333rem;
  padding: 0 0.58333333rem 0 0;
}

.m-uc-wrapper .m-input-group--prepend.m-input-wrapper--active {
  border: 1px solid var(--brand-highlight-text) !important;
  border-color: var(--brand-highlight-text) !important;
  border-color: var(--brand-secondary) !important;
}

.m-uc-wrapper .m-input-group--prepend.m-input-wrapper--error {
  border: 1px solid #e41827 !important;
  border-color: #e41827 !important;
  border-color: var(--warning-primary) !important;
}

.m-uc-wrapper .m-input-group--prepend.m-input-wrapper--error input.m-input {
  border: none !important;
}

.m-uc-wrapper .m-input-group--prepend .m-input-icon {
  right: 1.08333333rem;
}

.m-uc-wrapper .m-input-group--prepend .m-input-icon+.m-input {
  padding-right: 0.83333333rem;
}

.m-uc-wrapper .m-input-group--prepend .m-input-icon.m-input-icon--show+.m-input {
  padding-right: 2.33333333rem;
}

.m-uc-wrapper .m-input-group--prepend .m-input {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: none !important;
  border-radius: 0.16666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 3.16666667rem;
  line-height: 3.16666667rem;
  padding: 0.25rem 2.58333333rem 0.25rem 0.83333333rem;
}

.myAccount .dateSelect {
  position: fixed;
}

.left-words {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  position: absolute;
  right: 0.83333333rem;
  top: 1.25rem;
}

.fixPos {
  right: 2.91666667rem;
}

.m-input {
  font-size: 1.066rem !important;
}

.selected {
  color: var(--brand-highlight-text) !important;
}

.edit {
  color: #9ca0ab !important;
}

.verified {
  color: #9ca0ab !important;
}

.m-ac-form-wrap {
  background-color: #fff;
  height: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.m-ac-form-wrap form {
  margin: 2rem;
}

.m-ac-form-wrap form.m-psw-wrap {
  margin-top: 1.66666667rem;
}

.m-ac-form-wrap form.m-psw-wrap h1 {
  font-size: 1.83333333rem;
  font-weight: bold;
  text-align: center;
}

.m-ac-form-wrap form.m-psw-wrap p {
  font-size: 1rem;
  line-height: 1.33333333rem;
  margin: 0.83333333rem 0 1.66666667rem;
  text-align: center;
}

.m-ac-form-wrap form.m-psw-wrap .m-link-awrap {
  padding-top: 0.58333333rem;
  text-align: center;
}

.m-ac-form-wrap form.m-psw-wrap .m-link-awrap a {
  color: var(--brand-highlight-text);
  font-size: 1.33333333rem;
}

.m-ac-form-wrap .password-nav .m-icon-close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-ac-form-wrap .m-btn-wrapper {
  margin-top: 0.66666667rem;
}

.m-ac-form-wrap .m-error-infos {
  color: #e41827;
  color: var(--warning-primary);
  font-size: 0.83333333rem;
  line-height: 1.33333333rem;
  margin-top: 0.66666667rem;
}
</style>

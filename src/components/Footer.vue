<template>
  <footer class="x-footer x-footer--ng">
    <div class="copyright-wrap">
      <div class="icons">
        <img
          src="//s.sporty.net/global/main/brand/sportybet/mobile/images/license.89d68648de.svg"
        /><img
          src="//s.sporty.net/global/main/brand/sportybet/mobile/images/icon18.996cdffd94.svg"
        />
      </div>
      <div class="copyright" style="color: var(--brand-primary)">
        &copy; {{ new Date().getFullYear() }} {{ utilsStore.brandName }}. All rights reserved.
      </div>
    </div>
    <div class="partnership-wrap text-center">
      <img src="/logo.png" />
    </div>
    <div></div>
    <div class="payment-methods">
      <h5>Payment methods</h5>
      <div class="slider-wrap">
        <div class="slider-window">
          <div class="sliders" style="transform: translateX(0%)">
            <div class="row">
              <img src="/logo_visa.fd08bf37cf.png" />
              <img src="/logo_mc.51fc36230c.png" />
              <img src="/paystack-logo.png" style="height: 3rem" />
              <img src="/monnify.png" style="height: 3.5rem" />
            </div>
          </div>
        </div>
      </div>
      <p>
        Age 18 and above only to register or play at {{ utilsStore.brandName }}. Play Responsibly.
        Betting is addictive and can be psychologically harmful. | {{ utilsStore.brandName }} is a product of Fane International Sports Tour LTD and is 
        licensed by the National Lottery Regulatory Commission.
      </p>
    </div>
    <div class="hr"></div>
    <div class="t_c-about_us">
      <h5
        class="underline"
        @click="
          $router.push({
            name: 'cms-page',
            params: { page: 'terms_and_conditions' }
          })
        "
      >
        Terms &amp; Conditions
      </h5>
      <h5 class="divider">|</h5>
      <h5
        class="underline"
        @click="$router.push({ name: 'cms-page', params: { page: 'about_us' } })"
      >
        About Us
      </h5>
      <h5 class="divider">|</h5>
      <h5
        class="underline"
        @click="
          $router.push({
            name: 'cms-page',
            params: { page: 'responsible_gaming' }
          })
        "
      >
        Responsible Gaming
      </h5>
    </div>
    <div class="btn" @click="handleClick">
      <button>
        {{ route.name == 'account-me' && authStore.isAuthenticated ? 'Logout' : 'Back to Top' }}
      </button>
    </div>
  </footer>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore, useUtilsStore } from '@/stores'
import { defineComponent } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const utilsStore = useUtilsStore()

async function doLogout() {
  return authStore.logout()
}

async function handleClick() {
  if (route.name == 'account-me' && authStore.isAuthenticated) {
    return authStore.logout()
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

defineComponent({
  name: 'global-footer'
})
</script>
<style>
footer {
  background-color: #1b1e25;
  background-color: var(--c-footer-bg);
  color: #9ca0ab;
  color: var(--text-type2-tertiary);
  padding-bottom: 1rem;
}
footer .copyright-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #eaecef;
  background-color: var(--background-type1-tertiary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1.66666667rem 1.066rem;
}
footer .copyright-wrap .icons {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
footer .copyright-wrap .icons .iframe-img {
  height: 45px;
  margin: -0.83333333rem 0;
  -webkit-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);
  -webkit-transform-origin: 0 50%;
  -ms-transform-origin: 0 50%;
  transform-origin: 0 50%;
  width: 100px;
}
footer .copyright-wrap .icons img {
  height: 1.66666667rem;
}
footer .copyright-wrap .icons img:not(:first-child) {
  margin-left: 1rem;
}
footer .copyright-wrap .copyright {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  font-size: 0.83333333rem;
  -webkit-box-pack: right;
  -webkit-justify-content: right;
  -ms-flex-pack: right;
  justify-content: right;
  text-align: right;
}
@media only screen and (max-width: 320px) {
  footer .copyright-wrap .icons .iframe-img {
    margin-right: -1.66666667rem;
    -webkit-transform: scale(0.7);
    -ms-transform: scale(0.7);
    transform: scale(0.7);
    -webkit-transform-origin: 0 50%;
    -ms-transform-origin: 0 50%;
    transform-origin: 0 50%;
  }
}
footer .paybills-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-top: 1.66666667rem;
}
footer .paybills-wrap .paybills {
  margin: 0 1rem;
}
footer .paybills-wrap .paybills h4 {
  color: #ffffff;
  color: var(--text-type2-primary);
  font-size: 1.33333333rem;
  text-align: center;
}
footer .paybills-wrap .paybills h5 {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 0.83333333rem;
  text-align: center;
}
footer .partnership-wrap {
  padding: 2rem 1.83333333rem 0 1.83333333rem;
}
footer .partnership-wrap img {
  width: 10rem;
}
footer .payment-methods {
  overflow-x: hidden;
  padding: 1.66666667rem 1.83333333rem;
}
footer .payment-methods h5,
footer .payment-methods p {
  text-align: center;
}
footer .hr {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 1.33333333rem;
  padding: 0 1.33333333rem;
}
footer .hr::before {
  background-color: #35465a;
  content: '';
  height: 1px;
  width: 100%;
}
footer .t_c-about_us {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-weight: 700;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 1.33333333rem;
}
footer .t_c-about_us .underline {
  text-decoration: underline;
}
footer .t_c-about_us .divider {
  margin: 0 0.5rem;
}
footer .btn {
  padding: 0 1.33333333rem;
}
footer .btn button {
  background-color: #353a45;
  background-color: var(--c-footer-btn-bg);
  border: 0;
  color: #ffffff;
  color: var(--text-type2-primary);
  padding: 1.066rem 0;
  width: 100%;
}
.gutter {
  padding-bottom: 8.33333333rem !important;
}
.slider-wrap {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  margin: 1rem 0 1.66666667rem 0;
  overflow: hidden;
}
.slider-wrap .slider-window {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.slider-wrap .slider-window .sliders {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.slider-wrap .slider-window .sliders .row > img {
  height: 1.5rem;
  margin: 0.83333333rem 0.83333333rem;
  -o-object-fit: contain;
  object-fit: contain;
}
@media screen and (max-width: 375px) {
  .slider-wrap .slider-window .sliders .row > img {
    height: 1.33333333rem;
  }
}
@media screen and (max-width: 320px) {
  .slider-wrap .slider-window .sliders .row > img {
    height: 1.066rem;
  }
}
.slider-wrap .slider-window .sliders .row > img.visa {
  height: 1.066rem;
}
@media screen and (max-width: 375px) {
  .slider-wrap .slider-window .sliders .row > img.visa {
    height: 1rem;
  }
}
@media screen and (max-width: 320px) {
  .slider-wrap .slider-window .sliders .row > img.visa {
    height: 0.83333333rem;
  }
}
.slider-wrap .slider-window .sliders .row > img.mc {
  height: 1.66666667rem;
}
@media screen and (max-width: 375px) {
  .slider-wrap .slider-window .sliders .row > img.mc {
    height: 1.5rem;
  }
}
@media screen and (max-width: 320px) {
  .slider-wrap .slider-window .sliders .row > img.mc {
    height: 1.33333333rem;
  }
}

.slider-wrap .slider-window .sliders .row > img {
  height: 1.5rem;
  margin: 0.83333333rem 0.83333333rem;
  -o-object-fit: contain;
  object-fit: contain;
}

.version-info {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-type2-tertiary);
  padding: 0.5rem 0;
  opacity: 0.7;
}
</style>

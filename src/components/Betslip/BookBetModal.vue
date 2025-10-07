<template>
  <div class="booking-code" @click="hideModal">
    <div class="booking-code-share">
      <div class="booking-code-title">Booking Code</div>
      <div>
        <div class="booking-code-share-code">
          <input type="text" id="j_betCode" class="invisible-element" />
          {{ betDetails.data.betslipId }}
          <svg
            viewBox="5 2 15 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            height="2rem"
            width="2rem"
            class="svg-icon-base"
            id="content-copy"
            @click="copyBookingCode"
          >
            <path
              d="M15.79 2.75H5.684C4.758 2.75 4 3.506 4 4.431v11.774h1.684V4.43H15.79V2.75zm2.526 3.364H9.053c-.927 0-1.684.756-1.684 1.681V19.57c0 .925.757 1.681 1.684 1.681h9.263c.927 0 1.684-.756 1.684-1.681V7.795c0-.925-.758-1.681-1.684-1.681zm0 13.453H9.053V7.797h9.263V19.57v-.003z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <!-- <div class="booking-code-time">18/12/2023 09:15</div> -->
      </div>
      <div class="booking-code-links">
        <div class="links-container">
          <div>
            <div @click="redirectToPlatform('x')" class="link-icon">
              <img src="@/assets/images/x-copy.svg" />
            </div>
            <div>X</div>
          </div>
          <div>
            <div @click="redirectToPlatform('facebook')" class="link-icon">
              <img src="@/assets/images/fb-copy.svg" />
            </div>
            <div>Facebook</div>
          </div>
          <div>
            <div @click="redirectToPlatform('whatsapp')" class="link-icon">
              <img src="@/assets/images/wa-copy.svg" />
            </div>
            <div>Whatsapp</div>
          </div>

          <div>
            <div @click="copyToClipboard('')" class="link-icon">
              <img src="@/assets/images/ig-copy.svg" />
            </div>
            <div>Copy Link</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  betDetails: Object
})

const emit = defineEmits(['hide-modal'])

function hideModal(e) {
  if (e && e.target.classList.contains('booking-code')) {
    emit('hide-modal')
  }
}

function copyBookingCode() {
  const textToCopy = props.betDetails.data.betslipId
  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(textToCopy)
    alert('Copied!')
    emit('hide-modal')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}

function copyToClipboard() {
  const textToCopy = `${window.location.origin}?shareCode=${props.betDetails.data.betslipId}`
  const textarea = document.createElement('textarea')
  textarea.value = textToCopy
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(textToCopy)
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}

function redirectToPlatform(platform) {
  let message = `Hey I just placed on Cubetbet! ${window.location.origin}?shareCode=${props.betDetails.data.betslipId}`
  switch (platform) {
    case 'whatsapp':
      return window.open('https://wa.me/?text=' + encodeURIComponent(message))
    case 'x':
      return window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(message))
    case 'facebook':
      return window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(message)
      )
  }
}
</script>

<style>
.booking-code {
  background-color: rgba(0, 0, 0, 0.7);
  bottom: 0;
  height: 100%;
  left: 0;
  overflow: auto;
  position: absolute;
  position: fixed;
  text-align: center;
  width: 100%;
  z-index: 1000;
  color: #1b1e25;
  color: var(--text-type1-tertiary);
}
.booking-code .invisiable-item {
  left: 300vw;
  position: fixed;
}
.booking-code .m-holding-icon {
  -webkit-animation: loading-rotate 1.2s linear infinite;
  animation: loading-rotate 1.2s linear infinite;
  display: inline-block;
}
.booking-code .m-holding-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.booking-code .m-holding-icon:before {
  color: var(--brand-highlight-text);
  color: var(--brand-text-secondary);
  font-size: 30px;
  line-height: 1;
  vertical-align: top;
}
.booking-code .booking-code-share {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  bottom: 0px;
  padding: 24px;
  position: absolute;
  text-align: center;
  width: calc(100vw - 48px);
}
.booking-code .booking-code-share .booking-code-title {
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  margin-bottom: 8px;
}
.booking-code .booking-code-share .booking-code-share-code {
  font-size: 28px;
  font-weight: bold;
  line-height: 33px;
  margin: auto;
  margin-bottom: 8px;
  position: relative;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}
.booking-code .booking-code-share .booking-code-share-code #content-copy {
  left: 100%;
  margin-left: 12px;
  margin-top: 4px;
  position: absolute;
}
.booking-code .booking-code-share .booking-code-time {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 24px;
}

.booking-code .booking-code-share #content-copy {
  margin-bottom: 6px;
  margin-left: 5px;
  width: 24px;
}
.booking-code .booking-code-share #content-copy:hover {
  cursor: pointer;
}
.booking-code .booking-code-share .invisible-element {
  bottom: -100vh;
  position: fixed;
}
.booking-code .booking-code-share .booking-code-links {
  margin-left: -24px;
  margin-top: 36px;
  overflow: auto;
  width: 100vw;
}
.booking-code .booking-code-share .booking-code-links .links-container {
  border-collapse: separate;
  border-spacing: 15px;
  font-size: 13px;
  margin: auto;
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
}
.booking-code .booking-code-share .booking-code-links .links-container > div {
  display: inline-block;
  margin: 0px 7px;
}
.booking-code .booking-code-share .booking-code-links .links-container .link-icon {
  cursor: pointer;
  margin-bottom: 8px;
}
.booking-code .booking-code-int {
  color: #353a45;
  color: var(--text-type1-primary);
  font-family: Roboto;
  padding: 16px 20px;
  width: calc(100vw - 40px);
}
.booking-code .booking-code-int .booking-code-back {
  font-size: 12px;
  font-weight: 500;
  left: 0px;
  line-height: 16px;
  padding: 12px;
  position: absolute;
  top: 0px;
}
.booking-code .booking-code-int .booking-code-title {
  font-weight: 500;
  line-height: 16px;
  margin-bottom: 16px;
}
.booking-code .booking-code-int .booking-code-desc .booking-code-desc-title {
  background: #dcdee5;
  background: var(--disable-brand-secondary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  line-height: normal;
  padding: 8px 12px;
}
.booking-code .booking-code-int .booking-code-desc .booking-code-desc-content {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 159px;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 32px;
}
.booking-code .booking-code-int .booking-code-desc .booking-code-desc-content .desc-content {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-weight: bold;
  line-height: normal;
  padding-top: 20px;
  text-align: start;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-code {
  font-size: 12px;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-share-code {
  font-size: 16px;
  position: relative;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-share-code
  #content-copy {
  color: var(--brand-highlight-text);
  height: 100%;
  left: 100%;
  margin-left: 4px;
  margin-top: 2px;
  position: absolute;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-stake {
  font-size: 10px;
  font-weight: 400;
  margin: 8px 0 12px;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-stake
  p {
  font-weight: bold;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-stake
  .stake,
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-stake
  .potwin {
  font-size: 12px;
}
.booking-code
  .booking-code-int
  .booking-code-desc
  .booking-code-desc-content
  .desc-content
  .content-time {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  font-size: 8px;
  font-weight: 400;
}

.booking-code .booking-code-int .booking-code-desc .booking-code-desc-bonus {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.booking-code .booking-code-int .booking-code-links {
  color: #1b1e25;
  color: var(--text-type1-tertiary);
  margin-left: -20px;
  margin-top: 20px;
}
.booking-code .booking-code-int .booking-code-links .links-container {
  font-size: 10px;
  line-height: 21px;
}
.booking-code .booking-code-int .booking-code-links .links-container .link-icon {
  margin-bottom: 0;
}
.booking-code .booking-code-int .booking-code-links .links-container .link-icon img {
  height: 29px;
  width: 29px;
}
</style>

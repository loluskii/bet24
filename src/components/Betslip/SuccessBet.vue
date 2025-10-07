<template>
  <div class="success-wrap">
    <div class="success-dialog">
      <div style="align-items: center; text-align: center">
        <img
          src="@/assets/images/checklist.png"
          style="height: 80px; align-items: center; margin-bottom: 15px; filter: grayscale()"
          alt=""
          sizes=""
          srcset=""
        />
      </div>
      <h3 class="title">
        <span>Bet Successful</span>
      </h3>
      <ul class="list">
        <li data-op="betslip-success-stake">
          <span>Total Stake</span>
          <span>{{ formatNumber(response.data.stake) }}</span>
        </li>

        <li>
          <span>Potential Win</span>
          <span>{{ formatNumber(response.data.possibleWin) }}</span>
        </li>
        <li class="share-code">
          <span><span>Booking Code</span> <em></em></span>
          <span>
            <span @click="activateShare">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                height="22px"
                width="22px"
                class="svg-icon-base"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h18v18H0z"></path>
                  <path
                    fill="currentColor"
                    fill-rule="nonzero"
                    d="M13.5 12.06c-.57 0-1.08.225-1.47.577L6.683 9.525c.037-.173.067-.345.067-.525 0-.18-.03-.352-.067-.525l5.287-3.082a2.247 2.247 0 003.78-1.643c0-1.245-1.005-2.25-2.25-2.25s-2.25 1.005-2.25 2.25c0 .18.03.353.068.525L6.03 7.357A2.247 2.247 0 002.25 9a2.247 2.247 0 003.78 1.643l5.34 3.12c-.037.157-.06.322-.06.487 0 1.207.982 2.19 2.19 2.19 1.207 0 2.19-.983 2.19-2.19 0-1.207-.982-2.19-2.19-2.19z"
                  ></path>
                </g>
              </svg>
            </span>
            <span data-clipboard-text="FB40C24" @click="copyToClipboard(response.data.betslipId)">
              <svg
                viewBox="5 2 15 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                width="18px"
                class="svg-icon-base"
              >
                <path
                  d="M15.79 2.75H5.684C4.758 2.75 4 3.506 4 4.431v11.774h1.684V4.43H15.79V2.75zm2.526 3.364H9.053c-.927 0-1.684.756-1.684 1.681V19.57c0 .925.757 1.681 1.684 1.681h9.263c.927 0 1.684-.756 1.684-1.681V7.795c0-.925-.758-1.681-1.684-1.681zm0 13.453H9.053V7.797h9.263V19.57v-.003z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            {{ response.data.betslipId }}
          </span>
        </li>
      </ul>

      <div class="jump-box">
        <span data-op="betslip-success-history" @click="viewOpenBets">View Open Bets</span>
        <i></i>
      </div>
    </div>
    <div class="btn-box">
      <button class="af-button rebet af-button--primary" @click="$emit('rebet')">
        <span><span data-cms-key="rebet">Rebet</span></span>
      </button>
      <button class="af-button btn-ok af-button--primary" @click="$emit('hide-success')">
        <span><span data-cms-key="ok" style="color: white">OK</span></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatNumber } from '@/helpers'
const router = useRouter()
const props = defineProps({
  response: Object
})

const emit = defineEmits(['hide-success', 'rebet', 'activate-share'])
function viewOpenBets() {
  emit('hide-success')
  return router.push({ name: 'open-bets' })
}

function activateShare() {
  emit('activate-share', props.response)
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()

  try {
    navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}
</script>
<style>
.success-wrap {
  bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 100;
}

.success-wrap .success-dialog {
  background: #ffffff;
  bottom: 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  overflow: auto;
  padding: 1.33333333rem 2.66666667rem 6.33333333rem 2.66666667rem;
  position: absolute;
  width: 100%;
  z-index: 333;
}

.success-wrap .success-dialog .title {
  font-size: 1.66666667rem;
  font-weight: bold;
  line-height: 1.83333333rem;
  padding-bottom: 1.75rem;
  text-align: center;
}

.success-wrap .success-dialog .title .m-icon-suc {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  padding-bottom: 1.33333333rem;
  text-align: center;
}

.success-wrap .success-dialog .title .m-icon-suc:before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.success-wrap .success-dialog .title .m-icon-suc:before {
  color: var(--brand-primary);
  font-size: 4rem;
  line-height: 1;
  position: relative;
  text-align: center;
  vertical-align: middle;
  z-index: 11;
}

.success-wrap .success-dialog .list {
  border-bottom: 1px solid #353a45;
  border-top: 1px solid #353a45;
  margin: 0 0.83333333rem;
  padding: 0.83333333rem 0;
}

.success-wrap .success-dialog .list li {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  line-height: 2.66666667rem;
  min-height: 2.66666667rem;
}

.success-wrap .success-dialog .list li span {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 0%;
  -ms-flex: 1 0 0%;
  flex: 1 0 0%;
}

.success-wrap .success-dialog .list li span:last-child {
  font-weight: bold;
  text-align: right;
}

.success-wrap .success-dialog .list li span:first-child {
  color: #9ca0ab;
}

.success-wrap .success-dialog .list li.share-code img {
  -webkit-transform: translateY(-2px);
  -ms-transform: translateY(-2px);
  transform: translateY(-2px);
}

.success-wrap .success-dialog .list li.share-code i {
  border: solid 1px var(--brand-primary);
  border-radius: 2px;
  color: var(--brand-primary);
  display: inline-block;
  font-size: 1rem;
  height: 2.5rem;
  line-height: 2.5rem;
  margin-right: 0.58333333rem;
  text-align: center;
  vertical-align: middle;
  width: 4.66666667rem;
}

.success-wrap .success-dialog .list li.share-code em:before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.success-wrap .success-dialog .list li.share-code em:before {
  color: #9ca0ab;
  padding-left: 0.41666667rem;
}

.success-wrap .success-dialog .cashout-top {
  color: #9ca0ab;
  font-size: 0.83333333rem;
  padding: 0.66666667rem 1.33333333rem 0;
}

.success-wrap .success-dialog .jump-box {
  margin-top: 3rem;
  text-align: center;
}

.success-wrap .success-dialog .jump-box span {
  color: var(--brand-primary);
  font-size: 1rem;
}

.success-wrap .success-dialog .jump-box i {
  display: inline-block;
  padding-left: 10px;
  vertical-align: middle;
}

.success-wrap .success-dialog .jump-box i:before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.success-wrap .success-dialog .jump-box i::before {
  color: var(--brand-primary);
}

.success-wrap .success-dialog .bottomImg {
  display: block;
  margin-top: 1.75rem;
}

.success-wrap .success-dialog .bottomImg img {
  max-height: 100px;
  width: 100%;
}

@media only screen and (max-width: 320px) and (max-height: 480px) {
  .success-wrap .success-dialog {
    padding: 1.33333333rem 2.33333333rem 5.33333333rem 2.33333333rem;
  }

  .success-wrap .success-dialog .jump-box {
    margin-top: 2.33333333rem;
  }
}

.success-wrap .btn-box {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  bottom: 0;
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1.066rem;
  font-weight: bold;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 350;
}

.success-wrap .btn-box .rebet {
  background-color: #353a45;
  border: none;
  border-radius: 0;
  line-height: 4rem;
  padding: 0 2.08333333rem;
  width: 33%;
}

.success-wrap .btn-box .btn-ok {
  background-color: var(--brand-secondary);
  border: none;
  border-radius: 0;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  line-height: 4rem;
  padding: 0 2.08333333rem;
  color: black;
}
</style>

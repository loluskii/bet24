<template>
  <div class="es-dialog-wrap" id="esDialog0" style="visibility: visible">
    <div
      class="layout mask"
      @click="$emit('hide-dialogue')"
      style="z-index: 1000; position: fixed"
    ></div>
    <div class="m-dialog popup">
      <div class="m-dialog-body">
        <div class="m-dialog-main" style="height: auto">
          <div>
            <img :src="image.image" style="height: 100%; width: 100%" @click="nextAction" />
          </div>

          <div class="popup-footer">
            <span @click="$emit('hide-dialogue')" class="close"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { stringIsLink } from '../helpers'
import { useUtilsStore } from '../stores'

const emits = defineEmits(['hide-dialogue'])
const utilsStore = useUtilsStore()
defineProps(['image'])

function nextAction() {
  utilsStore.popupDialogShown = true
  if (image.link && stringIsLink(image.link)) {
    return (window.location.href = image.link)
  }
  emits('hide-dialogue')
}
</script>

<style scoped>
span.close {
  float: right;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  opacity: 0.7;
  margin-top: 25px;
}

span.close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
span.close:before {
  font-size: 1.25rem;
}

.popup-footer {
  display: inline-flex;
  justify-content: center;
  width: 100%;
}

.m-dialog.popup {
  border-radius: 0.3rem;
  box-shadow:
    0 0 24px 0 rgba(0, 0, 0, 0.25),
    0 0 24px 0 rgba(112, 76, 76, 0.25);
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  z-index: 1001;
}

.m-dialog-close {
  display: none;
  padding: 0.3rem 1rem;
  text-decoration: none;
}

.m-dialog-close em {
  color: #353a45;
  color: var(--text-type1-primary);
  font-size: 0;
}

.m-dialog-close em::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.m-dialog-close em:before {
  font-size: 1.5rem;
}

.m-dialog-close em:active {
  -webkit-transform: scale(0.9, 0.9);
  -ms-transform: scale(0.9, 0.9);
  transform: scale(0.9, 0.9);
}

.m-dialog-wrap {
  visibility: hidden;
}

.m-dialog-wrap .layout {
  background: #353a45;
  height: 100%;
  left: 0;
  opacity: 0.4;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.m-dialog-wrap .overlay-animate-enter {
  opacity: 0;
}

.m-dialog-wrap .overlay-animate-enter-active {
  opacity: 0.4;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.m-dialog-wrap .overlay-animate-leave {
  opacity: 0.4;
}

.m-dialog-wrap .overlay-animate-leave-active {
  opacity: 0;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.m-dialog-wrap .body-overflow {
  overflow: hidden;
}

.m-dialog .m-dialog-head {
  padding: 0 2rem 0.66666667rem;
}

.m-dialog .m-dialog-head h1 {
  font-size: 1.66666667rem;
  font-weight: 700;
  min-height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin: 0;
  text-align: center;
  text-align: left;
}

.m-dialog .m-dialog-head .m-dialog-close {
  background: none;
  font-family: 'Microsoft YaHei', arial, simsun, SimHei;
  position: absolute;
  right: 5px;
  top: 1px;
}

.m-dialog .m-dialog-head .m-dialog-close em {
  cursor: default;
  font-style: normal;
}

.m-dialog .m-dialog-body {
  background-color: transparent;
  margin: 0;
  /* min-height: 4rem; */
  padding: 0;
}

.m-dialog .m-dialog-body .m-dialog-main {
  /* background-color: #fafafa;  */
  /* background-color: var(--background-general-primary); */
  overflow: auto;
  /* padding: 0 2rem; */
  word-break: break-word;
  word-wrap: break-word;
}

.m-dialog .m-dialog-footer {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0.66666667rem;
  text-align: right;
  width: 100%;
}

.m-dialog .m-dialog-footer .m-dialog-btn {
  color: var(--brand-highlight-text);
  color: var(--brand-secondary);
  cursor: pointer;
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.066rem;
  font-weight: 700;
  height: 3rem;
  line-height: 3rem;
  outline: none;
  padding: 0;
  text-align: left;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: 30%;
}

.m-dialog.es-ani-show {
  -webkit-transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s;
  transition:
    width,
    height,
    transform 3s,
    2s liner 3s,
    2s,
    -webkit-transform 3s;
}

.m-dialog.es-ani-hide {
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}

.m-dialog.m-dialog-ani-1 {
  opacity: 0.1;
}

.m-dialog.m-dialog-ani-2 {
  opacity: 0.1;
  -webkit-transform: scale(0.1);
  -ms-transform: scale(0.1);
  transform: scale(0.1);
}

.m-dialog.m-dialog-ani-3 {
  opacity: 0.1;
  -webkit-transform: scale(1.8);
  -ms-transform: scale(1.8);
  transform: scale(1.8);
}

.m-dialog.m-dialog-ani-4 {
  opacity: 0;
  -webkit-transform: perspective(300px) rotateY(90deg);
  transform: perspective(300px) rotateY(90deg);
}

.m-dialog.m-dialog-ani-5 {
  opacity: 0.1;
  -webkit-transform: scale(0.3);
  -ms-transform: scale(0.3);
  transform: scale(0.3);
}

.m-dialog.m-dialog-ani-6 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, 230);
  -ms-transform: matrix(1, 0, 0, 1, 0, 230);
  transform: matrix(1, 0, 0, 1, 0, 230);
}

.m-dialog.m-dialog-ani-7 {
  opacity: 0.1;
  -webkit-transform: matrix(1, 0, 0, 1, 0, -230);
  -ms-transform: matrix(1, 0, 0, 1, 0, -230);
  transform: matrix(1, 0, 0, 1, 0, -230);
}

.m-dialog-info .m-dialog-body .m-dialog-main,
.m-dialog-error .m-dialog-body .m-dialog-main,
.m-dialog-alert .m-dialog-body .m-dialog-main,
.m-dialog-confirm .m-dialog-body .m-dialog-main {
  vertical-align: middle;
}

.m-dialog-toast {
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  color: #fff;
  font-size: 1rem;
  padding-top: 0;
}

.m-dialog-toast.m-dialog {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.m-dialog-toast .m-dialog-body {
  min-height: auto;
}

.m-dialog-toast a {
  color: #ffc000;
  text-decoration: underline;
}

.m-dialog-toast a :link {
  color: #ffc000;
}

.m-dialog-toast a :visited {
  color: #ffc000;
}

.m-dialog-toast a :hover {
  color: #ffc000;
}

.m-dialog-toast .m-dialog-body,
.m-dialog-toast .m-dialog-body .m-dialog-main {
  background: transparent;
  min-height: inherit;
  text-align: center;
}

.m-dialog-toast .m-dialog-body .m-dialog-main {
  padding: 0.83rem 1.05rem;
}
</style>

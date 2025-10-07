<template>
  <div
    tabindex="0"
    class="m-keyboard"
    id="m-keyboard"
    :style="{ display: keyboardVisible ? 'block' : 'none' }"
  >
    <div class="save-prefer-row">
      <div class="plus-block">
        <div @click="$emit('button-click', 'number', 100)" class="plus-cell">+100</div>
        <div @click="$emit('button-click', 'number', 500)" class="plus-cell">+500</div>
        <div @click="$emit('button-click', 'number', 1000)" class="plus-cell">+1000</div>
      </div>
      <!---->
    </div>
    <div class="flexpad-wrap">
      <div class="left">
        <div class="m-keyboard-row">
          <span @click="$emit('button-click', 'number', '1')" class="m-keyboard-key">1</span>
          <span @click="$emit('button-click', 'number', '2')" class="m-keyboard-key">2</span>
          <span @click="$emit('button-click', 'number', '3')" class="m-keyboard-key">3</span>
          <span @click="$emit('button-click', 'number', '4')" class="m-keyboard-key">4</span>
          <span @click="$emit('button-click', 'number', '5')" class="m-keyboard-key">5</span>
          <span
            @click="$emit('button-click', 'delete')"
            class="m-keyboard-key action m-keyboard-delete"
          >
            <svg
              width="24px"
              height="18px"
              viewBox="0 0 24 18"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Betslip-Basic-input" transform="translate(-301.000000, -457.000000)">
                  <g id="Icon/backspace_24px" transform="translate(301.000000, 454.000000)">
                    <g id="ic_backspace_black_24px">
                      <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>
                      <path
                        d="M22,3 L7,3 C6.31,3 5.77,3.35 5.41,3.88 L0,12 L5.41,20.11 C5.77,20.64 6.31,21 7,21 L22,21 C23.1,21 24,20.1 24,19 L24,5 C24,3.9 23.1,3 22,3 Z M19,15.59 L17.59,17 L14,13.41 L10.41,17 L9,15.59 L12.59,12 L9,8.41 L10.41,7 L14,10.59 L17.59,7 L19,8.41 L15.41,12 L19,15.59 Z"
                        id="Shape"
                        fill="#FFFFFF"
                        fill-rule="nonzero"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </span>
        </div>
        <div class="m-keyboard-row">
          <span @click="$emit('button-click', 'number', '6')" class="m-keyboard-key">6</span>

          <span @click="$emit('button-click', 'number', '7')" class="m-keyboard-key">7</span>
          <span @click="$emit('button-click', 'number', '8')" class="m-keyboard-key">8</span>
          <span @click="$emit('button-click', 'number', '9')" class="m-keyboard-key">9</span>
          <span @click="$emit('button-click', 'number', '0')" class="m-keyboard-key">0</span>
          <!-- <span @click="$emit('button-click', 'dot')" class="m-keyboard-key">.</span> -->
          <!-- <span @click="$emit('button-click', 'double-zero')" class="m-keyboard-key">00</span> -->
          <span
            @click="$emit('button-click', 'clear')"
            class="m-keyboard-key action m-keyboard-delete"
            data-cms-key="clear"
            >Clear
          </span>
        </div>
      </div>
      <div @click="$emit('button-click', 'done')" class="right">
        <span>Done</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  keyboardVisible: Boolean
})
defineEmits(['button-click'])
</script>

<style>
.m-keyboard {
  margin-top: 0.41666667rem;
  outline: none;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
}
.m-keyboard .save-prefer-row {
  background-color: #353a45;
  background-color: var(--background-type2-secondary);
  border-bottom: #9ca0ab 1px solid;
  border-color: #9ca0ab;
  border-color: var(--line-type1-secondary);
  color: #ffffff;
  color: var(--text-type2-primary);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 8px 0px;
  width: 100%;
}
.m-keyboard .save-prefer-row .plus-block {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 3;
  -webkit-flex: 3;
  -ms-flex: 3;
  flex: 3;
  padding: 0px 12px 0px 10px;
}
.m-keyboard .save-prefer-row .plus-block .plus-cell {
  border: #9ca0ab 1px solid;
  border-color: #9ca0ab;
  border-color: var(--text-type1-secondary);
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 0.91666667rem;
  height: 28px;
  line-height: 28px;
  margin-left: 10px;
  text-align: center;
  width: 56px;
}
.m-keyboard .save-prefer-row .plus-block .plus-cell:first-child {
  margin-left: 0px;
}
.m-keyboard .save-prefer-row .update-default-stake {
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  -ms-flex: 2;
  flex: 2;
  font-size: 1rem;
  line-height: 30px;
  padding-left: 24px;
}
.m-keyboard .save-prefer-row .m-icon-check {
  position: relative;
}
.m-keyboard .save-prefer-row .m-icon-check::before {
  border: 1px solid #9ca0ab;
  border-color: #9ca0ab;
  border-color: var(--text-type1-secondary);
  border-radius: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  content: '';
  display: inline-block;
  height: 16px;
  left: -24px;
  line-height: 16px;
  position: absolute;
  text-align: center;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 16px;
}
.m-keyboard .save-prefer-row .m-icon-check--checked::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-keyboard .save-prefer-row .m-icon-check--checked::before {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  border: 1px solid var(--brand-highlight-text);
  border-color: var(--brand-highlight-text);
  border-color: var(--brand-text-secondary);
  color: #ffffff;
  color: var(--brand-tertiary);
  font-size: 0.83333333rem;
}
.m-keyboard .save-prefer-row .m-icon-check--disabled::before {
  background: #9ca0ab;
  background: var(--text-disable-type1-primary);
  border: 1px solid #9ca0ab;
  border-color: #9ca0ab;
  border-color: var(--text-disable-type1-primary);
}
.m-keyboard .flexpad-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-keyboard .left {
  -webkit-box-flex: 8;
  -webkit-flex: 8;
  -ms-flex: 8;
  flex: 8;
}
.m-keyboard .right {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: var(--brand-highlight-text);
  background: var(--brand-secondary);
  color: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  -ms-flex: 2;
  flex: 2;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.m-keyboard .m-keyboard-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.m-keyboard .m-keyboard-row .m-keyboard-key {
  background-color: #353a45;
  background-color: var(--background-type2-secondary);
  -webkit-box-shadow: inset -1px -1px 0 0 #353a45;
  box-shadow: inset -1px -1px 0 0 #353a45;
  color: #ffffff;
  color: var(--text-type2-primary);
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 0.83333333rem 0;
  text-align: center;
}
.m-keyboard .m-keyboard-row .m-keyboard-key.action {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  -ms-flex: 2;
  flex: 2;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.m-keyboard .m-keyboard-row .m-keyboard-key:active {
  background-color: #50545f;
}
.m-keyboard .m-keyboard-row .m-keyboard-delete svg {
  vertical-align: top;
}
.m-keyboard .m-keyboard-row .m-keyboard-clear {
  font-size: 1rem;
}
.m-keyboard .m-keyboard-row .m-keyboard-done {
  background: var(--brand-highlight-text);
  background: var(--brand-text-secondary);
  -webkit-box-flex: 2;
  -webkit-flex: 2;
  -ms-flex: 2;
  flex: 2;
}
.m-keyboard .m-keyboard-row .m-keyboard-done:active {
  background-color: #33ea6a;
}
</style>

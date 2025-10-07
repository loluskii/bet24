<template>
  <div></div>
</template>

<script>
export default {}
</script>

<style>
.m-sportBets .m-list-nav-type {
  background: #353a45;
  padding: 0 2.08333333rem;
}

.m-sportBets .m-list-nav-type .m-list-nav-type-item {
  background-color: #50545f;
  border-top-left-radius: 0.33333333rem;
  border-top-right-radius: 0.33333333rem;
  color: #ffffff;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 1rem;
  font-weight: bold;
  height: 3rem;
  line-height: 3rem;
  margin-right: 0.25rem;
}

.m-sportBets .m-list-nav-type .m-list-nav-type-item:last-child {
  margin: 0;
}

.m-sportBets .m-list-nav-type .m-list-nav-type-item.active {
  background-color: #ffffff;
  color: #353a45;
}

.m-sportBets .m-list-nav-type .m-list-nav-type-item.m-snap-nav-item--disabled {
  opacity: 0.5;
  text-decoration: line-through;
}

.m-openBet--suc.es-dialog .es-dialog-main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 0.66666667rem;
  padding: 0 1.66666667rem;
  text-align: center;
  width: 100%;
}

.m-openBet--suc.es-dialog .es-dialog-main > img {
  height: 3.33333333rem;
  width: 3.33333333rem;
}

.m-openBet--suc.es-dialog .es-dialog-main .m-txt-main {
  color: #353a45;
  font-size: 1.83333333rem;
  font-weight: bold;
  line-height: 1.66666667rem;
  margin-top: 1.83333333rem;
}

.m-openBet--suc.es-dialog .es-dialog-main .m-txt-min {
  color: #353a45;
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 1.066rem;
}

.m-openBet--suc.es-dialog .es-dialog-main .m-txt-desc {
  color: #9ca0ab;
  font-size: 1rem;
  line-height: 1;
  margin-top: 0.66666667rem;
}

.m-openBet--suc.es-dialog .es-dialog-btn {
  background: var(--brand-highlight-text);
  color: #ffffff;
  height: 4rem;
  line-height: 4rem;
  width: 100%;
}

.m-uc-nav {
  height: 4rem;
  background: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.m-uc-nav .m-nav-item {
  font-size: 1rem;
  line-height: 4rem;
  width: 33.4%;
  text-align: center;
  text-transform: capitalize;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.m-uc-nav .m-nav-item--active {
  font-weight: bold;
  border-bottom: 0.25rem solid var(--brand-highlight-text);
}

.m-btn--text {
  color: var(--brand-highlight-text);
}

.m-btn--text + .m-btn {
  margin-top: 1.66666667rem;
}

.m-openbet-header {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: #353a45;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
  height: 3.66666667rem;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0 1.33333333rem;
  width: 100%;
}

.m-openbet-header .no-login {
  color: #ffffff;
}

.m-openbet-header .no-login > span {
  padding: 0 0.66666667rem;
}

.m-openbet-header .no-login span:last-of-type:before {
  border-left: 1px solid #ffffff;
  content: '';
  height: 100%;
  left: -0.75rem;
  opacity: 0.5;
  position: relative;
  top: -0.16666667rem;
}

.m-openbet-header .is-login {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #fafd00;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-openbet-header .is-login .usr-img {
  border: 0.08333333rem solid #ffffff;
  border-radius: 50%;
  height: 1.66666667rem;
  margin-right: 0.66666667rem;
  width: 1.66666667rem;
}

.m-openbet-header .is-login .balance {
  display: inline;
  vertical-align: bottom;
}

.m-openbet-header .is-login .hidden {
  font-size: 1rem;
  letter-spacing: 0.16666667rem;
}

.page-content {
  height: 100%;
}

.m-sportBets {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-height: calc(100% - 3.66666667rem);
  padding-bottom: 5.66666667rem;
  position: relative;
}

.m-sportBets .f-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-sportBets .f-btwn {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.m-sportBets .f-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.m-sportBets .f-grid {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  display: grid;
  width: 100%;
}

.m-sportBets .f-flex-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
}

.m-sportBets .f-count {
  counter-reset: index;
}

.m-sportBets .m-t-12 {
  font-size: 1rem;
  line-height: 1;
}

.m-sportBets .m-t-center {
  text-align: center;
}

.m-sportBets .m-t-right {
  text-align: right;
}

.m-sportBets .m-t-mt4 {
  margin-top: 0.33333333rem;
}

.m-sportBets .m-t-ml6 {
  margin-left: 0.5rem;
}

.m-sportBets .m-t-mt18 {
  margin-top: 1.5rem;
}

.m-sportBets .m-t-mv3 {
  margin: 0.16666667rem;
}

.m-sportBets .m-t-mv5 {
  margin: 0.41666667rem;
}

.m-sportBets .m-r-5 {
  margin-right: 0.41666667rem;
}

.m-sportBets .m-r-20 {
  margin-right: 1.66666667rem;
}

.m-sportBets .m-t-ml2 {
  margin-left: 0.16666667rem;
}

.m-sportBets .m-b-5 {
  margin-bottom: 0.41666667rem;
}

.m-sportBets .capitalize {
  text-transform: capitalize;
}

.m-sportBets .m-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-sportBets .nowrap {
  white-space: nowrap;
}

.m-sportBets {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-height: calc(100% - 3.66666667rem);
  padding-bottom: 5.66666667rem;
  position: relative;
}

.m-sportBets .f-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-sportBets .f-btwn {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.m-sportBets .f-count-item::before {
  content: counter(index) '.';
  counter-increment: index;
}

.m-sportBets .top-bar {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 0.41666667rem;
  padding: 0.66666667rem 0.83333333rem;
  width: 100%;
}

.m-sportBets .top-bar .selector {
  height: 100%;
  width: 2.5rem;
}

.m-sportBets .top-bar .card-format-btn {
  background: #9ca0ab;
  -webkit-box-shadow: inset 0px 0px 0px 5px #ffffff;
  box-shadow: inset 0px 0px 0px 5px #ffffff;
  height: 2.41666667rem;
  position: relative;
  width: 2.41666667rem;
}

.m-sportBets .top-bar .card-format-btn:before {
  background: #ffffff;
  content: '';
  height: 100%;
  left: 50%;
  position: absolute;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 0.16666667rem;
}

.m-sportBets .top-bar .card-format-btn:after {
  background: #ffffff;
  content: '';
  height: 0.16666667rem;
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 100%;
}

.m-sportBets .top-bar .m-open-bet-filter {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: auto;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  z-index: 0;
}

.m-sportBets .top-bar .m-open-bet-filter .m-nav-item {
  background: #eaecef;
  border-radius: 0.16666667rem;
  color: #1b1e25;
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  height: 2.33333333rem;
  line-height: 2.33333333rem;
  margin-right: 0.33333333rem;
  min-width: 5.83333333rem;
  padding: 0 0.83333333rem;
  text-align: center;
  white-space: nowrap;
  width: auto;
}

.m-sportBets .top-bar .m-open-bet-filter .m-nav-item--active {
  background: #353a45;
  border-bottom: none;
  color: #ffffff;
}

.m-sportBets .m-openbet.live-display .top-bar {
  position: fixed;
  z-index: 1;
}

.m-sportBets .m-openbet.live-display .m-bet-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  padding-top: 4.66666667rem;
}

.m-sportBets.m-sportBets-fix {
  padding-bottom: 0;
}

.bg-white {
  background-color: #ffffff;
}

.align-r {
  text-align: right;
}

.open-bet-toast.es-dialog-toast {
  background: #353a45;
  border-color: #353a45;
  border-radius: 1.66666667rem;
  color: #ffffff;
  font-size: 1rem;
}

.open-bet-toast.es-dialog-toast .es-dialog-body .es-dialog-main {
  padding: 0.5rem 0;
}

.m-sportBets .capitalize {
  text-transform: capitalize;
}

.m-sportBets .m-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-sportBets .nowrap {
  white-space: nowrap;
}

.m-sportsBet--bets .f-flex .m-l-left,
.m-sportsBet--bets .f-flex .m-l-right {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.m-sportsBet--bets .m-tips {
  -webkit-box-align: space-between;
  -webkit-align-items: space-between;
  -ms-flex-align: space-between;
  align-items: space-between;
  background: #ffffff;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  height: 6.25rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 0.83333333rem;
  padding: 1.25rem 1rem 1.25rem 1.33333333rem;
  width: 100%;
}

.m-sportsBet--bets .m-tips > div {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.m-sportsBet--bets .m-tips .m-l-right {
  text-align: right;
}

.m-sportsBet--bets .m-tips .m-i-close {
  color: #353a45;
  display: inline-block;
  vertical-align: middle;
}

.m-sportsBet--bets .m-tips .m-i-close:before {
  content: '\e602';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.m-sportsBet--bets .m-tips .m-i-close:before {
  font-size: 1.66666667rem;
  line-height: 1;
}

.m-sportsBet--bets .m-bet-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0.83333333rem 0.83333333rem;
  width: 100%;
}

.m-sportsBet--bets .m-bet-list .m-item-wrap {
  padding: 0 1rem 0.83333333rem;
}

.m-sportsBet--bets .m-bet-list .m-i-live {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: var(--brand-secondary);
  display: inline-block;
  font-family: 'Roboto';
  font-size: 1rem;
  margin-left: 0.66666667rem;
  padding: 0.08333333rem 0.56666667rem;
}

.m-sportsBet--bets .m-bet-item {
  background: #ffffff;
  border-radius: 0.16666667rem;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 0.83333333rem;
  width: 100%;
}

.m-sportsBet--bets .m-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.91666667rem 0 0.75rem 0;
}

.m-sportsBet--bets .m-title > div {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-sportsBet--bets .m-title .actions {
  color: var(--brand-highlight-text);
  font-weight: 700;
}

.m-sportsBet--bets .m-title .actions > .import-sim-button {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-family: 'Roboto';
}

.m-sportsBet--bets .m-title .actions > .divider {
  border-right: 1px solid #dcdee5;
  height: 1.66666667rem;
  margin: 0 1rem 0 0.83333333rem;
}

.m-sportsBet--bets .m-title .actions .icon-share {
  color: var(--brand-highlight-text);
  display: inline-block;
}

.m-sportsBet--bets .m-title .actions .icon-share.disabled {
  color: #9ca0ab;
}

.m-sportsBet--bets .m-against {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  padding: 0.83333333rem 0;
}

.m-sportsBet--bets .m-against > li {
  margin-bottom: 0.33333333rem;
}

.m-sportsBet--bets .m-against .live-info {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0;
  -ms-flex: 1 0;
  flex: 1 0;
  margin-left: 0.41666667rem;
  text-align: left;
  white-space: nowrap;
}

.m-sportsBet--bets .m-vs {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin: 0 0.41666667rem;
}

.m-sportsBet--bets .m-more {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  grid-template-columns: 1fr 10.83333333rem;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-bottom: 0.83333333rem;
}

.m-sportsBet--bets .m-more .m-l-right {
  width: 10.83333333rem;
}

.m-sportsBet--bets .m-more .m-icon-more {
  color: var(--brand-highlight-text);
  display: inline-block;
  margin-left: 0.66666667rem;
  -webkit-transform: translateY(0.16666667rem);
  -ms-transform: translateY(0.16666667rem);
  transform: translateY(0.16666667rem);
}

.m-sportsBet--bets .m-more .m-icon-more:before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.m-sportsBet--bets .m-money {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-top: 0.66666667rem;
  width: 100%;
}

.m-sportsBet--bets .m-money__lr {
  max-width: 70%;
  overflow: hidden;
}

.m-sportsBet--bets .m-money .amount {
  overflow: hidden;
  padding-top: 0.66666667rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-sportsBet--bets .m-btn-wrapper {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-top: 0.83333333rem;
  text-align: center;
  width: 100%;
}

.m-sportsBet--bets .m-btn-wrapper .m-btn--cashout {
  background: var(--brand-secondary);
  border: none;
  border-radius: 2px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  height: 3.33333333rem;
  line-height: 1.58333333rem;
  outline: none;
  text-align: center;
  width: 100%;
}

.m-sportsBet--bets .m-btn-wrapper .m-btn--cashout.changed {
  background: #096b27;
}

.m-sportsBet--bets .m-btn-wrapper .m-btn--cashout .cashout-label {
  font-weight: 500;
}

.m-sportsBet--bets .m-btn-wrapper .m-btn-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid var(--brand-highlight-text);
  border-radius: 0.16666667rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-left: 0.66666667rem;
  padding: 0.41666667rem;
  width: 4rem;
}

.m-sportsBet--bets .m-btn-wrapper .m-btn-item > img {
  width: 1.5rem;
}

.m-sportsBet--bets .m-btn-wrapper.disabled .m-btn--cashout {
  background: #dcdee5;
  color: #ffffff;
}

.m-sportsBet--bets .m-btn-wrapper.disabled .m-btn-item {
  border-color: #dcdee5;
}

.m-sportsBet--bets .m-btn-wrapper.disabled .m-btn-item > img {
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
  opacity: 0.3;
}

.m-sportsBet--bets .auto-set {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: #d6ebdc;
  border-radius: 0 0 2px 2px;
  border-top: 1px solid #eaecef;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.58333333rem 2.08333333rem 0.58333333rem 1rem;
}

.m-sportsBet--bets .auto-set > div {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-weight: bold;
}

.m-sportsBet--bets .auto-set > span {
  color: var(--brand-highlight-text);
}

.m-sportsBet--bets .auto-set.disabled > span {
  color: #9ca0ab;
}

.m-sportsBet--bets .auto-set img {
  height: 1rem;
  line-height: 1rem;
  padding-right: 0.41666667rem;
  vertical-align: middle;
  width: 1rem;
}

.m-sportsBet--bets.live .m-bet-list {
  padding-bottom: 1.66666667rem;
  padding-top: 0;
}

.m-sportBets {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-height: calc(100% - 3.66666667rem);
  padding-bottom: 5.66666667rem;
  position: relative;
}

.m-sportBets .f-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.m-sportBets .f-btwn {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.m-sportBets .f-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.m-sportBets .f-grid {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  display: grid;
  width: 100%;
}

.m-sportBets .f-alg-side {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  width: 100%;
}

.m-sportBets .f-alg-side .f-alg-side-item {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
  vertical-align: middle;
}

.m-sportBets .f-alg-side .f-alg-side-item:last-of-type {
  text-align: right;
}

.m-sportBets .f-flex-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
}

.m-sportBets .f-count {
  counter-reset: index;
}

.m-sportBets .f-count-item::before {
  content: counter(index) '.';
  counter-increment: index;
}

.m-sportBets .m-openbet.live-display .top-bar {
  position: fixed;
  z-index: 1;
}

.m-sportBets .m-openbet.live-display .m-bet-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  padding-top: 4.66666667rem;
}

.m-sportBets.m-sportBets-fix {
  padding-bottom: 0;
}

.align-r {
  text-align: right;
}

.open-bet-toast.es-dialog-toast {
  background: #353a45;
  border-color: #353a45;
  border-radius: 1.66666667rem;
  color: #ffffff;
  font-size: 1rem;
}

.open-bet-toast.es-dialog-toast .es-dialog-body .es-dialog-main {
  padding: 0.5rem 0;
}

.m-sportBets .m-t-12 {
  font-size: 1rem;
  line-height: 1;
}

.m-sportBets .m-t-14 {
  font-size: 1rem;
}

.m-sportBets .m-t-16 {
  font-size: 1.33333333rem;
  line-height: 1;
}

.m-sportBets .m-t-19 {
  font-size: 1.58333333rem;
  line-height: 1;
}

.m-sportBets .m-t-20 {
  font-size: 1.66666667rem;
  line-height: 1;
}

.m-sportBets .m-l-23 {
  line-height: 1.91666667rem;
}

.m-sportBets .m-t-l14 {
  line-height: 1.066rem;
}

.m-sportBets .m-t-l16 {
  line-height: 1.33333333rem;
}

.m-sportBets .m-t-l20 {
  line-height: 1.66666667rem;
}

.m-sportBets .m-t-white {
  color: #ffffff;
}

.m-sportBets .m-t-gray {
  color: #9ca0ab;
}

.m-sportBets .m-t-green {
  color: var(--brand-highlight-text);
}

.m-sportBets .m-t-dgreen {
  color: #096b27;
}

.m-sportBets .m-t-lblue {
  color: #3656a3;
}

.m-sportBets .m-t-red {
  color: #e41827;
}

.m-sportBets .m-t-center {
  text-align: center;
}

.m-sportBets .m-t-right {
  text-align: right;
}

.m-sportBets .m-t-bold {
  font-weight: 600;
}

.m-sportBets .m-t-b5 {
  font-weight: 500;
}

.m-sportBets .m-t-mt4 {
  margin-top: 0.33333333rem;
}

.m-sportBets .m-t-ml6 {
  margin-left: 0.5rem;
}

.m-sportBets .m-t-mt18 {
  margin-top: 1.5rem;
}

.m-sportBets .m-t-mv3 {
  margin: 0.16666667rem;
}

.m-sportBets .m-t-mv5 {
  margin: 0.41666667rem;
}

.m-sportBets .m-r-5 {
  margin-right: 0.41666667rem;
}

.m-sportBets .m-r-20 {
  margin-right: 1.66666667rem;
}

.m-sportBets .m-t-ml2 {
  margin-left: 0.16666667rem;
}

.m-sportBets .m-b-5 {
  margin-bottom: 0.41666667rem;
}

.m-sportBets .capitalize {
  text-transform: capitalize;
}

.m-sportBets .m-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-sportBets .nowrap {
  white-space: nowrap;
}

.m-bet-sel .f-flex {
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 1.066rem 0;
}

.m-bet-sel .f-flex:last-of-type {
  border-bottom: none;
}

.m-bet-sel .m-l-left,
.m-bet-sel .m-l-right {
  display: table-cell;
  vertical-align: top;
}

.m-bet-sel .m-l-left {
  width: 5.33333333rem;
}

.m-bet-sel .m-l-left.m-i-suc {
  color: var(--brand-highlight-text);
}

.m-bet-sel .m-l-left.m-i-suc:before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.m-bet-sel .m-l-left.m-i-suc:before {
  font-size: 1.66666667rem;
  line-height: 1;
}

.m-bet-sel .m-market {
  margin-top: 0.5rem;
}

.m-bet-sel .m-aginst {
  padding-top: 0.41666667rem;
  text-decoration: underline;
}

.m-bet-sel .m-icon-banker {
  background: #353a45;
  border-radius: 50%;
  display: inline-block;
  height: 0.91666667rem;
  line-height: 0.91666667rem;
  margin-left: 0.41666667rem;
  text-align: center;
  width: 0.91666667rem;
}

.m-bet-sel .m-icon-banker:before {
  color: #ffffff;
  content: 'B';
  font-size: 0.83333333rem;
  line-height: 1;
}

.m-bet-sel .delayed-icon {
  padding-top: 0.66666667rem;
  width: 1rem;
}

.m-bet-sel .m-live-odds {
  line-height: 2;
}

.m-bet-sel .m-live-odds .m-icon-live {
  background-color: #d6ebdc;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #2c3343;
  font-size: 1rem;
  height: 1.066rem;
  line-height: 1.33333333rem;
  padding: 0.25rem 0.25rem;
  text-align: center;
}

.m-bet-sel .m-live-odds .m-odds {
  color: #353a45;
  display: inline-block;
  font-size: 1rem;
  font-weight: bold;
  margin-left: 0.25rem;
}

.m-bet-sel .m-live-odds .m-odds-desc {
  background: #eaecef;
  color: #9ca0ab;
  display: inline-block;
  font-size: 0.83333333rem;
  font-weight: bold;
  line-height: 1.066rem;
  padding: 0 0.33333333rem;
  text-transform: capitalize;
}

.m-bet-sel .m-live-odds .m-odds--up {
  color: var(--brand-highlight-text);
  line-height: 1;
  margin-left: 0.33333333rem;
}

.m-bet-sel .m-live-odds .m-odds--up :before {
  content: '\e609';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.m-bet-sel .m-live-odds .m-odds--down {
  color: #e41827;
  line-height: 1;
  margin-left: 0.33333333rem;
}

.m-bet-sel .m-live-odds .m-odds--down :before {
  content: '\e605';
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.m-bet-sel .m-score {
  margin-top: 0.41666667rem;
}

.m-opt {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-top: 1px solid #eaecef;
  -webkit-box-sizing: b order-box;
  box-sizing: border-box;
  grid-template-columns: 6rem 1fr;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0.83333333rem 0 1.066rem 0;
}

.m-opt .m-l-right,
.m-opt .m-btn--text {
  display: table-cell;
  vertical-align: middle;
}

.m-sportsBet--detail .m-error-wrap per {
  padding-bottom: 10%;
}

.m-sportsBet--detail .m-error-wrapper .m-btn {
  height: 2.5rem;
  line-height: 2.5rem;
}
</style>

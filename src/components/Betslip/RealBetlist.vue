<template>
  <div class="m-bet-head">
    <div class="m-snap-nav-wrap m-list-bet-type" style="overflow: hidden">
      <ul class="m-snap-nav flex">
        <li
          :class="betSlipType !== 'Combo' && betType === 'Single' ? 'active' : ''"
          @click="couponStore.setBetType('Single')"
          class="m-list-bet-type-item m-snap-nav-item"
          data-op="betslip-multi-tag-single"
        >
          <span data-cms-key="singles">Single</span>
        </li>
        <li
          :class="betSlipType !== 'Combo' && betType === 'Multiple' ? 'active' : ''"
          @click="couponStore.setBetType('Multiple')"
          class="flex flex-center m-list-bet-type-item m-snap-nav-item"
          data-op="betslip-multi-tag-multi"
        >
          <span data-cms-key="multiple">Multiple</span>
        </li>
        <li
          :class="betSlipType === 'Combo' ? 'active' : ''"
          @click="couponStore.setBetType('Combo')"
          class="m-list-bet-type-item m-snap-nav-item"
          data-op="betslip-multi-tag-system"
        >
          <span data-cms-key="system">System</span>
        </li>
      </ul>
      <i class="controls left-controls"></i>
      <i class="controls right-controls"></i>
    </div>
    <!-- Odd Change Notification -->
    <div class="betslip-notification" v-if="!couponStore.coupon.acceptChanges">
      <div class="change-wrong-message">Note: changes in odds or availability</div>
    </div>
  </div>
  <div v-if="betslipSelections.length > 0" class="m-bet-detail-wrap">
    <div class="m-scroll">
      <div id="j_betList" class="m-betslips-outcomes">
        <div class="m-outcomes-list">
          <BetListEvent
            v-for="(selection, index) in betslipSelections"
            :key="index"
            :selection="selection"
            :betSlipType="betSlipType"
            :betType="betType"
            :active-selection-id="activeSelectionInput"
            @on-selection-input="setActiveSelectionInput"
            @toggle-betslip="$emit('toggle-betslip')"
          >
          </BetListEvent>
        </div>
      </div>

      <BetListStake
        @toggle-show="toggleShow"
        @toggle-betslip="$emit('toggle-betslip')"
        @book-bet="bookBet"
        :betSlipType="betSlipType"
        :betType="betType"
        :isSimulate="betslipMode"
      ></BetListStake>
    </div>
    <Transition>
      <div v-if="(show && !betslipLoading) || (!show && betslipLoading)">
        <div class="confirm-overlap"></div>
        <div v-if="show" class="confirm-wrap real-theme">
          <div class="m-flexibet-confirm confirm">
            <div class="about-to-pay">
              <span>Confirm to Pay</span><span>&nbsp;</span>
              <div>
                <div class="stake-num">NGN {{ totalStake }}</div>
              </div>
            </div>
            <div class="blank-area"></div>
          </div>
          <div class="button-wrap">
            <button @click="toggleShow" class="af-button flexibet-cancel af-button--primary">
              <span><span data-cms-key="cancel">Cancel </span></span>
            </button>
            <button class="af-button flexibet-confirm af-button--primary" @click.prevent="placeBet">
              <span><span data-cms-key="confirm">Confirm</span></span>
            </button>
          </div>
        </div>
        <!-- Place Bet Submit Modal -->
        <Transition>
          <div v-if="!show && betslipLoading" class="confirm-wrap real-theme">
            <div class="submit real-theme">
              <span style="color: #fff"> Submitting </span>
            </div>
          </div>
        </Transition>
        <!-- Place Bet Submit Modal -->
      </div>
    </Transition>
  </div>
  <BetlistBookingCode v-else></BetlistBookingCode>
</template>

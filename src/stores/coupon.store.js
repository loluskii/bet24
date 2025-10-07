import { defineStore } from 'pinia'
// import _ from 'lodash'
import { useUsersStore } from "@/stores";
import emitter from "../plugins/emitter";
import { formatNumber } from "@/helpers";
import CouponCalculation from "@/helpers/coupon-calculation.js";
import {
  calculateWinnings,
  groupSelections,
  groupTournament,
  calculateTotalOdds,
  checkBetType,
  checkIfHasLive,
  getDataFromPayload,
  calculateBonus,
  getSplitProps,
  placeBet2,
  bookBet2,
  CLIENT_ID
} from '@/helpers'
import { useMqttService } from '@/composables/useMqtt'

const couponCalculation = new CouponCalculation()
const WTH_PERC = import.meta.env.VITE_WTH_PERC
const { subscribe, unsubscribe } = useMqttService()

export const useCouponStore = defineStore({
  id: 'coupon',
  state: () => ({
    betPlaced: null,
    loadedCoupon: null,
    confirm: false,
    sportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    isBetslipLoading: false,
    isBetslipBooking: false,
    mode: 'real',
    isSimulating: false,
    coupon: {
      acceptChanges: true,
      selections: [],
      combos: [],
      totalOdds: 1,
      maxBonus: 0,
      minBonus: 0,
      grossWin: 0,
      maxWin: 0,
      minWin: 0,
      stake: 100,
      totalStake: 100,
      minOdds: 1,
      maxOdds: 1,
      wthTax: 0,
      exciseDuty: 0,
      bonusId: null,
      useBonus: false,
      useCashback: false,
      source: 'mobile'
    },
    activeSubscriptions: [] // Will store objects with topic and unsubscribe function
  }),
  getters: {
    betslipMode: (state) => state.mode === 'sim'
  },
  actions: {
    manageSubscription(selection, isAdding = true) {
      try {
        if (!selection) {
          console.warn('📊 Betslip: Cannot manage subscription - selection is null/undefined')
          return
        }

        const matchId = String(selection.matchId || selection.fixture?.matchID)
        if (!matchId) {
          console.warn('📊 Betslip: Cannot manage subscription - matchId is missing')
          return
        }

        const type = selection.type
        if (!type) {
          console.warn('📊 Betslip: Cannot manage subscription - type is missing')
          return
        }

        const oddsChangeTopic = `feeds/${type}/odds_change/${matchId}`
        const betStopTopic = `feeds/${type}/bet_stop/${matchId}`

        if (isAdding) {
          if (!this.activeSubscriptions.some((sub) => String(sub.matchId) === matchId)) {
            const unsubscribeOdds = subscribe(oddsChangeTopic, (data) => {
              this.handleOddsChange(data, selection)
            })
            const unsubscribeBetStop = subscribe(betStopTopic, (data) => {
              this.handleBetStop(data, selection)
            })
            this.activeSubscriptions.push({
              matchId,
              oddsChangeTopic,
              betStopTopic,
              unsubscribeOdds,
              unsubscribeBetStop
            })
          }
        } else {
          const hasOtherSelectionsFromMatch = this.coupon.selections.some(
            (s) =>
              String(s.matchId || s.fixture?.matchID) === matchId &&
              s.selectionId !== selection.selectionId
          )
          if (!hasOtherSelectionsFromMatch) {
            const subscription = this.activeSubscriptions.find(
              (sub) => String(sub.matchId) === matchId
            )
            if (subscription) {
              try {
                subscription.unsubscribeOdds()
                subscription.unsubscribeBetStop()
              } catch (error) {
                console.error('📊 Betslip: Error unsubscribing from topics:', error)
              }
              this.activeSubscriptions = this.activeSubscriptions.filter(
                (sub) => String(sub.matchId) !== matchId
              )
            }
          }
        }
      } catch (error) {
        console.error('📊 Betslip: Error in manageSubscription:', error)
      }
    },

    // Handle incoming odds changes
    handleOddsChange(data, selection) {
      if (!data || !data.markets) return

      const matchId = selection.matchId || selection.fixture?.matchID
      const dataMatchId = data.event_id || data.match_id

      // If the data doesn't match our event, ignore it
      if (dataMatchId && String(dataMatchId) !== String(matchId)) {
        // console.log('📊 Betslip: Ignoring odds change for match ID', dataMatchId, 'our match ID is', matchId);
        return
      }

      // console.log('📊 Betslip: Processing odds change for match ID', matchId);

      const markets = data.markets || []
      let updatedAnySelection = false

      if (markets.length > 0) {
        // Find all selections from this match
        const matchSelections = this.coupon.selections.filter(
          (sel) =>
            String(sel.matchId) === String(matchId) ||
            String(sel.fixture?.matchID) === String(matchId)
        )

        matchSelections.forEach((selection) => {
          const marketId = selection.marketId || selection.market_id
          const outcomeId = selection.outcomeId || selection.odd_id

          // Find the market
          const market = markets.find((m) => String(m.id) === String(marketId))
          if (market && market.outcomes) {
            // Find the outcome
            const outcome = market.outcomes.find((o) => String(o.id) === String(outcomeId))

            if (outcome) {
              // console.log('📊 Betslip: Found outcome', outcome);
              if (!outcome.active) {
                // If outcome is not active, suspend the selection
                // console.log(`📊 Betslip: Outcome not active, suspending selection for match ID ${matchId}`);
                selection.suspended = true
                selection.unavailable = true
                updatedAnySelection = true
              } else {
                // If outcome is active, make sure it's not suspended
                if (selection.suspended || selection.unavailable) {
                  // console.log(`📊 Betslip: Reactivating previously suspended selection for match ID ${matchId}`);
                  selection.suspended = false
                  selection.unavailable = false
                  updatedAnySelection = true
                }

                // Update odds if they've changed
                if (outcome.odds !== selection.odds) {
                  // console.log(`📊 Betslip: Updating odds from ${selection.odds} to ${outcome.odds} for match ID ${matchId}`);
                  selection.odds = outcome.odds
                  selection.changed = true
                  updatedAnySelection = true

                  // Reset the changed flag after 5 seconds
                  setTimeout(() => {
                    selection.changed = false

                    // Force a reactivity update
                    this.updateWinnings({
                      stake: this.coupon.totalStake,
                      id: 'all'
                    })
                  }, 5000)
                }
              }
            }
          }
        })

        // Only update winnings if we actually changed any selections
        if (updatedAnySelection) {
          this.updateWinnings({
            stake: this.coupon.totalStake,
            id: 'all'
          })
        }
      }
    },

    // Handle bet stop messages
    handleBetStop(data, selection) {
      const matchId = selection.matchId || selection.fixture?.matchID
      const dataMatchId = data.event_id || data.match_id

      if (dataMatchId && String(dataMatchId) !== String(matchId)) {
        // console.log(`📊 Betslip: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`);
        return
      }

      // console.log(`⚠️ BET STOP: Processing bet stop for match ID ${matchId}`);

      // Find all selections from this match
      const matchSelections = this.coupon.selections.filter(
        (sel) =>
          String(sel.matchId) === String(matchId) ||
          String(sel.fixture?.matchID) === String(matchId)
      )

      if (matchSelections.length > 0) {
        // console.log(`⚠️ BET STOP: Suspending ${matchSelections.length} selections in betslip for match ID ${matchId}`);

        matchSelections.forEach((selection) => {
          selection.suspended = true
          selection.unavailable = true
          selection.odds = 0
        })

        // Force a reactivity update
        this.updateWinnings({
          stake: this.coupon.totalStake,
          id: 'all'
        })
      }
    },

    async addToCoupon(selection) {
      const couponPayload = selection

      const globalVars = this.SportsbookGlobalVariable
      let type = couponPayload.type

      const data = getDataFromPayload(couponPayload)

      let couponData = { ...this.coupon }
      const bonusList = this.sportsbookBonusList

      this.coupon.event_type = type

      if (!this.coupon.selections.length) {
        //add selection to selections list
        this.coupon.selections.push(data)

        this.coupon.bet_type = 'Single'
        this.coupon.betslip_type = 'Single'
        this.coupon.totalOdds = (parseFloat(this.coupon.totalOdds) * parseFloat(data.odds)).toFixed(
          2
        )

        //calculate and get pot winnings with bonus
        const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
        // console.log(winnings)
        this.coupon.maxWin = winnings.maxWin
        this.coupon.maxBonus = winnings.maxBonus
        this.coupon.wthTax = winnings.wthTax
        this.coupon.grossWin = winnings.grossWin
        this.coupon.fixtures = groupSelections(this.coupon.selections)
        this.coupon.tournaments = groupTournament(this.coupon.selections)
        // check if event is live
        if (type === 'live') this.coupon.hasLive = true
      } else {
        this.coupon.betslip_type = 'Multiple'
        this.coupon.bet_type = 'Multiple'

        for (let i = 0; i < couponData.selections.length; i++) {
          if (couponData.selections[i].matchId === data.matchId) {
            //add selection to selections list
            this.coupon.selections.push(data)
            // const bonus = calculateBonus(this.coupon, globalVars, bonusList);
            // console.log(bonus, "bon");
            //group selections by match
            this.coupon.tournaments = groupTournament(this.coupon.selections)
            this.coupon.fixtures = groupSelections(couponData.selections)

            // con
            //bet type
            this.coupon.bet_type = 'Split'
            this.coupon.betslip_type = 'Combo'

            const splitProps = await getSplitProps(this.coupon)
            //calculate winnings
            let minStake =
              splitProps.minStake !== undefined && splitProps.minStake !== ''
                ? splitProps.minStake
                : 0
            const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(minStake)
            const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(minStake)

            console.log(minWinnings, maxWinnings)
            //calculate bonus
            this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

            this.coupon.minGrossWin = parseFloat(splitProps.minBonus) + minWinnings
            this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
            this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
            this.coupon.grossWin = parseFloat(splitProps.maxBonus) + maxWinnings
            this.coupon.wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
            this.coupon.maxWin = this.coupon.grossWin - couponData.wthTax

            return
          }
        }

        //add selection to selections list
        this.coupon.selections.push(data)
        // const bonus = calculateBonus(this.coupon, globalVars, bonusList);
        // console.log(bonus, "bon");

        this.coupon.totalOdds = (parseFloat(this.coupon.totalOdds) * parseFloat(data.odds)).toFixed(
          2
        )

        //group selections by match
        this.coupon.tournaments = groupTournament(couponData.selections)
        this.coupon.fixtures = groupSelections(couponData.selections)
        //check bet type
        this.coupon.bet_type = checkBetType(this.coupon.fixtures)
        // check if event is live

        if (type === 'live') this.coupon.hasLive = true

        if (this.coupon.bet_type === 'Split') {
          const splitProps = await getSplitProps(this.coupon)

          this.coupon.minStake = parseFloat(splitProps.stake) / splitProps.noOfCombos

          //calculate winnings
          const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(this.coupon.minStake)
          const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(this.coupon.minStake)
          //calculate bonus
          this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

          this.coupon.minGrossWin = parseFloat(this.coupon.minBonus) + minWinnings
          this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
          this.coupon.grossWin = parseFloat(splitProps.maxBonus) + maxWinnings
          const wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.wthTax = wthTax < 1 ? 0 : wthTax
          this.coupon.maxWin = this.coupon.grossWin - this.coupon.wthTax

          return
        } else {
          const calculatedGroup = couponCalculation.calcCombinations(this.coupon)
          this.coupon.combos = calculatedGroup.Groups
          //calculate and get pot winnings with bonus
          if (this.coupon.bet_type === 'Combo') {
            // dispatch({ type: SET_COUPON_DATA, payload: couponData });
            if (this.coupon.Groupings && couponData.Groupings.length) {
              // updateComboWinningsFromTotal()
            }
          } else {
            const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
            // console.log(winnings);
            this.coupon.maxWin = winnings.maxWin
            this.coupon.maxBonus = winnings.maxBonus
            this.coupon.wthTax = winnings.wthTax
            this.coupon.grossWin = winnings.grossWin
          }
        }
      }

      // After successfully adding selection, subscribe to its updates
      this.manageSubscription(selection, true)
    },
    async removeSelection(id) {
      const globalVars = this.SportsbookGlobalVariable
      const res = this.coupon.selections ? [...this.coupon.selections] : []
      const data = res.find((item) => item.selectionId === id || item.id === id)
      // Call manageSubscription after updating selections array
      if (data) {
        this.manageSubscription(data, false)
      }

      const bonusList = this.sportsbookBonusList
      const newSelection = this.coupon.selections.filter(
        (item) => item.selectionId !== id && item.id !== id
      )

      this.coupon.selections = newSelection

      if (this.coupon.selections.length > 0) {
        const prevBetType = this.coupon.bet_type
        this.coupon.tournaments = groupTournament(this.coupon.selections)
        this.coupon.fixtures = groupSelections(this.coupon.selections)

        if (this.coupon.selections.length === 1) {
          this.coupon.bet_type = 'Single'
        } else {
          this.coupon.bet_type = checkBetType(this.coupon.fixtures)
        }

        if (this.coupon.bet_type === 'Split') {
          const splitProps = await getSplitProps(this.coupon)
          //calculate winnings
          const minWinnings = parseFloat(splitProps.minOdds) * parseFloat(splitProps.minStake)
          const maxWinnings = parseFloat(splitProps.maxOdds) * parseFloat(splitProps.minStake)
          //calculate bonus
          this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)

          this.coupon.minGrossWin = parseFloat(this.coupon.minBonus) + minWinnings
          this.coupon.minWTH = ((this.coupon.minGrossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.minWin = this.coupon.minGrossWin - this.coupon.minWTH
          this.coupon.grossWin = parseFloat(this.coupon.maxBonus) + maxWinnings
          this.coupon.wthTax = ((this.coupon.grossWin - this.coupon.stake) * WTH_PERC) / 100
          this.coupon.maxWin = this.coupon.grossWin - this.coupon.wthTax
        } else {
          if (prevBetType === 'Split') {
            this.coupon.totalOdds = calculateTotalOdds(
              this.coupon.selections.filter(
                (s) => !s.suspended && !s.unavailable && parseFloat(s.odds) > 1
              )
            )
          } else {
            if (!data.suspended && !data.unavailable && parseFloat(data.odds) > 1) {
              this.coupon.totalOdds = (
                parseFloat(this.coupon.totalOdds) / parseFloat(data.odds)
              ).toFixed(2)
            }
            if (isNaN(this.coupon.totalOdds) || this.coupon.totalOdds <= 0) {
              this.coupon.totalOdds = calculateTotalOdds(
                this.coupon.selections.filter(
                  (s) => !s.suspended && !s.unavailable && parseFloat(s.odds) > 1
                )
              )
            }
          }
          this.coupon.minBonus = calculateBonus(this.coupon, globalVars, bonusList)
          this.coupon.hasLive = checkIfHasLive(this.coupon.selections)

          const calculatedGroup = couponCalculation.calcCombinations(this.coupon)
          this.coupon.combos = calculatedGroup.Groups
          // couponData.combos = await getCombos(couponData);
          //calculate and get pot winnings with bonus
          if (this.coupon.bet_type === 'Combo') {
            // dispatch({ type: SET_COUPON_DATA, payload: coupondata })
            // if (coupondata.Groupings && coupondata.Groupings.length) {
            //   const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
            //   coupondata = coupondata.updateFromCalculatedCoupon(coupondata, calculatedCoupon);
            //   // update combos with max win
            //   coupondata.combos.forEach(combo => {
            //     for (let i = 0; i < coupondata.Groupings.length; i++) {
            //       if (combo.Grouping === coupondata.Groupings[i].Grouping) {
            //         combo.minWIn = coupondata.Groupings[i].minWin;
            //         combo.maxWin = coupondata.Groupings[i].maxWin;
            //         combo.Stake = coupondata.Groupings[i].Stake;
            //       }
            //     }
            //   })
            //   setTimeout(() => {
            //     return dispatch(updateComboWinningsFromTotal());
            //   }, 500);
            // }
          } else {
            const winnings = calculateWinnings(this.coupon, globalVars, bonusList)
            this.coupon.maxWin = winnings.maxWin
            this.coupon.maxBonus = winnings.maxBonus
            this.coupon.wthTax = winnings.wthTax
            this.coupon.grossWin = winnings.grossWin
          }
        }
      } else {
        const coupon = {
          acceptChanges: true,
          selections: [],
          combos: [],
          totalOdds: 1,
          maxBonus: 0,
          minBonus: 0,
          grossWin: 0,
          maxWin: 0,
          minWin: 0,
          stake: 100,
          totalStake: 100,
          minOdds: 1,
          maxOdds: 1,
          wthTax: 0,
          exciseDuty: 0,
          useBonus: false,
          useCashback: false,
          source: 'mobile'
        }
        this.coupon = coupon
      }
    },
    updateWinnings(payload) {
      const { stake, id } = payload
      const globalVars = { ...this.SportsbookGlobalVariable }
      const coupondata = JSON.parse(JSON.stringify(this.coupon))
      const bonusList = this.sportsbookBonusList

      // Filter out suspended or unavailable selections
      const activeSelections = this.coupon.selections.filter((selection) => {
        return !selection.suspended && !selection.unavailable && parseFloat(selection.odds) > 1
      })

      if (stake === '') {
        this.coupon.stake = ''
        this.coupon.totalStake = ''

        if (this.coupon.betslip_type == 'Single') {
          if (id === 'all') {
            // Update only active selections
            const newSelections = this.coupon.selections.map((item) => {
              const newItem = Object.assign({}, item)
              // Only clear stake for active selections
              if (!newItem.suspended && !newItem.unavailable && parseFloat(newItem.odds) > 1) {
                newItem.stake = ''
              }
              return newItem
            })
            this.coupon.selections = newSelections
            return
          }

          let totalStake = 0
          let minWin = []
          let maxWin = 0

          // Update selections but only calculate for active ones
          const newSelections = this.coupon.selections.map((item) => {
            const newItem = Object.assign({}, item)

            // Only update the specific selection if it's active
            if (
              item.selectionId === id &&
              !item.suspended &&
              !item.unavailable &&
              parseFloat(item.odds) > 1
            ) {
              newItem.stake = 0
            }

            // Only include active selections in calculations
            if (!newItem.suspended && !newItem.unavailable && parseFloat(newItem.odds) > 1) {
              totalStake += parseFloat(newItem.stake || 0)
              if (newItem.stake !== 0) {
                minWin.push(newItem.odds * newItem.stake)
                maxWin += newItem.odds * parseFloat(newItem.stake)
              }
            }

            return newItem
          })

          this.coupon.selections = newSelections
          this.coupon.totalStake = totalStake
          this.coupon.minWin = minWin.length > 0 ? Math.min(...minWin) : 0
          this.coupon.maxWin = maxWin
        }
      }

      if (stake !== '') {
        if (this.coupon.betslip_type === 'Single' || this.coupon.bet_type === 'Single') {
          let maxWin = 0
          let minWin = []
          let totalStake = 0

          // Only use active selections for odds calculations
          const activeOdds = activeSelections.map((s) => parseFloat(s.odds))
          const maxOdds = activeOdds.length > 0 ? Math.max(...activeOdds) : 0
          const minOdds = activeOdds.length > 0 ? Math.min(...activeOdds) : 0

          if (id === 'all') {
            const stakePerBet = parseFloat(stake)
            this.coupon.stake = stake // set new total stake
            this.coupon.totalStake = stake * this.coupon.selections.length

            // Update all selections but only calculate for active ones
            const updatedSelections = this.coupon.selections.map((selection) => {
              const updatedSelection = { ...selection }

              // Only set stake for active selections
              if (
                !updatedSelection.suspended &&
                !updatedSelection.unavailable &&
                parseFloat(updatedSelection.odds) > 1
              ) {
                updatedSelection.stake = stakePerBet
                maxWin += updatedSelection.odds * stakePerBet
                minWin.push(updatedSelection.odds * stakePerBet)
                totalStake += stakePerBet
              } else {
                updatedSelection.stake = 0
              }

              return updatedSelection
            })

            this.coupon.selections = updatedSelections
            this.coupon.stake = stake
            this.coupon.maxWin = maxWin
            this.coupon.minWin = minWin.length > 0 ? Math.min(...minWin) : 0
            this.coupon.totalStake = totalStake
          } else if (id === 'single') {
            // For single selection bet
            const selection = this.coupon.selections[0]

            // Only calculate if selection is active
            if (!selection.suspended && !selection.unavailable && parseFloat(selection.odds) > 1) {
              this.coupon.stake = stake
              this.coupon.totalStake = parseFloat(stake)
              this.coupon.maxWin = selection.odds * parseFloat(stake)
            } else {
              this.coupon.stake = stake
              this.coupon.totalStake = parseFloat(stake)
              this.coupon.maxWin = 0
            }
          } else {
            // For updating a specific selection
            const index = this.coupon.selections.findIndex((i) => i.selectionId === id)

            if (index !== -1) {
              const updatedSelections = [...this.coupon.selections]

              // Only update stake if selection is active
              if (
                !updatedSelections[index].suspended &&
                !updatedSelections[index].unavailable &&
                parseFloat(updatedSelections[index].odds) > 1
              ) {
                updatedSelections[index].stake = parseFloat(stake)
              }

              // Calculate totals using only active selections
              updatedSelections.forEach((selection) => {
                if (
                  !selection.suspended &&
                  !selection.unavailable &&
                  parseFloat(selection.odds) > 1 &&
                  parseFloat(selection.stake) > 0
                ) {
                  maxWin += selection.odds * parseFloat(selection.stake)
                  minWin.push(selection.odds * selection.stake)
                  totalStake += parseFloat(selection.stake)
                }
              })

              this.coupon.selections = updatedSelections
              this.coupon.stake = ''
              this.coupon.maxWin = maxWin
              this.coupon.minWin = minWin.length > 0 ? Math.min(...minWin) : 0
              this.coupon.totalStake = totalStake
            }
          }

          this.coupon.totalOdds = parseFloat(maxOdds).toFixed(2)
          this.coupon.minOdds = parseFloat(minOdds).toFixed(2)
        } else {
          // For multiple bets, only use active selections
          if (activeSelections.length === 0) {
            // No valid selections for multiple bet
            this.coupon.totalOdds = '0.00'
            this.coupon.totalStake = parseFloat(stake) // Keep the stake as entered
            this.coupon.exciseDuty = 0
            this.coupon.stake = this.coupon.totalStake
            this.coupon.maxWin = 0
            this.coupon.maxBonus = 0
            this.coupon.wthTax = 0
            this.coupon.grossWin = 0
          } else {
            // Calculate total odds using only active selections
            this.coupon.totalOdds = calculateTotalOdds(activeSelections).toFixed(2)
            this.coupon.totalStake = parseFloat(stake)
            this.coupon.exciseDuty = (this.coupon.totalStake * 0) / 100
            this.coupon.stake = this.coupon.totalStake - this.coupon.exciseDuty

            // Create a modified coupon with only active selections for winnings calculation
            const activeCoupon = {
              ...this.coupon,
              selections: activeSelections
            }

            // Calculate Winnings using only active selections
            const winnings = calculateWinnings(activeCoupon, globalVars, bonusList)
            this.coupon.maxWin = winnings.maxWin
            this.coupon.maxBonus = winnings.maxBonus
            this.coupon.wthTax = winnings.wthTax
            this.coupon.grossWin = winnings.grossWin
          }
        }
      }
    },
    setBetType(type) {
      const betslip_type = type
      this.coupon.betslip_type = betslip_type
      this.coupon.bet_type = betslip_type
      const selections = this.coupon.selections ? [...this.coupon.selections] : []
      this.coupon.stake = 0
      this.coupon.totalStake = 0
      this.coupon.minStake = 0
      this.coupon.minWin = 0
      this.coupon.minBonus = 0
      this.coupon.maxWin = 0
      this.coupon.maxBonus = 0
      const newSelections = selections.map((item) => {
        const newItem = Object.assign({}, item)
        newItem.stake = ''
        return newItem
      })
      this.coupon.selections = newSelections
    },
    async placeBet(e, type, bonusId) {
      let ele = e.target
      const coupondata = { ...this.coupon }
      const usersStore = useUsersStore()
      if (usersStore.currentUser) {
        coupondata.userId = usersStore.currentUser.id
        coupondata.username = usersStore.currentUser.username
        coupondata.userRole = usersStore.currentUser.role
      }
      coupondata.clientId = CLIENT_ID

      if (type === 'bet' && coupondata.stake === 0) {
        alert('error. stake must be greater than 0')
        return
      }
      if (type === 'bet') {
        this.isBetslipLoading = true
        coupondata.isBooking = this.mode === 'real' ? 0 : 2
        if (bonusId) {
          coupondata.bonusId = bonusId
          coupondata.useBonus = true
        }

        delete coupondata.combos
        delete coupondata.fixtures
        delete coupondata.tournaments

        try {
          const res = await placeBet2(coupondata)
          this.isBetslipLoading = false
          return res
        } catch (error) {
          console.log(error)
          emitter.emit('showErrorMessage', error)
        }
      } else if (type == 'book') {
        try {
          coupondata.isBooking = 1
          const res = await bookBet2(coupondata)
          this.isBetslipLoading = false
          return res
        } catch (error) {
          ele.disabled = false
          ele.innerHTML = 'Place Bet'
          // console.error(error)
          emitter.emit('showErrorMessage', error)
        }
      }
    },
    clearBetslip() {
      try {
        // Clean up all MQTT subscriptions using manageSubscription
        if (Array.isArray(this.coupon.selections)) {
          this.coupon.selections.forEach((selection) => {
            if (selection) {
              this.manageSubscription(selection, false)
            }
          })
        }
        this.activeSubscriptions = []

        // Reset coupon state
        const coupon = {
          acceptChanges: false,
          selections: [],
          combos: [],
          totalOdds: 1,
          maxBonus: 0,
          minBonus: 0,
          grossWin: 0,
          maxWin: 0,
          minWin: 0,
          stake: 100,
          totalStake: 100,
          minOdds: 1,
          maxOdds: 1,
          wthTax: 0,
          exciseDuty: 0,
          useBonus: false,
          useCashback: false,
          source: 'mobile'
        }

        this.coupon = coupon
      } catch (error) {
        console.error('📊 Betslip: Error in clearBetslip:', error)
        // Still try to reset the coupon state even if cleanup fails
        this.coupon = {
          acceptChanges: false,
          selections: [],
          combos: [],
          totalOdds: 1,
          maxBonus: 0,
          minBonus: 0,
          grossWin: 0,
          maxWin: 0,
          minWin: 0,
          stake: 100,
          totalStake: 100,
          minOdds: 1,
          maxOdds: 1,
          wthTax: 0,
          exciseDuty: 0,
          useBonus: false,
          useCashback: false,
          source: 'mobile'
        }
        this.activeSubscriptions = []
      }
    },
    resubscribeToAllSelections() {
      try {
        // Clear any existing subscriptions that might be invalid
        this.activeSubscriptions = []

        // Resubscribe to all selections in the betslip
        this.coupon.selections.forEach((selection) => {
          if (selection) {
            this.manageSubscription(selection, true)
          }
        })

        // console.log('📊 Betslip: Successfully resubscribed to all selections')
      } catch (error) {
        console.error('📊 Betslip: Error resubscribing to selections:', error)
      }
    },
    updateComboWinnings(val, combo) {
      let coupondata = { ...this.coupon };
      let stake = val;
      if (stake === '') {
        stake = 0;
      } else {
        stake = val
      }

      if(!combo) {// update all combo stake
        let total = 0
        coupondata.totalStake = stake;
        coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
        const Groupings = [];
        // get minimum stake per combo
        let minStake = parseFloat(coupondata.stake) / coupondata.combos.length;
        let comboLength = 0;

        for (let x = 0; x < coupondata.combos.length; x++) {
          coupondata.combos[x].Stake = parseFloat(stake);;
          comboLength += coupondata.combos[x].Grouping;
          Groupings.push(coupondata.combos[x]);
        }

        coupondata.comboSelection = comboLength;
        coupondata.noOfCombos = coupondata.combos.length;
        coupondata.Groupings = Groupings;
        coupondata.minStake = parseFloat(coupondata.stake) / comboLength;

        if (coupondata.Groupings && coupondata.Groupings.length) {
          const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, this.sportsbookBonusList, this.SportsbookGlobalVariable.MinBonusOdd);
          coupondata = couponCalculation.updateFromCalculatedCoupon(coupondata, calculatedCoupon, this.SportsbookGlobalVariable, this.sportsbookBonusList);
          // update combos with max win
          coupondata.combos.forEach((combo) => {
            for (let i = 0; i < coupondata.Groupings.length; i++) {
              if (combo.Grouping === coupondata.Groupings[i].Grouping) {
                combo.minWin = coupondata.Groupings[i].minWin;
                combo.maxWin = coupondata.Groupings[i].maxWin;
                combo.Stake = parseFloat(stake);
                total += parseFloat(combo.Stake) * parseFloat(coupondata.Groupings[i].Combinations);
              }
            }
          });
        }

        coupondata.totalStake = total;
        coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        this.coupon = coupondata;

      } else {// update single combo stake

        combo.Stake = parseFloat(stake);

        if (!coupondata.Groupings || !coupondata.Groupings.length) {
          coupondata.Groupings = [combo];
        } else {
          const groupIndex = coupondata.Groupings.findIndex(function (g) { return g.Grouping === combo.Grouping; });
          if (groupIndex === -1) {
            coupondata.Groupings = [...coupondata.Groupings, combo];
          } else {//update combo stake
            const groupings = [...coupondata.Groupings]
            groupings[groupIndex] = combo;
            coupondata.Groupings = groupings;
          }
        }

        const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, this.sportsbookBonusList, this.SportsbookGlobalVariable.MinBonusOdd);
        coupondata = couponCalculation.updateFromCalculatedCoupon(coupondata, calculatedCoupon, this.SportsbookGlobalVariable, this.sportsbookBonusList);
        let total = 0;

        const combos = []

        // update combos with max win
        coupondata.combos.forEach((item) => {
          let comboItem = { ...item };
          for (let i = 0; i < coupondata.Groupings.length; i++) {
            if (comboItem.Grouping === coupondata.Groupings[i].Grouping) {
              comboItem.minWin = formatNumber(coupondata.Groupings[i].minWin);
              comboItem.maxWin = formatNumber(coupondata.Groupings[i].maxWin);
              comboItem.Stake = coupondata.Groupings[i].Stake;
              comboItem.checked = true;
              total += parseFloat(comboItem.Stake) * parseFloat(coupondata.Groupings[i].Combinations);
            }
          }
          combos.push(comboItem);
        });
        coupondata.combos = combos;
        coupondata.totalStake = total;
        coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        this.coupon = coupondata;
      }
    }
  },
  persist: {
    storage: localStorage,
    afterRestore: (ctx) => {
      // Resubscribe to MQTT topics for all selections in the betslip
      if (ctx.store.coupon.selections && ctx.store.coupon.selections.length > 0) {
        // console.log('📊 Betslip: Resubscribing to MQTT topics for all selections after page refresh')
        ctx.store.resubscribeToAllSelections()
      }
    }
  }
})

import { defineStore } from 'pinia'
import { getTopBets, getFixturesByTournamentId,FEED_TOGGLE } from '@/helpers'

export const useUtilsStore = defineStore({
  id: 'utils',
  state: () => ({
    clickId: null,
    brandName: '',
    sportID: 1,
    live: false,
    banners: [],
    sportsMenu: [],
    marketGroups: [],
    activeLiveMarkets: [],
    homeCarousel: [],
    SportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    showBetslipCount: true,
    showFooter: true,
    showMobileNavigation: true,
    errorMessage: null,
    categoriesList: [],
    bonusModalShown: null,
    popupDialogShown: null,
    previousRoute: null,
    // Featured games state
    featuredTournaments: [],
    featuredTournamentGames: [],
    featuredLastFetchTime: null,
    featuredIsLoading: false,
    featuredError: null,
    activeFeaturedTournament: null,
    isFetchingTournamentGames: false,
    banksList: []
  }),

  getters: {
    hasFeaturedData: (state) => state.featuredTournaments.length > 0,
    isFeaturedStale: (state) => {
      if (!state.featuredLastFetchTime) return true
      const now = Date.now()
      return now - state.featuredLastFetchTime > 300000 // 5 minutes
    }
  },

  actions: {
    async fetchFeaturedGames() {
      if(!FEED_TOGGLE) return;
      // If we have fresh data, don't fetch again
      if (this.hasFeaturedData && !this.isFeaturedStale) {
        return
      }

      // Prevent concurrent fetches
      if (this.featuredIsLoading || this.isFetchingTournamentGames) {
        return
      }

      this.featuredIsLoading = true
      this.featuredError = null

      try {
        const response = await getTopBets()

        if (response?.data) {
          // Process tournaments
          const uniqueTournamentIds = new Set()
          const uniqueTournaments = []

          for (const tournament of response.data) {
            if (!uniqueTournamentIds.has(tournament.tournamentID)) {
              uniqueTournamentIds.add(tournament.tournamentID)
              uniqueTournaments.push(tournament)
            }
          }

          this.featuredTournaments = uniqueTournaments.sort(
            (a, b) => a.tournamentID - b.tournamentID
          )
          this.featuredLastFetchTime = Date.now()

          // Set active tournament to the first one if not already set
          if (!this.activeFeaturedTournament && this.featuredTournaments.length > 0) {
            this.activeFeaturedTournament = this.featuredTournaments[0].tournamentID
          }

          // Fetch games for each tournament
          await this.fetchTournamentGames()
        }
      } catch (error) {
        console.error('Error fetching featured games:', error)
        this.featuredError = error.message
      } finally {
        this.featuredIsLoading = false
      }
    },

    async fetchTournamentGames() {
      // Prevent concurrent fetches
      if (this.isFetchingTournamentGames) {
        return
      }

      this.isFetchingTournamentGames = true
      const CONCURRENCY_LIMIT = 3
      const chunks = []

      for (let i = 0; i < this.featuredTournaments.length; i += CONCURRENCY_LIMIT) {
        chunks.push(this.featuredTournaments.slice(i, i + CONCURRENCY_LIMIT))
      }

      // Clear existing games before fetching new ones
      this.featuredTournamentGames = []

      try {
        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async (tournament) => {
              try {
                const games = await getFixturesByTournamentId(
                  tournament.tournamentID,
                  tournament.sportID
                )

                if (!games?.fixtures?.length || !games?.markets?.length) {
                  // Early return if no valid data
                  const index = this.featuredTournaments.findIndex(
                    (x) => x.tournamentID === tournament.tournamentID
                  )
                  if (index !== -1) {
                    this.featuredTournaments.splice(index, 1)
                  }
                  return
                }

                if (games?.fixtures?.length && games?.markets?.length) {
                  // Take only first 5 fixtures
                  const tournamentGames = {
                    tournamentID: tournament.tournamentID,
                    fixtures: games.fixtures.slice(0, 5),
                    markets: games.markets
                  }

                  this.featuredTournamentGames.push(tournamentGames)
                }
              } catch (error) {
                console.error(`Error processing tournament ${tournament.tournamentID}:`, error)
              }
            })
          )
        }
      } finally {
        this.isFetchingTournamentGames = false
      }
    },

    setActiveFeaturedTournament(tournamentId) {
      this.activeFeaturedTournament = tournamentId
    },

    clearFeaturedData() {
      this.featuredTournaments = []
      this.featuredTournamentGames = []
      this.featuredLastFetchTime = null
      this.featuredError = null
      this.activeFeaturedTournament = null
    },

    handleOddsChange(data) {
      if (!data || !data.markets) return

      // Find and update the fixture in featuredTournamentGames
      this.featuredTournamentGames = this.featuredTournamentGames.map((tournament) => {
        const updatedFixtures = tournament.fixtures.map((fixture) => {
          if (String(fixture.matchID) === String(data.matchID)) {
            // Update outcomes for the matching market
            const updatedOutcomes = fixture.outcomes.map((outcome) => {
              const market = data.markets.find((m) => m.id === outcome.marketID)
              if (market && market.outcomes) {
                const updatedOutcome = market.outcomes.find(
                  (o) => String(o.id) === String(outcome.outcomeID)
                )
                if (updatedOutcome) {
                  return {
                    ...outcome,
                    odds: updatedOutcome.odds,
                    active: updatedOutcome.active ? 1 : 0
                  }
                }
              }
              return outcome
            })
            return {
              ...fixture,
              outcomes: updatedOutcomes
            }
          }
          return fixture
        })
        return {
          ...tournament,
          fixtures: updatedFixtures
        }
      })
    },

    handleBetStop(data) {
      // Find and update the fixture in featuredTournamentGames
      this.featuredTournamentGames = this.featuredTournamentGames.map((tournament) => {
        const updatedFixtures = tournament.fixtures.map((fixture) => {
          if (String(fixture.matchID) === String(data.matchID)) {
            // Set all outcomes to inactive
            const updatedOutcomes = fixture.outcomes.map((outcome) => ({
              ...outcome,
              odds: 0,
              active: 0
            }))
            return {
              ...fixture,
              outcomes: updatedOutcomes
            }
          }
          return fixture
        })
        return {
          ...tournament,
          fixtures: updatedFixtures
        }
      })
    }
  },

  persist: {
    storage: localStorage,
    paths: [
      'brandName',
      'sportID',
      'live',
      'sportsMenu',
      'marketGroups',
      'activeLiveMarkets',
      'homeCarousel',
      'SportsbookBonusList',
      'SportsbookGlobalVariable',
      'showBetslipCount',
      'showFooter',
      'showMobileNavigation',
      'errorMessage',
      'categoriesList',
      'previousRoute',
      // 'featuredTournaments',
      // 'featuredTournamentGames',
      'featuredLastFetchTime',
      'popupDialogShown',
      'bonusModalShown'
    ]
  }
})

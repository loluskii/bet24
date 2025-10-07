// let baseApi = import.meta.env.VITE_BASE_API;
export const BASE_API = 'https://www.frapapa.com'
export const NEW_BASE_API = 'https://api.staging.sportsbookengine.com/api/v2'

export const CLIENT_ID = 4
export const AUTH_EXCLUDE_LIST = []
export const WTH_PERC = 0
export const APP_KEY = 'SBE'
export const SIM_ALLOWED_MARKETS = [
  1, 10, 18, 19, 20, 21, 26, 29, 35, 37, 45, 47, 60, 63, 75, 81, 98, 548,
];
export const SIM_ENABLED = false;
export const DEPOSIT_ALLOWED = true
export const FEED_TOGGLE = true

export const PINIA_PERSIST_OPTIONS = {
  storage: localStorage
}

export const sportsList = [
  {
    sport_id: 1,
    name: 'Soccer'
  },
  {
    sport_id: 2,
    name: 'Basketball'
  },
  {
    sport_id: 4,
    name: 'Ice Hockey'
  },
  {
    sport_id: 5,
    name: 'Tennis'
  },
  {
    sport_id: 6,
    name: 'Handball'
  },
  {
    sport_id: 8,
    name: 'Boxing'
  },
  {
    sport_id: 9,
    name: 'Rugby'
  },
  {
    sport_id: 10,
    name: 'Aussie Rules'
  },
  {
    sport_id: 11,
    name: 'American Football'
  },
  {
    sport_id: 13,
    name: 'Floorball'
  },
  {
    sport_id: 15,
    name: 'Table Tennis'
  },
  {
    sport_id: 16,
    name: 'Cricket'
  },
  {
    sport_id: 17,
    name: 'Darts'
  },
  {
    sport_id: 18,
    name: 'Volleyball'
  },
  {
    sport_id: 21,
    name: 'MMA'
  },
  {
    sport_id: 24,
    name: 'Bandy'
  },
  {
    sport_id: 25,
    name: 'Futsal'
  },
  {
    sport_id: 56,
    name: 'Waterpolo'
  },
  {
    sport_id: 60,
    name: 'Kabaddi'
  }
]

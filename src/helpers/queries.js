import { fetchWrapper } from './fetch-wrapper'
import { BASE_API, CLIENT_ID, NEW_BASE_API } from './constants'
import moment from 'moment'

function today() {
  let today = new Date()
  let day = today.getDate().toString().padStart(2, '0') // Add leading zero if less than 10
  let month = (today.getMonth() + 1).toString().padStart(2, '0')
  let year = today.getFullYear()

  return year + '-' + month + '-' + day
}

function tomorrow() {
  let tomorrow = new Date()
  tomorrow.setDate((tomorrow.getDate() + 1).toString().padStart(2, '0'))
  return tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate()
}

function end() {
  let future = new Date()
  future.setDate(future.getDate() + 21)
  return (
    future.getFullYear() +
    '-' +
    (future.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    future.getDate()
  )
}

const date = new Date()
const offset = date.getTimezoneOffset()
const sign = offset >= 0 ? '-' : '+'
const offsetHours = Math.abs(offset / 60)

const parseData = async (response) => {
  return response instanceof Promise ? (await response)?.data : response.data
}

export const fetchGlobalVars = async () => {
  return fetchWrapper.get(`${NEW_BASE_API}/auth/globalvariables/${CLIENT_ID}`)
}

export const fetchBanners = async () => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/content-management/banner?clientId=${import.meta.env.VITE_CLIENT_ID}`
    )
  )
}

export const fetchBonusList = async () => {
  return fetchWrapper.get(`${NEW_BASE_API}/bonus/acca-bonus?section=onliners`)
}

export const getSplitPropsData = async (payload) => {
  return fetchWrapper.post(`${BASE_API}/api/sports/get-split-props`, payload)
}

export const getCombosData = async (payload) => {
  return fetchWrapper.post(`${BASE_API}/api/sports/get-combos`, {
    selections: payload.selections
  })
}

export const getGameLobbyUrl = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/games/${CLIENT_ID}/lobby-url`, payload),
  );
};

export const login = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/auth/login?source=mobile`, payload))
}

export const register = async (payload) => {
  return fetchWrapper.post(`${NEW_BASE_API}/auth/register/`, payload)
}

export const sendOTP = async (payload) => {
  return fetchWrapper.post(`${NEW_BASE_API}/notification/send-otp`, payload)
}

export const verifyOTP = async (payload) => {
  return fetchWrapper.post(`${NEW_BASE_API}/notification/verify-otp`, payload)
}

export const verifyUsername = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/auth/verify-username`, payload))
}

export const resetPassword = async (payload) => {
  return parseData(fetchWrapper.patch(`${NEW_BASE_API}/auth/update/reset-password`, payload))
}

export const updateProfile = async (payload) => {
  return parseData(fetchWrapper.put(`${NEW_BASE_API}/auth/update/details`, payload))
}

export const processAccountVerification = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/auth/kyc`, payload),
  );
};


export const getUserDetailsByToken = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/auth/details/${CLIENT_ID}`))
}

export const getTopBets = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/sports/${CLIENT_ID}/top-bets`))
}

export const getCodeHubItems = async (data) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/${CLIENT_ID}/codehub/tickets`, data))
}

export const getSportsMenu = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/sports/menu?timeoffset=${sign}${offsetHours}`))
}

export const getCategoriesBySport = async (sportID, period) => {
  const todayDate = moment().startOf('day').format('YYYY-MM-DD')
  const tomorrowDate = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD')
  const isTodayPeriod = todayDate === period?.startDate && todayDate === period?.endDate
  const isTomorrowPeriod = tomorrowDate === period?.startDate && tomorrowDate === period?.endDate
  // Determine the period type
  const periodParam = isTodayPeriod
    ? 'period=today'
    : isTomorrowPeriod
      ? 'period=24hour'
      : period
        ? `start=${period?.startDate}&end=${period?.endDate}`
        : 'period=all'
  // Fetch and return the parsed data
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/categories/${sportID}?timeoffset=${sign}${offsetHours}&${periodParam}&source=mobile`
    )
  )
}

export const getTournamentsByCategories = async (categoryId, period) => {
  const todayDate = moment().startOf('day').format('YYYY-MM-DD')
  const tomorrowDate = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD')
  const isTodayPeriod = todayDate === period?.startDate && todayDate === period?.endDate
  const isTomorrowPeriod = tomorrowDate === period?.startDate && tomorrowDate === period?.endDate
  // Determine the period type
  const periodParam = isTodayPeriod
    ? 'period=today'
    : isTomorrowPeriod
      ? 'period=24hour'
      : period
        ? `start=${period?.startDate}&end=${period?.endDate}`
        : 'period=all'
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/tournaments/${categoryId}?timeoffset=${sign}${offsetHours}&${periodParam}&source=mobile`
    )
  )
}

export const getFixturesByCategories = async (categoryId, sid) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/get-fixtures-by-categories/${categoryId}?timeoffset=${sign}${offsetHours}&sportID=${sid}&limit=50&source=mobile`
    )
  )
}

export const getToday2 = async (sid, page) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/${sid}?today=1&page=${page}&perPage=15&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const searchFixtures = async (q) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/0?markets=1&upcoming=1&search=${q}&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getLiveHighlights = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/sports/highlight/live/0?source=mobile&markets=1`)
  )
}

export const getLiveCountBySport = async (sid) => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/sports/live/games/count/${sid}`))
}

export const getSportHighlights = async (sid, hours, page) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/${sid}?upcoming=1&page=${page}&perPage=15&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getSportUpcoming = async (sid, period) => {
  const todayDate = moment().startOf('day').format('YYYY-MM-DD')
  const tomorrowDate = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD')
  const isTodayPeriod = todayDate === period?.startDate && todayDate === period?.endDate
  const isTomorrowPeriod = tomorrowDate === period?.startDate && tomorrowDate === period?.endDate

  const periodParam = isTodayPeriod
    ? 'period=today'
    : isTomorrowPeriod
      ? 'period=tomorrow'
      : period?.startDate !== undefined && period?.endDate !== undefined
        ? `startDate=${period?.startDate}&endDate=${period?.endDate}`
        : `period=${period}`

  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/fixtures/upcoming?sportID=${sid}&${periodParam}&timeoffset=${sign}${offsetHours}&limit=15`
    )
  )
}

export const getHighlights2 = async (sid) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/${sid}?upcoming=1&page=1&perPage=15&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getFixturesByTournamentId = async (id, sid, period = null) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/get-fixtures/${id}?sportID=${sid}&marketID=1&source=mobile&timeoffset=${sign}${offsetHours}&period=${
        period ? period : 'all'
      }&limit=50`
    )
  )
}

export const getFixtureMarkets = async (id) => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/sports/match/${id}?timeoffset=${sign}${offsetHours}`)
  )
}

export const getBets = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/history?page=1`, payload))
}

export const getSettledBets = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/history?page=1`, payload))
}

export const getTransactionsData = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/user/wallet/transactions`, payload))
}

export const getPendingWithdrawalsData = async () => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/user/wallet/list-pending-withdrawal/${import.meta.env.VITE_CLIENT_ID}`
    )
  )
}

export const cancelPendingWithdrawal = async (payload) => {
  return parseData(
    fetchWrapper.post(
      `${NEW_BASE_API}/user/wallet/cancel-withdrawal/${import.meta.env.VITE_CLIENT_ID}`,
      payload
    )
  )
}

export const fetchBankAssets = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/user/wallet/bank-accounts`))
}

export const updatePassword = async (payload) => {
  return parseData(fetchWrapper.put(`${NEW_BASE_API}/auth/update/password/`, payload))
}

export const placeBet2 = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/place-bet/${CLIENT_ID}`, payload))
}

export const validateBetslipSelections = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/validate-selections`, payload))
}

export const performCashout = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/cashout/`, payload))
}

export const bookBet2 = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/book-bet/${CLIENT_ID}`, payload))
}

export const loadBetslipByCode = async (betslipId) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/bets/find-bet`, {
      betslipId: betslipId,
      clientId: CLIENT_ID
    })
  )
}

export const getPromotions = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/games/promotions?clientId=${import.meta.env.VITE_CLIENT_ID}`)
  )
}

export const getCasinoBonusGames = async (userId) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/games/bonus-games?clientId=${import.meta.env.VITE_CLIENT_ID}&userId=${userId}`
    )
  )
}

export const getGamesBySearch = async (gameName) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/games/${import.meta.env.VITE_CLIENT_ID}/game-list?gameName=${gameName}`
    )
  )
}

export const getGamesByProviders = async (providerId) => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/games/${CLIENT_ID}/list?providerId=${providerId}`)
  )
}

export const getProviders = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/games/provider`))
}

export const getCasinoStartUrl = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/games/${CLIENT_ID}/start`, payload))
}

export const getSmatVirtualStartUrl = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/games/${CLIENT_ID}/start-url`, payload))
}

export const getTopGameCategories = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/games/categories`))
}

export const gamesByTopCategory = async (id) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/games/${import.meta.env.VITE_CLIENT_ID}/list?categoryId=${id}`
    )
  )
}

export const getJackpots = async () => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/games/active-jackpot?clientId=${import.meta.env.VITE_CLIENT_ID} `
    )
  )
}

export const getJackpotWinners = async () => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/games/jackpot-winners?clientId=${import.meta.env.VITE_CLIENT_ID}`
    )
  )
}

export const getPaymentMethods = async () => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/user/wallet/${import.meta.env.VITE_CLIENT_ID}/payment-methods`
    )
  )
}

export const getBanksList = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/user/wallet/${CLIENT_ID}/banks`))
}

export const verifyAccount = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/user/wallet/verify-bank-account?source=mobile`, payload)
  )
}

export const getDepositURL = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/user/wallet/initiate-deposit?source=mobile`, payload)
  )
}

export const verifyDeposit = async (channel, ref) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/user/wallet/verify-payment?paymentChannel=${channel}&transactionRef=${ref}&clientId=${CLIENT_ID}`
    )
  )
}

export const withdrawalRequest = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/user/wallet/withdraw?source=mobile`, payload))
}

export const smileandpayPayout = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/user/wallet/smileandpay/payout/${CLIENT_ID}?source=mobile`, payload))
}

export const transferRequest = async (payload) => {
  return parseData(
    fetchWrapper.put(
      `${NEW_BASE_API}/auth/initiate-transfer/${import.meta.env.VITE_CLIENT_ID}`,
      payload
    )
  )
}

export const getUserBonus = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/bonus/user/list?client_id=${CLIENT_ID}`))
}

export const getUserActiveBonus = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/bonus/get-active-bonus?client_id=${CLIENT_ID}`)
  )
}

export const getUserCashbackBonus = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/bonus/user/check-cashback-bonus?clientId=${CLIENT_ID}`)
  )
}

export const checkFirstDeposit = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/bonus/user/check-deposit-bonus?client_id=${CLIENT_ID}`)
  )
}

export const awardBonus = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/bonus/user/award?client_id=${CLIENT_ID}`, payload)
  )
}

export const getCMS = async (page) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/content-management/page?clientId=${import.meta.env.VITE_CLIENT_ID}&slug=${page}`
    )
  )
}

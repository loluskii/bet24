import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useUtilsStore } from '../stores'
// Convert all static imports to dynamic imports
import HomeView from '@/views/HomeView.vue'
const AZView = () => import('@/views/AZView.vue')
const FixtureView = () => import('@/views/Sport/FixtureView.vue')
const SignInView = () => import('@/views/SignInView.vue')
const SignUpView = () => import('@/views/SignUpView.vue')
const BetHistoryView = () => import('@/views/Account/BetHistoryView.vue')
const OpenBetsView = () => import('@/views/Account/OpenBetsView.vue')
const BetDetailView = () => import('@/views/Account/BetDetailView.vue')
const MeView = () => import('@/views/Account/MeView.vue')
const ProfileView = () => import('@/views/Account/ProfileView.vue')
const FixtureDetail = () => import('@/views/Sport/FixtureDetail.vue')
const LiveFixtureDetail = () => import('@/views/Sport/LiveFixtureDetail.vue')
const TransactionView = () => import('@/views/Account/TransactionView.vue')
const PendingWithdrawalView = () => import('@/views/Account/PendingWithdrawalView.vue')
const SportsView = () => import('@/views/SportsView.vue')
const LiveView = () => import('@/views/LiveView.vue')
const LoadBetView = () => import('@/views/LoadBetView.vue')
const DepositView = () => import('@/views/Account/DepositView.vue')
const VerifyPaymentView = () => import('@/views/Account/VerifyPaymentView.vue')
const WithDrawalView = () => import('@/views/Account/WithDrawalView.vue')
const BonusView = () => import('@/views/Account/BonusView.vue')
const CMSPage = () => import('@/views/CMS.vue')
// import SupportView from '@/views/Account/SupportView.vue'
const SearchView = () => import('@/views/SearchView.vue')
const GroupView = () => import('@/views/Games/GroupView.vue')
const Search = () => import('../views/Games/SearchView.vue')

const GamesView = () => import('@/views/Games/GamesView.vue')
const PlayView = () => import('@/views/Games/PlayView.vue')
const CodeHubView = () => import('@/views/CodeHubView.vue')
const Promotions = () => import('@/views/Promotions.vue')
const JackpotView = () => import('../views/Games/JackpotView.vue')

// Add loading component
const LoadingComponent = {
  template: `
    <div class="route-loading">
      <div class="loading-spinner"></div>
    </div>
  `
}

// Add route preloading for frequently accessed routes
const preloadRoutes = ['home', 'az_menu', 'live', 'casino-games']

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'x-active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        showFooter: true,
        showMobileNavigation: true,
        showBetslipCount: true,
        preload: true // Preload home page
      }
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },

    // Auth Routes
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView
    },

    // Sports Routes
    {
      path: '/Sports/AZ_Menu',
      name: 'az_menu',
      component: AZView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Live',
      name: 'live',
      component: LiveView,
      meta: { showFooter: true, showBetslipCount: true }
    },

    // Fixtures - Ordered from most specific to general
    {
      path: '/Sports/Prematch/:sport/:categories/:tournaments',
      name: 'fixtures-by-tournaments',
      component: FixtureView,
      meta: { showBetslipCount: true }
    },
    {
      path: '/Sports/Prematch/:sport/:category/:category_id',
      name: 'fixtures-by-category',
      component: FixtureView,
      meta: { showBetslipCount: true }
    },
    {
      path: '/Sports/Prematch/:sport/:category',
      name: 'fixtures-by-categories',
      component: FixtureView,
      meta: { showBetslipCount: true }
    },
    {
      path: '/Sports/Prematch/:sport/Today',
      name: 'today-fixtures',
      component: FixtureView,
      meta: { showBetslipCount: true }
    },
    {
      path: '/Sports/Prematch/:sport',
      name: 'fixtures-by-sports',
      component: FixtureView,
      meta: { showBetslipCount: true }
    },

    {
      path: '/Sports/:sport/Prematch/:tournament_name/:event_name/:event_id',
      name: 'fixtures-detail',
      component: FixtureDetail,
      meta: { showBetslipCount: true }
    },
    {
      path: '/Sports/:sport/Live/:tournament_name/:event_name/:event_id',
      name: 'live-fixtures-detail',
      component: LiveFixtureDetail,
      meta: { showFooter: true, showBetslipCount: true }
    },
    {
      path: '/Sports',
      name: 'sports',
      component: SportsView
    },

    // Bet History
    {
      path: '/Bets/OpenBets',
      name: 'open-bets',
      component: OpenBetsView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Bets/BetHistory',
      name: 'bet-history',
      component: BetHistoryView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Bets/BetHistory/:bet_id/Detail',
      name: 'bet-detail',
      component: BetDetailView,
      meta: { showMobileNavigation: true }
    },

    // User Account
    {
      path: '/Account/Me',
      name: 'account-me',
      component: MeView,
      meta: { showMobileNavigation: true, showFooter: true }
    },
    {
      path: '/Account/Me/Profile',
      name: 'account-profile',
      component: ProfileView,
      meta: { showFooter: true }
    },
    {
      path: '/Account/Transactions',
      name: 'account-transactions',
      component: TransactionView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Account/PendingWithdrawals',
      name: 'account-pending-withdrawals',
      component: PendingWithdrawalView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Account/Deposit',
      name: 'account-deposit',
      component: DepositView
    },
    {
      path: '/payment-verification/:method',
      name: 'verify-deposit',
      component: VerifyPaymentView
    },
    {
      path: '/Account/Withdraw',
      name: 'account-withdraw',
      component: WithDrawalView
    },
    {
      path: '/Account/Bonus',
      name: 'account-bonus',
      component: BonusView
    },

    // Casino
    {
      path: '/Games',
      name: 'casino-games',
      component: GamesView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/Search',
      name: 'casino-search',
      component: Search,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/Providers',
      name: 'casino-providers',
      component: GroupView,
      children: [
        {
          path: ':provider',
          name: 'games-by-provider',
          component: GroupView
        }
      ],
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/BonusGames',
      name: 'casino-bonus',
      component: GroupView,
      children: [
        {
          path: '',
          name: 'bonus-games',
          component: GroupView
        }
      ],
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/Jackpots',
      name: 'casino-jackpots',
      component: JackpotView,
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/Category',
      name: 'casino-category',
      component: GroupView,
      children: [
        {
          path: ':category',
          name: 'games-by-category',
          component: GroupView
        }
      ],
      meta: { showMobileNavigation: true }
    },
    {
      path: '/Games/:game_name/:game_id/Play',
      name: 'game-play',
      component: PlayView
    },

    // Load Bet
    {
      path: '/LoadBet',
      name: 'load-bet',
      component: LoadBetView
    },

    // Code Hub
    {
      path: '/CodeHub',
      name: 'code-hub',
      component: CodeHubView
    },

    // CMS Pages
    {
      path: '/CMS/:page',
      name: 'cms-page',
      component: CMSPage
    },

    // Promotions
    {
      path: '/Promotions',
      name: 'promotions',
      component: Promotions
    },

    // Catch-all route to redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.body.classList.add('route-loading')

  // Preload the main component of the next route
  const preloadComponent = (route) => {
    const component = route.matched?.[0]?.components?.default
    if (typeof component === 'function') component()
  }

  preloadComponent(to)

  // Preload frequently accessed routes
  preloadRoutes.forEach((routeName) => {
    if (routeName !== to.name) {
      const route = router.resolve({ name: routeName })
      preloadComponent(route)
    }
  })

  // Utils: toggle visibility of layout elements based on route meta
  const utilStore = useUtilsStore()
  utilStore.showFooter = !!to.meta.showFooter
  utilStore.showMobileNavigation = !!to.meta.showMobileNavigation
  utilStore.showBetslipCount = !!to.meta.showBetslipCount

  // Auth handling
  const authStore = useAuthStore()
  const authPages = [
    'account-withdraw',
    'account-profile',
    'account-deposit',
    'account-bonus',
    'account-transactions',
    'bet-history',
    'bet-detail',
    'game-play',
    'account-pending-withdrawals'
  ]
  const authRequired = authPages.includes(to.name)

  if (authStore.isAuthenticated && ['sign-in', 'sign-up'].includes(to.name)) {
    return next({ path: '/' })
  }

  if (authRequired && !authStore.isAuthenticated) {
    authStore.returnUrl = to.fullPath
    return next({ name: 'sign-in' })
  }

  next()
})

// Add afterEach to remove loading state
router.afterEach(() => {
  document.body.classList.remove('route-loading')
})

export default router

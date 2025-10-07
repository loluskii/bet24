export const defaultMeta = {
  title: 'Sporty Clone - Sports Betting Platform',
  meta: [
    {
      name: 'description',
      content:
        'Sports betting platform with live odds, in-play betting, and casino games. Bet on your favorite sports with competitive odds.'
    },
    {
      name: 'keywords',
      content: 'sports betting, live odds, in-play betting, casino games, online betting'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    },
    {
      name: 'theme-color',
      content: '#ffffff'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      property: 'og:title',
      content: 'Sporty Clone - Sports Betting Platform'
    },
    {
      property: 'og:description',
      content: 'Sports betting platform with live odds, in-play betting, and casino games.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: window.location.origin
    },
    {
      property: 'og:image',
      content: '/default.png'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    },
    {
      rel: 'canonical',
      href: window.location.href
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
}

export const routeMeta = {
  '/': {
    title: 'Home - Sporty Clone',
    meta: [
      {
        name: 'description',
        content:
          'Welcome to Sporty Clone - Your premier sports betting platform. Bet on live sports, casino games, and more.'
      }
    ]
  },
  '/sports': {
    title: 'Sports Betting - Sporty Clone',
    meta: [
      {
        name: 'description',
        content:
          'Bet on your favorite sports with competitive odds. Football, basketball, tennis, and more.'
      }
    ]
  },
  '/casino': {
    title: 'Casino Games - Sporty Clone',
    meta: [
      {
        name: 'description',
        content: 'Play exciting casino games including slots, table games, and live dealer games.'
      }
    ]
  }
}

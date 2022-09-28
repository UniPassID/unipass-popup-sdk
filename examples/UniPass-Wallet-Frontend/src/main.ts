import { createApp } from 'vue'
import App from '@/app.vue'
// pwa
// import '@/plugins/register-service-worker'
import router from '@/plugins/router'
import i18n from '@/plugins/i18n'
import pinia from '@/plugins/pinia'
import VueGtag from 'vue-gtag-next'
// sentry
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

// main style
import '@/main.scss'

const app = createApp(App)
// sentry
// https://docs.sentry.io/platforms/javascript/guides/vue/#vue-3
if (process.env.VUE_APP_Sentry) {
  Sentry.init({
    app,
    dsn: process.env.VUE_APP_Sentry,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'unipass-wallet.vercel.app', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
// google analytics
if (process.env.VUE_APP_UniPass_GA && process.env.NODE_ENV === 'production') {
  app.use(VueGtag, {
    property: { id: process.env.VUE_APP_UniPass_GA },
  })
}
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')

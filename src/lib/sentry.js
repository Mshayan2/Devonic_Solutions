// Lightweight Sentry init helper (optional). Set VITE_SENTRY_DSN in .env to enable.
let Sentry = null
try{
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if(dsn){
    // lazy load to avoid adding heavy deps unless configured
    const moduleName = '@sentry/browser'
    import(/* @vite-ignore */ moduleName).then(mod => {
      Sentry = mod.default || mod
      Sentry.init({ dsn, release: import.meta.env.VITE_APP_VERSION || 'dev' })
    }).catch(()=>{ /* optional */ })
  }
}catch(e){ /* ignore in non-browser env */ }

export function captureException(err){
  if(Sentry && typeof Sentry.captureException === 'function') Sentry.captureException(err)
}

export default { captureException }

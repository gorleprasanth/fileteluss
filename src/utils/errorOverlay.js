// Simple in-page error overlay so users without DevTools can see runtime errors
(function () {
  if (typeof window === 'undefined') return

  function createOverlay() {
    const existing = document.getElementById('error-overlay')
    if (existing) return existing

    const overlay = document.createElement('div')
    overlay.id = 'error-overlay'
    Object.assign(overlay.style, {
      position: 'fixed',
      left: '12px',
      right: '12px',
      bottom: '12px',
      maxHeight: '60vh',
      overflow: 'auto',
      zIndex: 999999,
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
    })

    const header = document.createElement('div')
    header.style.display = 'flex'
    header.style.justifyContent = 'space-between'
    header.style.alignItems = 'center'

    const title = document.createElement('strong')
    title.textContent = 'App Runtime Error'
    title.style.marginRight = '12px'

    const btn = document.createElement('button')
    btn.textContent = 'Dismiss'
    Object.assign(btn.style, {
      background: '#222',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '6px 10px',
      borderRadius: '6px',
      cursor: 'pointer'
    })
    btn.onclick = () => overlay.remove()

    header.appendChild(title)
    header.appendChild(btn)
    overlay.appendChild(header)

    const body = document.createElement('pre')
    body.id = 'error-overlay-body'
    Object.assign(body.style, {
      whiteSpace: 'pre-wrap',
      marginTop: '8px',
      color: '#ffdddd'
    })
    overlay.appendChild(body)

    document.body.appendChild(overlay)
    return overlay
  }

  function showError(message) {
    try {
      const overlay = createOverlay()
      const body = document.getElementById('error-overlay-body')
      if (body) {
        const time = new Date().toLocaleString()
        body.textContent = `${time}\n\n${message}`
      }
      // also print to console
      console.error('[errorOverlay]', message)
    } catch (e) {
      console.error('Failed to render error overlay', e)
    }
  }

  window.addEventListener('error', function (ev) {
    const msg = `${ev.message}\n\n${ev.filename}:${ev.lineno}:${ev.colno}\n\n${ev.error && ev.error.stack ? ev.error.stack : ''}`
    showError(msg)
  })

  window.addEventListener('unhandledrejection', function (ev) {
    const reason = ev.reason
    const text = typeof reason === 'string' ? reason : (reason && reason.stack) ? reason.stack : JSON.stringify(reason)
    showError(`Unhandled Promise Rejection:\n\n${text}`)
  })

  // expose helper
  window.__showAppError = showError
})()

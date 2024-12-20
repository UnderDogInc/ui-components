const HANDLERS_PROPERTY = '__v-click-outside'
const HAS_WINDOWS = typeof window !== 'undefined'
const HAS_NAVIGATOR = typeof navigator !== 'undefined'
const IS_TOUCH =
  HAS_WINDOWS &&
  ('ontouchstart' in window ||
    (HAS_NAVIGATOR && navigator.maxTouchPoints > 0))
const EVENTS = IS_TOUCH
  ? ['touchstart']
  : ['click']

function processDirectiveArguments(bindingValue: any) {
  const isFunction = typeof bindingValue === 'function'

  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error(
      'v-click-outside: Binding value must be a function or an object'
    )
  }

  return {
    handler: isFunction
      ? bindingValue
      : bindingValue.handler,
    middleware: bindingValue.middleware || ((item: any) => item),
    events: bindingValue.events || EVENTS,
    isActive: !(bindingValue.isActive === false),
    detectIframe: !(bindingValue.detectIframe === false),
    capture: !!bindingValue.capture,
  }
}

function execHandler({ event, handler, middleware }: any) {
  if (middleware(event)) {
    handler(event)
  }
}

function onFauxIframeClick({ el, event, handler, middleware }: any) {
  setTimeout(() => {
    const { activeElement } = document

    if (
      activeElement &&
      activeElement.tagName === 'IFRAME' &&
      !el.contains(activeElement)
    ) {
      execHandler({ event, handler, middleware })
    }
  }, 0)
}

function onEvent({ el, event, handler, middleware }: any) {
  const path = (event.composedPath && event.composedPath()) || event.path
  const isClickOutside = path
    ? path.indexOf(el) < 0
    : !el.contains(event.target)

  if (!isClickOutside) {
    return
  }

  execHandler({ event, handler, middleware })
}

function bind(el: any, { value }: any) {
  const {
    events,
    handler,
    middleware,
    isActive,
    detectIframe,
    capture,
  } = processDirectiveArguments(value)

  if (!isActive) {
    return
  }

  el[HANDLERS_PROPERTY] = events.map((eventName: any) => ({
    event: eventName,
    srcTarget: document.documentElement,
    handler: (event: any) => onEvent({ el, event, handler, middleware }),
    capture,
  }))

  if (detectIframe) {
    const detectIframeEvent = {
      event: 'blur',
      srcTarget: window,
      handler: (event: any) => onFauxIframeClick({ el, event, handler, middleware }),
      capture,
    }

    el[HANDLERS_PROPERTY] = [...el[HANDLERS_PROPERTY], detectIframeEvent]
  }

  el[HANDLERS_PROPERTY].forEach(({ event, srcTarget, handler }: any) =>
    setTimeout(() => {

      if (!el[HANDLERS_PROPERTY]) {
        return
      }

      srcTarget.addEventListener(event, handler, capture)
    }, 0)
  )
}

function unbind(el: any) {
  const handlers = el[HANDLERS_PROPERTY] || []
  handlers.forEach(({ event, srcTarget, handler, capture }: any) =>
    srcTarget.removeEventListener(event, handler, capture)
  )
  delete el[HANDLERS_PROPERTY]
}

function update(el: any, { value, oldValue }: any) {
  if (JSON.stringify(value) === JSON.stringify(oldValue)) {
    return
  }

  unbind(el)
  bind(el, { value })
}

const directive = {
  beforeMount: bind,
  updated: update,
  unmounted: unbind,
}

export default directive
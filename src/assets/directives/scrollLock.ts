import { Directive, DirectiveHook } from 'vue'

declare global {
  interface Window {
    scrollLockPrevValueName?: HTMLElement | null
    scrollLockMainValueName?: HTMLElement | null
  }
}

function values() {
  const prevValueName = window.scrollLockPrevValueName || null
  const mainValueName = window.scrollLockMainValueName || null

  return {
    prevValueName,
    mainValueName,
  }
}

function hideScroll(el: HTMLElement) {
  const {
    prevValueName,
    mainValueName,
  } = values()

  const body = document.getElementsByTagName('body')[0]
  const html = document.getElementsByTagName('html')[0]
  setTimeout(() => {
    if (!body.hasAttribute('data-body-scroll-fix')) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
      body.setAttribute('data-body-scroll-fix', String(scrollPosition))
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = '-' + scrollPosition + 'px'
      body.style.left = '0'
      body.style.width = '100%'
      html.classList.add('hide-scroll')
    }
  }, 15)

  if (body.hasAttribute('data-body-scroll-fix') && !mainValueName) {
    window.scrollLockMainValueName = prevValueName
  }

  window.scrollLockPrevValueName = el
}

function showScroll(el: HTMLElement) {
  const { mainValueName } = values()

  const body = document.getElementsByTagName('body')[0]
  const html = document.getElementsByTagName('html')[0]

  if (body.hasAttribute('data-body-scroll-fix') && (!mainValueName || mainValueName === el)) {
    const scrollPosition = body.getAttribute('data-body-scroll-fix')
    body.removeAttribute('data-body-scroll-fix')
    body.style.overflow = ''
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.width = ''
    html.classList.remove('hide-scroll')
    window.scroll(0, scrollPosition 
      ? parseInt(scrollPosition)
      : 0
    )
    window.scrollLockMainValueName = null
    window.scrollLockPrevValueName = null
  }
}

const inserted: DirectiveHook = (el: HTMLElement, binding) => {
  if (binding.value) {
    hideScroll(el)
  }
}

const componentUpdated: DirectiveHook = (el: HTMLElement, binding) => {
  if (binding.value) {
    hideScroll(el)
  }
  else {
    showScroll(el)
  }
}

const unbind: DirectiveHook = (el: HTMLElement) => {
  showScroll(el)
}

const directive: Directive = {
  mounted: inserted,
  updated: componentUpdated,
  unmounted: unbind,
}

export default directive

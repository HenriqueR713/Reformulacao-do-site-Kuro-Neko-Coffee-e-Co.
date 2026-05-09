function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")

  const icon = document.getElementById("switch-icon")
  if (html.classList.contains("light")) {
    icon.src = "./assets/assets/sun.svg"
    icon.alt = "modo claro"
  } else {
    icon.src = "./assets/assets/moon-stars.svg"
    icon.alt = "modo escuro"
  }
}

  // if(html.classList.contains('light')) {
  // html.classList.remove('light')
  // } else {
  //     html.classList.add('light')
  // }


  /* =========================================================
   NOVO SLIDER
   Substitua todo o bloco antigo do slider por este código
========================================================= */

const images = [
  "https://imgs.search.brave.com/HjHB63Dm95_SQhrl9mlYCLrMT46ZpMakSP-tuBwRFww/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudHVyaXNtb2Np/dHkuY29tL2Nkbi1j/Z2kvaW1hZ2UvZm9y/bWF0PWF1dG8sd2lk/dGg9c2NhbGUtZG93/bixoZWlnaHQ9MTQw/MCxzY2FsZS1kb3du/PWNvdmVyL2ltZy9i/bG9nLzE3MzAzMjE3/MDg5NDZfQ29taWRh/cy10aXBpY2FzLWJy/YXNpbGVpcmFzLWFj/YXJhamUuanBn",
  "https://imgs.search.brave.com/KN11imA6WCMqfVCPDh8SmhAhZFZQDkVPeN_vX7seQ0s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWVsaG9yZXNkZXN0/aW5vcy5jb20uYnIv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MTIvY29taWRhcy10/aXBpY2FzLWJyYXNp/bC1wYXJhLmpwZw",
  "https://imgs.search.brave.com/jOQ0dMy2uwOVtfxOTvBn1EY_Uygc6NZi9ifMwo0qOlg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWVsaG9yZXNkZXN0/aW5vcy5jb20uYnIv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MTIvY29taWRhcy10/aXBpY2FzLWNhcGEy/MDE5LTAxLTgyMHg0/MzAuanBn",
  "https://imgs.search.brave.com/utu6B5PkO86Y3zhAfdYBIc8GaPGBg8FhucCIG__aljU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbnN0/aXR1Y2lvbmFsLmlm/b29kLmNvbS5ici93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/Ny9jb21pZGFzLXRp/cGljYXMtbW9xdWVj/YS5qcGc",
  "https://imgs.search.brave.com/3WJgrZcOaw3_fndeTZ1S8mUQUd3CSwG0SXhZqXBNG7Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bWVsaG9yZXNkZXN0/aW5vcy5jb20uYnIv/d3AtY29udGVudC91/cGxvYWRzLzIwMjAv/MTIvY29taWRhcy10/aXBpY2FzLWJyYXNp/bC1hbWF6b25hcy5q/cGVn",
]

const SLIDER_N    = images.length
let   sliderCur   = 0
let   sliderBusy  = false

const sliderScene = document.getElementById('menuSlider')
const sliderDots  = document.getElementById('sliderDots')

const DUR  = 560
const EASE = 'cubic-bezier(0.22,1,0.36,1)'

function sliderW() { return sliderScene.offsetWidth  }
function sliderH() { return sliderScene.offsetHeight }

function POS_MAIN()  { return { x: 0,                  w: 0.58, h: 1.00, br: 1,    z: 4, op: 1, shadow: true  } }
function POS_LEFT()  { return { x: -sliderW() * 0.295, w: 0.42, h: 0.82, br: 0.65, z: 2, op: 1, shadow: false } }
function POS_RIGHT() { return { x:  sliderW() * 0.295, w: 0.42, h: 0.82, br: 0.65, z: 2, op: 1, shadow: false } }
function POS_GONE_L(){ return { x: -sliderW() * 0.90,  w: 0.42, h: 0.72, br: 0.5,  z: 1, op: 0, shadow: false } }
function POS_GONE_R(){ return { x:  sliderW() * 0.90,  w: 0.42, h: 0.72, br: 0.5,  z: 1, op: 0, shadow: false } }

function sliderApplyPos(el, pos, duration) {
  const ew = sliderW() * pos.w
  const eh = sliderH() * pos.h
  const brightness = pos.br >= 1 ? 1 : 0.42 + 0.58 * pos.br

  if (duration === 0) {
    el.style.transition = 'none'
  } else {
    const t = `${duration}ms ${EASE}`
    el.style.transition = `width ${t},height ${t},transform ${t},filter ${t},opacity ${t},box-shadow ${t}`
  }

  el.style.width     = ew + 'px'
  el.style.height    = eh + 'px'
  el.style.transform = `translate(calc(-50% + ${pos.x}px), -50%)`
  el.style.zIndex    = pos.z
  el.style.opacity   = pos.op
  el.style.filter    = `brightness(${brightness})`
  el.style.boxShadow = pos.shadow ? '0 10px 50px rgba(0,0,0,0.35)' : 'none'
}

function sliderIdx(i) { return ((i % SLIDER_N) + SLIDER_N) % SLIDER_N }

function sliderMakeEl(i) {
  const el  = document.createElement('div')
  el.className = 'kn-slide'
  const img = document.createElement('img')
  img.src = images[sliderIdx(i)]
  img.alt = 'Cardápio'
  el.appendChild(img)
  return el
}

let sliderEls = {}

function sliderBuild() {
  Object.values(sliderEls).forEach(e => e.remove())
  sliderEls = {}

  const configs = [
    [sliderIdx(sliderCur - 1), POS_LEFT()],
    [sliderIdx(sliderCur),     POS_MAIN()],
    [sliderIdx(sliderCur + 1), POS_RIGHT()],
  ]

  configs.forEach(([i, pos]) => {
    const el = sliderMakeEl(i)
    sliderApplyPos(el, pos, 0)
    sliderScene.insertBefore(el, sliderScene.querySelector('.slider-arrow'))
    sliderEls[i] = el
  })

  sliderUpdateDots()
}

function sliderUpdateDots() {
  sliderDots.innerHTML = ''
  for (let i = 0; i < SLIDER_N; i++) {
    const d = document.createElement('div')
    d.className = 'slider-dot' + (i === sliderCur ? ' active' : '')
    sliderDots.appendChild(d)
  }
}

function sliderGo(dir) {
  if (sliderBusy) return
  sliderBusy = true

  const oldLeft  = sliderIdx(sliderCur - 1)
  const oldMain  = sliderIdx(sliderCur)
  const oldRight = sliderIdx(sliderCur + 1)

  sliderCur = sliderIdx(sliderCur + dir)

  sliderUpdateDots()

  if (dir === 1) {
    const entering = sliderMakeEl(sliderIdx(sliderCur + 1))
    sliderApplyPos(entering, POS_GONE_R(), 0)
    sliderScene.insertBefore(entering, sliderScene.querySelector('.slider-arrow'))
    sliderEls[sliderIdx(sliderCur + 1)] = entering

    entering.getBoundingClientRect()

    sliderApplyPos(sliderEls[oldLeft],  POS_GONE_L(), DUR)
    sliderApplyPos(sliderEls[oldMain],  POS_LEFT(),   DUR)
    sliderApplyPos(sliderEls[oldRight], POS_MAIN(),   DUR)
    sliderApplyPos(entering,            POS_RIGHT(),  DUR)

    setTimeout(() => {
      sliderEls[oldLeft] && sliderEls[oldLeft].remove()
      delete sliderEls[oldLeft]
      sliderBusy = false
    }, DUR + 60)

  } else {
    const entering = sliderMakeEl(sliderIdx(sliderCur - 1))
    sliderApplyPos(entering, POS_GONE_L(), 0)
    sliderScene.insertBefore(entering, sliderScene.querySelector('.slider-arrow'))
    sliderEls[sliderIdx(sliderCur - 1)] = entering

    entering.getBoundingClientRect()

    sliderApplyPos(sliderEls[oldRight], POS_GONE_R(), DUR)
    sliderApplyPos(sliderEls[oldMain],  POS_RIGHT(),  DUR)
    sliderApplyPos(sliderEls[oldLeft],  POS_MAIN(),   DUR)
    sliderApplyPos(entering,            POS_LEFT(),   DUR)

    setTimeout(() => {
      sliderEls[oldRight] && sliderEls[oldRight].remove()
      delete sliderEls[oldRight]
      sliderBusy = false
    }, DUR + 60)
  }
}

window.addEventListener('resize', sliderBuild)
sliderBuild()

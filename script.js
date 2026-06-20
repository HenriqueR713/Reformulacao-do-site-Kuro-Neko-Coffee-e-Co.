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

// IMAGENS DO CARDÁPIO //

const images = [
  "./assets/Imagens/Imagens Cardapio/COMIDA-4.jpeg",
  "./assets/Imagens/Imagens Cardapio/COMIDA-1.jpeg",
  "./assets/Imagens/Imagens Cardapio/COMIDA-3.jpeg",
  "./assets/Imagens/Imagens Cardapio/COMIDA-5.jpeg",
  "./assets/Imagens/Imagens Cardapio/COMIDA-6.jpeg",
  "./assets/Imagens/Imagens Cardapio/COMIDA-7.jpeg",
]

const SLIDER_N = images.length
let sliderCur = 0
let sliderBusy = false

const sliderScene = document.getElementById("menuSlider")
const sliderDots = document.getElementById("sliderDots")

const DUR = 560
const EASE = "cubic-bezier(0.22,1,0.36,1)"

function sliderW() {
  return sliderScene.offsetWidth
}
function sliderH() {
  return sliderScene.offsetHeight
}

function POS_MAIN() {
  return { x: 0, w: 0.58, h: 1.0, br: 1, z: 4, op: 1, shadow: true }
}
function POS_LEFT() {
  return {
    x: -sliderW() * 0.295,
    w: 0.42,
    h: 0.82,
    br: 0.65,
    z: 2,
    op: 1,
    shadow: false,
  }
}
function POS_RIGHT() {
  return {
    x: sliderW() * 0.295,
    w: 0.42,
    h: 0.82,
    br: 0.65,
    z: 2,
    op: 1,
    shadow: false,
  }
}
function POS_GONE_L() {
  return {
    x: -sliderW() * 0.9,
    w: 0.42,
    h: 0.72,
    br: 0.5,
    z: 1,
    op: 0,
    shadow: false,
  }
}
function POS_GONE_R() {
  return {
    x: sliderW() * 0.9,
    w: 0.42,
    h: 0.72,
    br: 0.5,
    z: 1,
    op: 0,
    shadow: false,
  }
}

function sliderApplyPos(el, pos, duration) {
  const ew = sliderW() * pos.w
  const eh = sliderH() * pos.h
  const brightness = pos.br >= 1 ? 1 : 0.42 + 0.58 * pos.br

  if (duration === 0) {
    el.style.transition = "none"
  } else {
    const t = `${duration}ms ${EASE}`
    el.style.transition = `width ${t},height ${t},transform ${t},filter ${t},opacity ${t},box-shadow ${t}`
  }

  el.style.width = ew + "px"
  el.style.height = eh + "px"
  el.style.transform = `translate(calc(-50% + ${pos.x}px), -50%)`
  el.style.zIndex = pos.z
  el.style.opacity = pos.op
  el.style.filter = `brightness(${brightness})`
  el.style.boxShadow = pos.shadow ? "0 10px 50px rgba(0,0,0,0.35)" : "none"
}

function sliderIdx(i) {
  return ((i % SLIDER_N) + SLIDER_N) % SLIDER_N
}

function sliderMakeEl(i) {
  const el = document.createElement("div")
  el.className = "kn-slide"
  const img = document.createElement("img")
  img.src = images[sliderIdx(i)]
  img.alt = "Cardápio"
  el.appendChild(img)
  return el
}

let sliderEls = {}

function sliderBuild() {
  Object.values(sliderEls).forEach((e) => e.remove())
  sliderEls = {}

  const configs = [
    [sliderIdx(sliderCur - 1), POS_LEFT()],
    [sliderIdx(sliderCur), POS_MAIN()],
    [sliderIdx(sliderCur + 1), POS_RIGHT()],
  ]

  configs.forEach(([i, pos]) => {
    const el = sliderMakeEl(i)
    sliderApplyPos(el, pos, 0)
    sliderScene.insertBefore(el, sliderScene.querySelector(".slider-arrow"))
    sliderEls[i] = el
  })

  sliderBuildDots()
  sliderUpdateDots()
}

function sliderBuildDots() {
  sliderDots.innerHTML = ""
  for (let i = 0; i < SLIDER_N; i++) {
    const d = document.createElement("div")
    d.className = "slider-dot" + (i === sliderCur ? " active" : "")
    sliderDots.appendChild(d)
  }
}

function sliderUpdateDots(dir = 0) {
  const dots = sliderDots.querySelectorAll(".slider-dot")
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === sliderCur)
  })
}

function sliderGo(dir) {
  if (sliderBusy) return
  sliderBusy = true

  const oldLeft = sliderIdx(sliderCur - 1)
  const oldMain = sliderIdx(sliderCur)
  const oldRight = sliderIdx(sliderCur + 1)

  sliderCur = sliderIdx(sliderCur + dir)

  sliderUpdateDots(dir)

  if (dir === 1) {
    const entering = sliderMakeEl(sliderIdx(sliderCur + 1))
    sliderApplyPos(entering, POS_GONE_R(), 0)
    sliderScene.insertBefore(
      entering,
      sliderScene.querySelector(".slider-arrow"),
    )
    sliderEls[sliderIdx(sliderCur + 1)] = entering

    entering.getBoundingClientRect()

    sliderApplyPos(sliderEls[oldLeft], POS_GONE_L(), DUR)
    sliderApplyPos(sliderEls[oldMain], POS_LEFT(), DUR)
    sliderApplyPos(sliderEls[oldRight], POS_MAIN(), DUR)
    sliderApplyPos(entering, POS_RIGHT(), DUR)

    setTimeout(() => {
      sliderEls[oldLeft] && sliderEls[oldLeft].remove()
      delete sliderEls[oldLeft]
      sliderBusy = false
    }, DUR + 60)
  } else {
    const entering = sliderMakeEl(sliderIdx(sliderCur - 1))

    sliderApplyPos(entering, POS_GONE_L(), 0)

    sliderScene.insertBefore(
      entering,
      sliderScene.querySelector(".slider-arrow"),
    )

    sliderEls[sliderIdx(sliderCur - 1)] = entering

    entering.getBoundingClientRect()

    sliderApplyPos(sliderEls[oldRight], POS_GONE_R(), DUR)

    sliderApplyPos(sliderEls[oldMain], POS_RIGHT(), DUR)

    sliderApplyPos(sliderEls[oldLeft], POS_MAIN(), DUR)

    sliderApplyPos(entering, POS_LEFT(), DUR)

    setTimeout(() => {
      sliderEls[oldRight] && sliderEls[oldRight].remove()

      delete sliderEls[oldRight]

      sliderBusy = false
    }, DUR + 60)
  }
}

window.addEventListener("resize", sliderBuild)
sliderBuild()

// =========================================================
// MODAL CARDÁPIO (PDF)
// =========================================================

const CARDAPIO_PDF_URL = "./assets/Imagens/PDF Cardapio/KN_CARDAPIO_DIGITAL.pdf"

let cardapioPdfDoc = null
let cardapioRendered = false

function openCardapioModal() {
  const modal = document.getElementById("cardapioModal")
  modal.classList.add("is-open")
  document.body.classList.add("cardapio-no-scroll")

  if (!cardapioRendered) {
    renderCardapioPdf()
  }
}

function closeCardapioModal() {
  const modal = document.getElementById("cardapioModal")
  modal.classList.remove("is-open")
  document.body.classList.remove("cardapio-no-scroll")
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("cardapioModal")
    if (modal && modal.classList.contains("is-open")) {
      closeCardapioModal()
    }
  }
})

async function renderCardapioPdf() {
  const loading = document.getElementById("cardapioLoading")
  const container = document.getElementById("cardapioPagesContainer")

  if (typeof pdfjsLib === "undefined") {
    loading.innerHTML = "<span>Não foi possível carregar o cardápio.</span>"
    return
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

  try {
    cardapioPdfDoc = await pdfjsLib.getDocument(CARDAPIO_PDF_URL).promise

    for (let pageNum = 1; pageNum <= cardapioPdfDoc.numPages; pageNum++) {
      const page = await cardapioPdfDoc.getPage(pageNum)

      const scale = 3
      const viewport = page.getViewport({ scale })

const canvas = document.createElement("canvas")
canvas.className = "cardapio-page-canvas"
canvas.width = viewport.width
canvas.height = viewport.height

const ctx = canvas.getContext("2d")

await page.render({
  canvasContext: ctx,
  viewport: viewport,
}).promise

const pageWrap = document.createElement("div")
pageWrap.className = "cardapio-page-wrap"
pageWrap.appendChild(canvas)

container.appendChild(pageWrap)
    }

    cardapioRendered = true
    loading.classList.add("is-hidden")
  } catch (err) {
    console.error("Erro ao carregar o cardápio em PDF:", err)
    loading.innerHTML = "<span>Erro ao carregar o cardápio. Tente novamente.</span>"
  }
}

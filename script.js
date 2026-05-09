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


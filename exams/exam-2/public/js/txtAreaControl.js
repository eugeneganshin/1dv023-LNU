const p = document.querySelector('.break')
const txtArea = document.querySelector('#editTxtArea')

txtArea.addEventListener('input', e => {
  e.preventDefault()
  p.innerText = txtArea.value
})

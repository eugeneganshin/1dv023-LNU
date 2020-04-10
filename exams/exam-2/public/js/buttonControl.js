const snippet = document.querySelectorAll('.snippet')
Array.from(snippet).map(el => {
  el.addEventListener('click', e => {
    if (e.target.innerText === 'Delete') {
      e.target.parentNode.parentNode.setAttribute('id', 'alert')
      e.target.parentNode.parentNode.lastElementChild.setAttribute('class', 'superShow')
      e.target.parentNode.parentNode.style.position = 'relative'
      e.target.parentNode.style.display = 'none'
    }
    if (e.target.className === 'notSureBtn') {
      e.target.parentNode.parentNode.removeAttribute('id', 'alert')
      e.target.parentNode.parentNode.lastElementChild.setAttribute('class', 'superHidden')
      e.target.parentNode.previousElementSibling.style.display = 'flex'
    }
  })
})

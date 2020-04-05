// {
//   el.style.height = '10px'
//   el.style.height = (el.scrollHeight) + 'px'
// }

const textArea = document.querySelector('#input-snippet')
textArea.addEventListener('input', function () {
  console.log(this)
  this.style.height = (this.scrollHeight) + 'px'
})

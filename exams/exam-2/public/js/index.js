// import { CustomInput } from './custom'

const templateC = document.createElement('template')
templateC.innerHTML = `
<style>
 .addSnippet{
  position: relative;
  min-width: 400px;
 }

 .txtArea{
  min-height: 100px;
  max-height: 150px;
  width: 100%;
  resize: none;
  overflow: hidden;
  margin:0;
  border-color: rgba(255,255,255,0);
 }

 .submit{
  position:absolute;
  bottom:8px;
  right:15px;
  background-color: #2f3745;
  padding:4px;
  color:wheat;
  cursor:pointer;
 }

 #txtForm{
  padding-right: 3px;
 }
</style>

<div class="addSnippet">
  <form method="POST" action="/create" name="inputForm" id="txtForm">
    <textarea name="inputText" class="txtArea">Hello</textarea>
    <input class="submit" type="submit" value="Submit">
  </form>
</div>
`

class CustomInput extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(templateC.content.cloneNode(true))

    this.addSnippetDiv = this.shadowRoot.querySelector('.addSnippet')
    this.txtArea = this.shadowRoot.querySelector('.txtArea')
    this.submitBtn = this.shadowRoot.querySelector('submit')
  }

  connectedCallback () {
    this.txtArea.addEventListener('input', e => {
      console.log(this.txtArea.scrollHeight)
      if (this.txtArea.scrollHeight > 121) {
        this.txtArea.style.height = 5 + 'px'
        this.txtArea.style.height = (this.txtArea.scrollHeight + 10) + 'px'
      }
    })
  }

  _autoGrow () {
    console.log(this)
  }
}

window.customElements.define('x-custom', CustomInput)

// const textArea = document.querySelector('#input-snippet')
// textArea.addEventListener('input', function () {
//   console.log(this)
//   this.style.height = (this.scrollHeight) + 'px'
// })

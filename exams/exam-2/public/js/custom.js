// import { CustomInput } from './custom'

const templateC = document.createElement('template')
templateC.innerHTML = `
<style>
 .addSnippet{
  position: relative;
 }

 .txtArea{
  min-height: 100px;
  max-height: 150px;
  width: 100%;
  resize: none;
  overflow-y: scroll;
  
  margin:0;
  border-color: rgba(255,255,255,0);
 }

 .submit{
  position:absolute;
  bottom:8px;
  right:20px;
  background-color: #33B679;
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: center;
  font-size: 16px;
  margin: 4px 2px;
  opacity: 0.3;
  transition: 0.3s;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
 }

 .submit:hover {opacity: 1}

 #txtForm{
  padding-right: 3px;
 }
</style>

<div class="addSnippet">
  <form action="/create" method="POST" name="inputForm" id="txtForm">
    <textarea name="inputText" class="txtArea"></textarea>
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
    this.txtForm = this.shadowRoot.querySelector('#txtForm')
  }

  connectedCallback () {
    this.txtArea.addEventListener('input', e => {
      this._autoGrow()
      // this._prettify()
    })
  }

  _autoGrow () {
    if (this.txtArea.scrollHeight > 121) {
      this.txtArea.style.height = 5 + 'px'
      this.txtArea.style.height = (this.txtArea.scrollHeight + 10) + 'px'
    }
  }

  _prettify (e) {
    const str = this.txtArea.value
    if (str.length > 6 &&
      str.charAt(0) === '`' &&
      str.charAt(1) === '`' &&
      str.charAt(2) === '`' &&
      str.charAt(str.length - 1) === '`' &&
      str.charAt(str.length - 2) === '`' &&
      str.charAt(str.length - 3) === '`'
    ) {
      this.txtArea.value = `<pre class="prettyprint">${this.txtArea.value}</pre>`
      console.log(this.txtArea.value)
      // if success replace first lines of code with pre code and last lines ore code pre
    }
  }
}

window.customElements.define('x-custom', CustomInput)

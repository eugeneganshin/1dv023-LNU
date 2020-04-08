const templateC = document.createElement('template')
templateC.innerHTML = `
<div class="addSnippet">
  <form method="POST" action="/create" name="inputForm">
    <textarea name="inputText" class="txtArea">Hello</textarea>
    <input class="submit" type="submit" value="Submit">
  </form>
</div>

<style>
 .addSnippet{
   position: relative;
 }

 .txtArea{
  width: 600px;
  max-width: 600px;
  height:200px;
  margin:0;
  border-color: rgba(255,255,255,255);
  padding:10px;
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
</style>
`

export class CustomInput extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(templateC.content.cloneNode(true))

    this.addSnippetDiv = this.shadowRoot.querySelector('.addSnippet')
    this.txtArea = this.shadowRoot.querySelector('.txtArea')
    this.submitBtn = this.shadowRoot.querySelector('submit')
  }

  connectedCallback () {

  }
}

window.customElements.define('x-custom', CustomInput)

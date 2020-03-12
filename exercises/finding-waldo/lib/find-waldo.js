const EventEmitter = require('events')
const path = require('path')

class TextCrawler extends EventEmitter {
  constructor () {
    super()
  }

  addFile (path) {
    console.log(this.emit('something'))
  }

  find () {

  }
}

const test = new TextCrawler()
test.addFile()

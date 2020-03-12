const EventEmitter = require('events')
const fs = require('fs-extra')

class TextCrawler extends EventEmitter {
  constructor (word) {
    super()

    this.word = word
    this.files = []
  }

  // I need a fucntion that will take argument
  // Push argument into array
  addFile () {

  }

  // I need a function that will read each file
  // While it reads the file it should have a callback
  // That will try and find the matching word
  // If the word is found then emit event found
  find () {

  }
}

const test = new TextCrawler()
test.addFile()

const EventEmitter = require('events')
const fs = require('fs-extra')

class TextCrawler extends EventEmitter {
  constructor (word) {
    super()

    this.word = word
    this.files = []
  }

  /**
   * Takes a path to the file and creates array of files.
   *
   * @param {string} file Path to the file.
   * @returns {TextCrawler} The current instanse.
   */
  addFile (file) {
    this.files.push(file)
    return this
  }

  /**
   * Reads each file and finds the required word.
   * If found, emits new event 'found'.
   * If Error, emits new event 'error'.
   *
   * @returns {TextCrawler} The current instanse.
   */
  find () {
    this.files.forEach(async file => {
      try {
        const text = await fs.readFile(file, 'utf-8')
        const matches = text.match(this.word)
        if (matches) {
          matches.forEach(match => {
            this.emit('found', file, match)
          })
        }
      } catch (error) {
        this.emit('error', error)
      }
    })
    return this
  }
}

module.exports.TextCrawler = TextCrawler

// this.files.map(async file => {
//   try {
//     const text = await fs.readFile(file, 'utf-8')
//     const matches = text.match(this.word)
//     if (matches) {
//       matches.map(match => {
//         this.emit('found', file, match)
//       })
//     }
//   } catch (error) {
//     this.emit('error', error)
//   }
// })
// return this

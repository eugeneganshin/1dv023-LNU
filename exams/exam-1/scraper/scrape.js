const fetch = require('node-fetch')
const jsdom = require('jsdom')

const getText = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

/**
 * ToDos: find href links in parser and follow them to parse further.
 */

module.exports.getText = getText

const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

const getInitialLinks = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    const dom = new JSDOM(data)
    const arr = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]'),
      element => element.href)
    console.log(arr.flat())
    return arr.flat()
  } catch (error) {
    console.error(error)
  }
}

const parseCalendar = async arr => {
  try {

  } catch (error) {
    console.error(error)
  }
}

/**
 * ToDos: find href links in parser and follow them to parse further.
 */

module.exports.getInitialLinks = getInitialLinks

const fetch = require('node-fetch')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const urls = ['https://nodejs.org/en/', 'https://developer.mozilla.org/en-US/']

const getText = async url => {
  try {
    const response = await fetch(url)
    const data = await response.text()
    return data
  } catch (err) {
    console.error(err)
  }
}

const getPTag = async text => {
  const data = await text
  const dom = new JSDOM(data)
  console.log(dom.window.document.querySelector('p').textContent)
}

const getLinks = async urls => {
  const promises = urls.map(async url => getText(url))
  const texts = await Promise.all(promises)
  const links = texts.map(text => {
    const dom = new JSDOM(text)
    const arr = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]'), element => element.href)
    return arr
  }).flat()

  return [...new Set(links)]
}

module.exports.getText = getText
module.exports.getLinks = getLinks

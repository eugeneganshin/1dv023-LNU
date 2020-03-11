// npm start https://nodejs.org/en/ https://developer.mozilla.org/en-US/
// so here we need a function that would open both websotes and scrap it
// and create a set of links

// function scrape should take one parameter
// map this parameter to get two urls

const fetch = require('node-fetch')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const nodeLink = 'https://nodejs.org/en/'
const mozillaLink = 'https://developer.mozilla.org/en-US/'
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

const getLinks = async text => {
  const data = await text
  const dom = new JSDOM(data)
  console.log(dom.window.document.querySelector('p').textContent)
}

// extractLinks(urls)
getLinks(getText(nodeLink))
// commnet

const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

/**
 * Helper funciton to get HTML content.
 *
 * @param {string} url Gets route to webpage.
 * @returns {string} Returns HTML game as plain/text.
 */
const getHTML = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    return data
  } catch (error) {
    console.error(error)
  }
}

/**
 * Helper function to get Json content.
 *
 * @param {string} url Gets route to webpage.
 * @returns {JSON} Returns data as json object.
 */
const getJSON = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

/**
 * Creates a new dom object and searches for all a tags with links.
 *
 * @param {string} data Gets html/text as string.
 * @returns {Array} Array of links.
 */
const getInitLinks = async data => {
  try {
    const page = await data
    const dom = new JSDOM(page)
    const arr = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]'),
      element => element.href)
    return arr.flat()
  } catch (error) {
    console.error(error)
  }
}

module.exports = { getHTML, getJSON, getInitLinks }

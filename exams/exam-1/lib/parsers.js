const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const got = require('got')
const { CookieJar } = require('tough-cookie')

const { getHTML, getJSON } = require('./simpleParse')

const parseCalendar = async url => {
  // const res = await fetch(url)
  const data = await getHTML(url)
  const dom = new JSDOM(data)
  const names = Array.from(dom.window.document.querySelectorAll('a'),
    element => element.href)
  const namesLinks = names.map(name => url + name)
  return namesLinks
}

const parseCinema = async (url, day) => {
  // const res = await fetch(url)
  const data = await getHTML(url)
  const dom = new JSDOM(data)
  const movies = Array.from(dom.window.document.querySelector('#movie'), element => element.value)
  const movieValues = movies.splice(1, 3)
  return movieValues
}

const parseMovies = async movieLinks => {
  try {
    const promises = movieLinks.map(async link => getJSON(link))
    const text = await Promise.all(promises)
    const filteredMovies = text.flat().filter((movie) => {
      return movie.status === 1
    })
    return filteredMovies
  } catch (error) {
    console.error(error)
  }
}

const params = new URLSearchParams()
params.append('username', 'zeke')
params.append('password', 'coys')
params.append('submit', 'login')

const testGot = async (urlPost, urlGet) => {
  const cookieJar = new CookieJar()
  const resPost = await got(urlPost, {
    form: params,
    method: 'POST',
    followRedirect: false,
    cookieJar
  })
  const resGet = await got(urlGet, {
    method: 'GET',
    cookieJar
  })
  return resGet.body
}

const parseCafe = async (data) => {
  const dom = new JSDOM(data)
  const availableTime = Array.from(dom.window.document.querySelectorAll('input'), element => element.value)
  console.log(availableTime)
  const len = availableTime.flat().length
  const findAllFridays = val => /fri/.test(val)
  console.log(availableTime.flat().splice(0, len - 1).filter(findAllFridays))
  return availableTime.flat().splice(0, len - 1).filter(findAllFridays)
}

module.exports = { parseCalendar, parseCinema, parseMovies, parseCafe, testGot }

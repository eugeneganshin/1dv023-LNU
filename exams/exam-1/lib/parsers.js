const { JSDOM } = require('jsdom')
const got = require('got')
const { CookieJar } = require('tough-cookie')

const { getHTML, getJSON } = require('./simpleParse')

const parseCalendar = async url => {
  try {
    const data = await getHTML(url)
    const dom = new JSDOM(data)
    const names = Array.from(dom.window.document.querySelectorAll('a'),
      element => element.href)
    const namesLinks = names.map(name => url + name)
    return namesLinks
  } catch (error) {
    console.error(error)
  }
}

const parseCinema = async (url, day) => {
  try {
    const data = await getHTML(url)
    const dom = new JSDOM(data)
    const movies = Array.from(dom.window.document.querySelector('#movie'), element => element.value)
    const movieValues = movies.splice(1, 3)
    return movieValues
  } catch (error) {
    console.error(error)
  }
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

const testGot = async (url) => {
  const cookieJar = new CookieJar()
  const resPost = await got(url + '/login', {
    form: params,
    method: 'POST',
    followRedirect: false,
    cookieJar
  })
  const resGet = await got(url + '/login/booking', {
    method: 'GET',
    cookieJar
  })
  return resGet.body
}

const parseCafe = async (data, ...days) => {
  try {
    const dom = new JSDOM(data)
    const availableTime = Array.from(dom.window.document.querySelectorAll('input'), element => element.value)

    const len = availableTime.flat().length
    const dArr = []

    for (let i = 0; i < days.length; i++) {
      if (days[i] === '05') {
        const findAllFri = val => /fri/.test(val)
        dArr.push(availableTime.flat().splice(0, len - 1).filter(findAllFri))
      }
      if (days[i] === '06') {
        const findAllSat = val => /sat/.test(val)
        dArr.push(availableTime.flat().splice(0, len - 1).filter(findAllSat))
      }
      if (days[i] === '07') {
        const findAllSun = val => /sun/.test(val)
        dArr.push(availableTime.flat().splice(0, len - 1).filter(findAllSun))
      }
    }
    return dArr.flat()
  } catch (error) {
    console.error(error)
  }
}

module.exports = { parseCalendar, parseCinema, parseMovies, parseCafe, testGot }

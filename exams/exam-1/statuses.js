const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')
const qs = require('querystring')
const unirest = require('unirest')
const url = 'http://vhost3.lnu.se:20080/weekend'

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

const getJSON = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

const getInitialLinks = async data => {
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

// Gets the array of links with names
const parseCalendar = async url => {
  const res = await fetch(url)
  const data = await res.text()
  const dom = new JSDOM(data)
  const names = Array.from(dom.window.document.querySelectorAll('a'),
    element => element.href)
  const namesLinks = names.map(name => url + name)
  return namesLinks
}

const parseCinema = async (url, day) => {
  const res = await fetch(url)
  const data = await res.text()
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

const testPromise = async names => {
  const statuses = []
  const name = names.map(name => name.match(/(\b(?:(?!html|http|vhost3|lnu|se|20080|calendar)\w)+\b)/g, '')).flat()

  const promises = names.map(async name => getHTML(name))
  const texts = await Promise.all(promises)
  texts.map(text => {
    const dom = new JSDOM(text)

    const days = Array.from(dom.window.document.querySelectorAll('th'), element => element.textContent)
    const availability = Array.from(dom.window.document.querySelectorAll('td'), element => element.textContent)
    const result = days.reduce((obj, key, i) => ({ ...obj, [key]: availability[i] }), {})
    statuses.push(result)
  })
  const charSchedule = name.reduce((obj, key, i) => ({ ...obj, [key]: statuses[i] }), {})
  return charSchedule
}

const availableDay = async results => {
  if (Object.values(results).every(obj => obj.Friday === 'ok')) {
    return '05'
  }
  if (Object.values(results).every(obj => obj.Satuday === 'OK')) {
    return '06'
  }
  if (Object.values(results).every(obj => obj.Sunday === 'ok')) {
    return '07'
  }
}

const generateLink = async (deuces, seats, races, day) => {
  const deucesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${deuces}`
  const seatsLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${seats}`
  const racesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${races}`
  return [deucesLink, seatsLink, racesLink]
}

const pathToFile = path.resolve('data', 'statuses.json')

// const options = {
//   headers: {
//     cookie: 'accessToken='
//   }
// }

const main = async () => {
  try {
    const data = getHTML(url)
    const [calendar, cinema, dinner] = await getInitialLinks(data)
    const [paul, peter, mary] = await parseCalendar(calendar)
    const [deuces, seats, races] = await parseCinema(cinema)
    const results = await testPromise([paul, peter, mary])
    const day = await availableDay(results)
    const movieLinks = await generateLink(deuces, seats, races, day)
    const availableMovies = parseMovies(movieLinks)
    const login = await getHTML('http://vhost3.lnu.se:20080/dinner/login/booking')
    console.log(login)
    // await fs.writeJson(pathToFile, results)
  } catch (error) {
    console.error(error)
  }
}
main()

const req = unirest('POST', 'http://vhost3.lnu.se:20080/dinner/login')
  .headers({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
  .send('username=zeke')
  .send('password=coys')
  // .followRedirect(true)
  .end(function (res) {
    if (res.error) throw new Error(res.error)
    console.log(res.cookies)
  })

// console.log(getHTML('http://vhost3.lnu.se:20080/dinner/login/booking'))

const fetch = require('node-fetch')
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')

const { CookieJar } = require('tough-cookie')

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

const params = new URLSearchParams()
params.append('username', 'zeke')
params.append('password', 'coys')
params.append('submit', 'login')

const testGot = async () => {
  const cookieJar = new CookieJar()
  const resPost = await got('http://vhost3.lnu.se:20080/dinner/login', {
    form: params,
    method: 'POST',
    followRedirect: false,
    cookieJar
  })
  const resGet = await got('http://vhost3.lnu.se:20080/dinner/login/booking', {
    method: 'GET',
    cookieJar
  })
  return resGet.body
}

const parseCafe = async (data) => {
  const dom = new JSDOM(data)
  const availableTime = Array.from(dom.window.document.querySelectorAll('input'), element => element.value)
  const len = availableTime.flat().length
  const findAllFridays = val => /(fri)/.test(val)

  return availableTime.flat().splice(0, len - 1).filter(findAllFridays)
}

const pathToFile = path.resolve('data', 'statuses.json')

const url = 'http://vhost3.lnu.se:20080/weekend'

const logic = (moviesStatus, cafeSlots) => {
  console.log(moviesStatus)
  console.log(cafeSlots)
  const movieslotSplit = cafeSlots.map(val => val.split(/(\d+)/))
  const splitNum = str => {
    const middle = Math.ceil(str.length / 2)
    const s1 = str.slice(0, middle)
    const s2 = str.slice(middle)
    return s1 + '.' + s2
  }
  const a = movieslotSplit.map(val => splitNum(val[1]))
  const movieSlot = []
  for (let i = 0; i < moviesStatus.length; i++) {
    for (let j = 0; j < a.length; j++) {
      movieSlot.push((parseFloat(a[j]).toFixed(2) - parseInt(moviesStatus[i].time)).toFixed(2) + ' ' + moviesStatus[i].movie + ' ' + moviesStatus[i].time + ' ' + movieslotSplit[j])
    }
  }
  console.log(movieSlot)
  const IfMoreThanTwoHours = el => {
    return el[0] >= 2
  }
  const movieName = el => {
    if (el[1] === '01') {
      return ' The Flying Deuces' + el[2]
    } else if (el[1] === '02') {
      return ' Keep Your Seats, Please' + el[2]
    } else if (el[1] === '03') {
      return ' A day at the races' + el[2]
    } else {
      return 'No such movie'
    }
  }
  const aqq = movieSlot.filter(IfMoreThanTwoHours).map(val => val.split(' '))
  console.log(aqq.map(movieName))
  console.log(aqq)
}

const main = async (url) => {
  try {
    const startPage = getHTML(url)
    const [calendar, cinema, dinner] = await getInitialLinks(startPage)

    const [paul, peter, mary] = await parseCalendar(calendar)
    const [deuces, seats, races] = await parseCinema(cinema)
    const results = await testPromise([paul, peter, mary])
    const day = await availableDay(results) // gets friday

    const movieLinks = await generateLink(deuces, seats, races, day)
    const availableMovies = await parseMovies(movieLinks) // gets movies in friday
    // await fs.writeJson(pathToFile, results)
    const cafePage = await testGot()
    const cafeSlots = await parseCafe(cafePage)
    await logic(availableMovies, cafeSlots)
  } catch (error) {
    console.error(error)
  }
}

main(url)

// movie 02 at 16:00 and movie 03 at 16:00
// table empty at 18:20

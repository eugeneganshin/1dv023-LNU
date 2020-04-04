const fetch = require('node-fetch')
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path')

const { getHTML, getJSON, getInitLinks } = require('./lib/simpleParse')
const { parseCalendar, parseCinema, parseMovies, testGot, parseCafe } = require('./lib/parsers')
const { charSchedulePromise, availableDay, generateLink } = require('./lib/dataManipulation')
const { logic } = require('./lib/logic')

const url1 = 'http://vhost3.lnu.se:20080/weekend'
const url2 = 'http://cscloud304.lnu.se:8080/'
const username = 'zeke'
const password = 'coys'

const urlPost = 'http://vhost3.lnu.se:20080/dinner/login'
const urlGet = 'http://vhost3.lnu.se:20080/dinner/login/booking'
const urlPost2 = 'http://cscloud304.lnu.se:8080/dinner2/login'
const urlGet2 = 'http://cscloud304.lnu.se:8080/dinner2/login/booking'

const main = async url => {
  const startPage = await getHTML(url)
  const [calendar, cinema, dinner] = await getInitLinks(startPage)

  const [paul, peter, mary] = await parseCalendar(calendar)
  const charSchedule = await charSchedulePromise([paul, peter, mary])
  const [deuces, seats, races] = await parseCinema(cinema)

  const [...days] = await availableDay(charSchedule)
  const movieLinks = await generateLink(deuces, seats, races, ...days)

  const availableMovies = await parseMovies(movieLinks)

  const cafePage = await testGot(urlPost2, urlGet2)
  const cafeSlots = await parseCafe(cafePage)

  const result = await logic(availableMovies, cafeSlots)

  console.log(days)
}

main(url2)

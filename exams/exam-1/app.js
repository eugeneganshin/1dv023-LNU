const fetch = require('node-fetch')
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path')

const { getHTML, getJSON, getInitLinks } = require('./lib/simpleParse')
const { parseCalendar, parseCinema, parseMovies, parseCafe } = require('./lib/parsers')
const { charSchedulePromise, availableDay, generateLink } = require('./lib/dataManipulation')

const url1 = 'http://vhost3.lnu.se:20080/weekend'
const url2 = 'http://cscloud304.lnu.se:8080/'
const username = 'zeke'
const password = 'coys'

const main = async url => {
  const startPage = await getHTML(url)
  const [calendar, cinema, dinner] = await getInitLinks(startPage)
  const [paul, peter, mary] = await parseCalendar(calendar)
  const charSchedule = await charSchedulePromise([paul, peter, mary])
  const day = await availableDay(charSchedule)
  // console.log(charSchedule)
  // console.log(day)
}

main(url2)

const { getHTML, getInitLinks } = require('./lib/simpleParse')
const { parseCalendar, parseCinema, parseMovies, testGot, parseCafe } = require('./lib/parsers')
const { charSchedulePromise, availableDay, generateLink } = require('./lib/dataManipulation')
const { logic } = require('./lib/logic')

const url1 = 'http://vhost3.lnu.se:20080/weekend'
const url2 = 'http://cscloud304.lnu.se:8080/'

const main = async url => {
  try {
    const startPage = await getHTML(url)
    const [calendarUrl, cinemaUrl, dinnerUrl] = await getInitLinks(startPage)

    const [paul, peter, mary] = await parseCalendar(calendarUrl)
    const charSchedule = await charSchedulePromise([paul, peter, mary])
    const [deuces, seats, races] = await parseCinema(cinemaUrl)

    const [...days] = await availableDay(charSchedule)
    const movieLinks = await generateLink(deuces, seats, races, ...days)

    const availableMovies = await parseMovies(movieLinks)

    const cafePage = await testGot(dinnerUrl)
    const cafeSlots = await parseCafe(cafePage, ...days)

    const result = await logic(availableMovies, cafeSlots)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

main(url2)

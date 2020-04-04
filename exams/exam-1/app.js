const { getHTML, getInitLinks } = require('./lib/helpers')
const { parseCalendar, parseCinema, parseMovies, auth, parseCafe } = require('./lib/parsers')
const { charSchedulePromise, availableDay, generateLink } = require('./lib/dataManipulation')
const { logic } = require('./lib/logic')

const url1 = 'http://vhost3.lnu.se:20080/weekend' // test this url in main()
const url2 = 'http://cscloud304.lnu.se:8080/' // test this url in main()

/**
 * The logic of the application.
 *
 * @param {string} url Url of the site to scrape.
 */
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

    const cafePage = await auth(dinnerUrl)
    const cafeSlots = await parseCafe(cafePage, ...days)

    const suggesitons = await logic(availableMovies, cafeSlots)

    console.log('Recommendations')
    console.log('===============')
    console.log(suggesitons)
  } catch (error) {
    console.error(error)
  }
}

main(url1)

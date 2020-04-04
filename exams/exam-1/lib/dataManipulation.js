const { getHTML, getJSON } = require('./simpleParse')
const { JSDOM } = require('jsdom')

const charSchedulePromise = async names => {
  const statuses = []
  const name = names.map(name => name.match(/(\b(?:(?!html|http|vhost3|lnu|se|20080|calendar|cscloud304|8080|cscloud304)\w)+\b)/g, '')).flat()
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

const availableDay = async schedule => {
  const daysArr = []
  const s = 'ok'
  if (Object.values(schedule).every(obj => s === obj.Friday.toLowerCase())) {
    const friday = '05'
    daysArr.push(friday)
  }
  if (Object.values(schedule).every(obj => s === obj.Saturday.toLowerCase())) {
    const saturday = '06'
    daysArr.push(saturday)
  }
  if (Object.values(schedule).every(obj => s === obj.Sunday.toLowerCase())) {
    const sunday = '07'
    daysArr.push(sunday)
  }
  return daysArr
}

const generateLink = async (deuces, seats, races, ...days) => {
  const links = []
  for (let i = 0; i < days.length; i++) {
    const deucesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${days[i]}&movie=${deuces}`
    const seatsLink = `http://vhost3.lnu.se:20080/cinema/check?day=${days[i]}&movie=${seats}`
    const racesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${days[i]}&movie=${races}`
    links.push(deucesLink, seatsLink, racesLink)
  }
  return links
}

module.exports = { charSchedulePromise, availableDay, generateLink }

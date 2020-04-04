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
  const ok = new RegExp('ok', 'ig')
  const re = /ok/ig
  if (Object.values(schedule).every(obj => ok.test(obj.Friday))) {
    console.log('match 05')
  } else if (Object.values(schedule).every(obj => ok.test(obj.Saturday))) {
    console.log('match 06')
  } else if (Object.values(schedule).every(obj => ok.test(obj.Sunday))) {
    console.log('match 07')
  }
  // if (Object.values(schedule).every(obj => re.test(obj.Friday))) {
  //   console.log('match 05')
  // } else if (Object.values(schedule).every(obj => re.test(obj.Saturday))) {
  //   console.log('match 06')
  // } else if (Object.values(schedule).every(obj => re.test(obj.Sunday))) {
  //   console.log('match 07')
  // }
  // console.log(daysArr)
  return daysArr
}

const generateLink = async (deuces, seats, races, day) => {
  const deucesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${deuces}`
  const seatsLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${seats}`
  const racesLink = `http://vhost3.lnu.se:20080/cinema/check?day=${day}&movie=${races}`
  return [deucesLink, seatsLink, racesLink]
}

module.exports = { charSchedulePromise, availableDay, generateLink }

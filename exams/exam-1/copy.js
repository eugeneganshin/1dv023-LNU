const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')

const url = 'http://vhost3.lnu.se:20080/weekend'

const getHTML = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    return data
  } catch (error) {
    console.error(error)
  }
}

const getInitialLinks = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    const dom = new JSDOM(data)
    const arr = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]'),
      element => element.href)
    return arr.flat()
  } catch (error) {
    console.error(error)
  }
}

// Gets the array of links with names
const parseCalendar = async urlCalendar => {
  const res = await fetch(urlCalendar)
  const data = await res.text()
  const dom = new JSDOM(data)
  const names = Array.from(dom.window.document.querySelectorAll('a'),
    element => element.href)
  const namesLinks = names.map(name => urlCalendar + name)
  return namesLinks
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

const pathToFile = path.resolve('data', 'statuses.json')

const main = async () => {
  try {
    const [calendar, cinema, dinner] = await getInitialLinks(url)
    const [paul, peter, mary] = await parseCalendar(calendar)
    const results = await testPromise([paul, peter, mary])
    await fs.writeJson(pathToFile, results)
    if (Object.values(results).every(obj => obj.Friday === 'ok')) {
      // do something
    }
    if (Object.values(results).every(obj => obj.Satuday === 'OK')) {
      // do something
    }
    if (Object.values(results).every(obj => obj.Sunday === 'ok')) {
      // do something
    }
  } catch (error) {
    console.error(error)
  }
}
main()

// if days are duplicates => add property yes!
// need to check the available day and return the name of the day

// read json file and check the dates => return day (friday)
// read html page of calendar for friday and pull all the movies time
// counter for each day. if counter === 3 => ok

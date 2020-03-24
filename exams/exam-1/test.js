const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

const url = 'http://vhost3.lnu.se:20080/weekend'
const url2 = 'http://vhost3.lnu.se:20080/calendar'

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
    // console.log(arr)
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
  // console.log(namesLinks)
  return namesLinks
}

// returns object
const checkIfAvailable = async personLink => {
  try {
    const res = await fetch(personLink)
    const data = await res.text()
    const dom = new JSDOM(data)
    const days = Array.from(dom.window.document.querySelectorAll('th'),
      element => element.textContent)
    const availability = Array.from(dom.window.document.querySelectorAll('td'),
      element => element.textContent)

    const result = availability.reduce((result, field, index) => {
      result[days[index]] = field
      return result
    }, {})
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }
}

const testPromise = async names => {
  const status = []
  // try extract a name from the string
  const name = names.map(name => name)
  console.log(name)
  const promises = names.map(async name => getHTML(name))
  const texts = await Promise.all(promises)
  texts.map(text => {
    const dom = new JSDOM(text)
    const days = Array.from(dom.window.document.querySelectorAll('th'), element => element.textContent)
    const availability = Array.from(dom.window.document.querySelectorAll('td'), element => element.textContent)

    const result = availability.reduce((result, field, index) => {
      result[days[index]] = field
      return result
    }, {})
    status.push(result)
  })
  console.log(status)
  return status
}

const main = async () => {
  try {
    const [calendar, cinema, dinner] = await getInitialLinks(url)
    const [paul, peter, mary] = await parseCalendar(calendar)
    await testPromise([paul, peter, mary])
    // console.log(test)
    // await testPromise(parseCalendar(calendar))
    // await testMap(['a', 'b', 'c'])

    // const paulPage = await checkIfAvailable(mary)
    // console.log(paul, peter, mary)
  } catch (error) {
    console.error(error)
  }
}
main()

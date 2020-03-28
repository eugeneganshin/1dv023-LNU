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

// returns object
// const checkIfAvailable = async personLink => {
//   try {
//     const res = await fetch(personLink)
//     const data = await res.text()
//     const dom = new JSDOM(data)
//     const days = Array.from(dom.window.document.querySelectorAll('th'),
//       element => element.textContent)
//     const availability = Array.from(dom.window.document.querySelectorAll('td'),
//       element => element.textContent)

//     const result = availability.reduce((result, field, index) => {
//       result[days[index]] = field
//       return result
//     }, {})
//     return result
//   } catch (error) {
//     console.error(error)
//   }
// }

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

    let friday = 0
    let saturday = 0
    let sunday = 0
    Object.entries(results).forEach(([key, val]) => {
      switch (val.Friday) {
        case 'OK':
          friday++
          break
        case 'ok':
          friday++
      }
      switch (val.Saturday) {
        case 'OK':
          saturday++
          break
        case 'ok':
          saturday++
      }
      switch (val.Sunday) {
        case 'OK':
          sunday++
          break
        case 'ok':
          sunday++
      }
    })
    console.log(friday + ' friday')
    console.log(saturday + ' saturday')
    console.log(sunday + ' sunday')
  } catch (error) {
    console.error(error)
  }
}
main()

// need to check the available day and return the name of the day

// read json file and check the dates => return day (friday)
// read html page of calendar for friday and pull all the movies time
// counter for each day. if counter === 3 => ok

/** .
 * const loopNestedObj = obj => {
      let counter = 0
      Object.entries(obj).forEach(([key, val]) => {
        console.log(key)
        // console.log(val)
        if (val && typeof val === 'object') {
          Object.entries(val).forEach(([key, val]) => {
            console.log(val)
          })
        } else {
          console.log(val)
        }
      })
    }
    await loopNestedObj(results).

    let fridayCount = 0
    Object.entries(results).forEach(([key, val]) => {
      if (val.Friday === 'OK') {
        fridayCount++
      } else if (val.Friday === 'ok') {
        fridayCount++
      }
    })
    console.log(fridayCount)
 */

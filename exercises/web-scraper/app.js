const path = require('path')
const fs = require('fs-extra')
const { getLinks } = require('./lib/scrape')

const pathToFile = path.resolve('data', 'links.json')
const links = ['https://nodejs.org/en/', 'https://developer.mozilla.org/en-US/']

const test = async () => {
  try {
    const existingLinksPromise = fs.readJson(pathToFile).catch(error => [])
    const scrapedLinksPromise = getLinks(links)

    const data = await Promise.all([existingLinksPromise, scrapedLinksPromise].flat())
    const set = [...(new Set(data.flat()))].sort()
    await fs.writeJson(pathToFile, set, { spaces: 4 })
  } catch (error) {
    console.error(error)
  }
}

test()

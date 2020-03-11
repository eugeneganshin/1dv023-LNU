'use strict'
const path = require('path')
const { getAverage } = require('./lib/reviewer')

const solution = async () => {
  try {
    console.time('path.resolve')
    const imdbPath = path.resolve(__dirname, 'lib', 'movies', 'movies.json')
    const rottenTomatosPath = path.resolve(__dirname, 'lib', 'movies', 'movies.xml')
    console.timeEnd('path.resolve')
    console.time('getAverage')
    const imdbPromise = getAverage(imdbPath)
    const rottenTomatosPromise = getAverage(rottenTomatosPath)
    console.timeEnd('getAverage')
    console.time('promiseAll')
    const [imdb, rottenTomatos] = await Promise.all([imdbPromise, rottenTomatosPromise])
    console.log('Average rating')
    console.log('IMDB: ' + imdb)
    console.log('Rotten tomators:' + rottenTomatos)
    console.timeEnd('promiseAll')
  } catch (error) {
    console.error(error)
  }
}
solution()

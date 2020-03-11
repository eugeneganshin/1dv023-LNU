'use strict'
const path = require('path')
const { getAverage } = require('./lib/reviewer')

const solution = async () => {
  try {
    const imdbPath = path.resolve(__dirname, 'lib', 'movies', 'movies.json')
    const rottenTomatosPath = path.resolve(__dirname, 'lib', 'movies', 'movies.xml')

    const imdbPromise = getAverage(imdbPath)
    const rottenTomatosPromise = getAverage(rottenTomatosPath)

    const [imdb, rottenTomatos] = await Promise.all([imdbPromise, rottenTomatosPromise])
    console.log('Average rating')
    console.log('IMDB: ' + imdb)
    console.log('Rotten tomators:' + rottenTomatos)
  } catch (error) {
    console.error(error)
  }
}
solution()

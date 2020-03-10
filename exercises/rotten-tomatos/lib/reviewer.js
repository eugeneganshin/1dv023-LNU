'use strict'

const fs = require('fs')
const xml2js = require('xml2js')

// const parser = new xml2js.Parser()
const { resolve } = require('path')

const imdbPath = resolve('lib', 'movies', 'movies.json')
const rottenTomatosPath = resolve('lib', 'movies', 'movies.xml')
const readFile = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(typeof (data))
        resolve(data)
      }
    })
  })
}

const getAverage = async () => {
  const parser = new xml2js.Parser()
  const text = await readFile(imdbPath, 'utf-8')
  let data = text.startsWith('<?xml')
    ? (await parser.parseStringPromise(text)).movies.movies
    : JSON.parse(text)
  data = data.map(m => m.rating).reduce((a, b) => a + Number(b), 0) / data.length
  console.log(data)
}

// readFile(imdbPath, 'utf-8')
getAverage()
module.exports.readFile = readFile

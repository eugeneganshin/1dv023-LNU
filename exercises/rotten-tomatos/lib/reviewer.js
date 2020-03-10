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
  const data = JSON.parse(text)
  console.log(typeof (data))
}

readFile(imdbPath, 'utf-8')
// getAverage()
module.exports.readFile = readFile

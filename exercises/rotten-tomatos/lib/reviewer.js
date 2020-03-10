'use strict'

const fs = require('fs')
const xml2js = require('xml2js')

const parser = new xml2js.Parser()
const { resolve } = require('path')

const imdbPath = resolve('lib', 'movies', 'movies.json')
const readFile = (path, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data)
        resolve(data)
      }
    })
  })
}

readFile(imdbPath, 'utf-8')
module.exports.readFile = readFile

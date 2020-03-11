'use strict'

const xml2js = require('xml2js')
const { readFile } = require('./fs-promise')

const getAverage = async (path) => {
  const parser = new xml2js.Parser()
  const text = await readFile(path, 'utf-8')
  let data = text.startsWith('<?xml')
    ? (await parser.parseStringPromise(text)).movies.movie
    : JSON.parse(text)
  data = data
    .map(m => m.rating)
    .reduce((sum, rating) => sum + Number(rating), 0) / data.length
  return data
}

module.exports.getAverage = getAverage

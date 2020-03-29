const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')
const path = require('path')
const fs = require('fs-extra')

const url = 'http://vhost3.lnu.se:20080/cinema'
const traffic = 'http://vhost3.lnu.se:20080/cinema/check?day=05&movie=01'

const getHTML = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    console.log(data)
    return data
  } catch (error) {
    console.error(error)
  }
}

const getTraffic = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

// getTraffic(traffic)
getHTML(url)

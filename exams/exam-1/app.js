const path = require('path')
const fs = require('fs-extra')
const { getInitialLinks } = require('./scraper/scrape')

const url = 'http://vhost3.lnu.se:20080/weekend'
const url2 = 'http://vhost3.lnu.se:20080/calendar'

const username = 'zeke'
const password = 'coys'

getInitialLinks(url)

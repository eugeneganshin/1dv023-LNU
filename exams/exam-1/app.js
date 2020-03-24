const path = require('path')
const fs = require('fs-extra')
const { getText } = require('./scraper/scrape')

const url = 'http://vhost3.lnu.se:20080/weekend'

getText(url)

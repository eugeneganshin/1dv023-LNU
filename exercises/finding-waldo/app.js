const { TextCrawler } = require('./lib/find-waldo')

const textCrawler = new TextCrawler(/waldo/i)

textCrawler.on('found', (file, match) => console.log(`Matched ${match} in file ${file}`))
textCrawler.on('error', error => console.error(`Error: ${error.message}`))

textCrawler.addFile('data/file1.txt')
  .addFile('data/file2.txt')
  .addFile('data/file3.json')
  .addFile('data/file4.json')
  .addFile('data/file5.json')

textCrawler.find()

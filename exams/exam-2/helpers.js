const helpers = {}

helpers.test = (el) => {
  return el
}

helpers.ifPre = (el1, el2, options) => {
  if (el1.startsWith('```')) {
    return 'true'
  }
}

module.exports = helpers

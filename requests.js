var xhr = require('xhr')
var request = require('request')

module.exports = {
  metadata: metadata,
  data: data
}

function data (link, entry) {
  var opts = {
    method: 'POST',
    baseUrl: window.location.origin,
    body: JSON.stringify({link: link, entry: entry})
  }
  return request('/data', opts)
}

function metadata (link, cb) {
  var options = {
    uri: '/metadata?link=' + link,
    json: true
  }
  xhr(options, cb)
}

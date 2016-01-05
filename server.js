var http = require('http')
var routes = require('./routes.js')

module.exports = function () {
  return http.createServer(function (req, res) {
    routes(req, res)
  })
}

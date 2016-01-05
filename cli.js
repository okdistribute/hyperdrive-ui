var server = require('./server')()
var port = process.env.PORT || process.argv[2] || 8080
server.listen(port, function (err) {
  if (err) throw err
  console.log('Listening on port', port)
})

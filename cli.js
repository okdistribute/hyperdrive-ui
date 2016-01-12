var http = require('http')
var dat = require('dat')
var pump = require('pump')
var path = require('path')
var body = require('body/json')
var url = require('url')
var fs = require('fs')

var server = http.createServer(function (req, res) {
  if (req.url === '/') return res.end(fs.readFileSync('./index.html').toString())
  else {
    var match = req.url.match(/static\/(.*)/)
    if (match) {
      var file = match[1]
      res.end(fs.readFileSync(path.join(__dirname, file)).toString())
    }
  }
  var db = dat()
  if (req.url.match('/metadata')) {
    var query = url.parse(req.url, true).query
    var link = query.link
    if (!link) return res.end('link parameter missing')
    db.metadata(link, function (err, data) {
      if (err) return res.end({'Error': err.message})
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    })
  } else if (req.url.match('/data')) {
    body(req, function (err, data) {
      if (err) return res.end({'Error': err.message})
      db.joinTcpSwarm(data.link, function (_err, link, port, close) {
        if (!data.entry.link) return res.end()
        if (data.entry.link.id.type === 'Buffer') data.entry.link.id = new Buffer(data.entry.link.id.data)
        var content = db.drive.get(data.entry)
        var stream = content.createStream()
        res.setHeader('Content-Type', 'application/octet-stream')
        pump(stream, res, function (err) {
          if (err) throw err
          close()
        })
      })
    })
  } else res.end('404')
})

var port = process.env.PORT || process.argv[2] || 8080
server.listen(port, function (err) {
  if (err) throw err
  console.log('Listening on port', port)
})

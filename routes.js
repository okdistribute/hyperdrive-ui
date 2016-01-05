var dat = require('dat')
var url = require('url')
var fs = require('fs')

module.exports = function (req, res) {
  if (req.url === '/') return res.end(fs.readFileSync('./index.html').toString())
  if (req.url.match('/metadata')) {
    var query = url.parse(req.url, true).query
    var link = query.link
    if (!link) return res.end('link parameter missing')
    var db = dat()
    db.metadata(link, function (err, data) {
      if (err) return res.end({'Error': err.message})
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    })
  } else if (req.url.match(/bundle.js/)) {
    res.end(fs.readFileSync('./bundle.js').toString())
  } else res.end('404')
}

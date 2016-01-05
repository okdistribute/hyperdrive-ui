var Ractive = require('ractive')
var fs = require('fs')
var tree = require('tree-view')
var xhr = require('xhr')

module.exports = function (el, link) {
  if (typeof el === 'string') el = document.querySelector(el)
  Ractive({
    el: el,
    template: fs.readFileSync('./dat.html').toString(),
    data: { link: link },
    onrender: function () {
      var self = this
      var browser = tree()
      self.set('loading', true)
      metadata(link, function (err, resp, entries) {
        if (err) throw err
        self.set('loading', false)
        var children = []
        entries.forEach(function (entry) {
          console.log(entry)
          children.push({
            type: entry.type,
            path: entry.value.name
          })
        })
        browser.directory('/', children)
        browser.appendTo(document.getElementById('file-list'))
      })
    }
  })
}

function metadata (link, cb) {
  var options = {
    uri: '/metadata?link=' + link,
    json: true
  }
  xhr(options, cb)
}

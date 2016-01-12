var Ractive = require('ractive')
var fs = require('fs')
var data = require('render-data')

var requests = require('./requests')
var tree = require('./components/tree-view.js')

module.exports = function (el, link) {
  if (typeof el === 'string') el = document.querySelector(el)
  Ractive({
    el: el,
    template: fs.readFileSync('./dat.html').toString(),
    data: { link: link },
    onrender: function () {
      var self = this
      self.set('loading', true)
      requests.metadata(link, function (err, resp, entries) {
        if (err) throw err
        self.set('loading', false)
        var browser = tree(entries, document.getElementById('file-list'))
        browser.on('entry', function (entry) {
          var file = {
            name: entry.path,
            length: entry.size,
            createReadStream: function () { return requests.data(link, entry.entry) }
          }
          var $display = document.querySelector('#display')
          data.render(file, $display, function (err, elem) {
            if (err) throw err
            $display.style.display = 'block'
          })
        })
      })
    }
  })
}

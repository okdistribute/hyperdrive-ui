var Ractive = require('ractive')
var fs = require('fs')
var xhr = require('xhr')

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
      metadata(link, function (err, resp, entries) {
        if (err) throw err
        self.set('loading', false)
	tree(entries, document.getElementById('file-list'), el)
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

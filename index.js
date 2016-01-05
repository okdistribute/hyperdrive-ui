var Ractive = require('ractive')
var fs = require('fs')
var Dat = require('dat-browserify')

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
      var db = Dat({
        signalhub: ['exploredat', ['https://signalhub.mafintosh.com']]
      })
      db.metadata(link, function (err, entries) {
        if (err) throw err
        self.set('loading', false)
        tree(entries, document.getElementById('file-list'))
      })
    }
  })
}

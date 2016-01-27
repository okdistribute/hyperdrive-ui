var Ractive = require('ractive')
var fs = require('fs')
var data = require('render-data')

var Feed = require('./feed.js')
var tree = require('./components/tree-view.js')

module.exports = function (el, link) {
  if (typeof el === 'string') el = document.querySelector(el)
  link = link.replace('dat://', '').replace('dat:', '')

  Ractive({
    el: el,
    template: fs.readFileSync('./dat.html').toString(),
    data: { link: link },
    onrender: function () {
      var self = this
      var $display = document.querySelector('#display')
      var $overlay = document.querySelector('#overlay')

      var feed = Feed(link)
      var entries = []
      var stream = feed.createStream()
      self.set('loading', true)

      var timeOut = setTimeout(function (errorMsg) {
        self.set('loading', false)
        $display.style.display = 'block'
        $display.innerHTML = '<h1>' + errorMsg + '</h1>'
        $display.onclick = clearMedia
        $display.style['color'] = 'red'
      }, 2000, "timed out: check the dat's host")

      var clearMedia = function () {
        $display.style.display = 'none'
        $overlay.style.display = 'none'
        $display.innerHTML = ''
      }

      stream.on('data', function (entry) {
        clearTimeout(timeOut)
        self.set('loading', false)
        entries.push(entry)

        tree('/', entries, document.getElementById('file-list'),
             function (err, entry) { // how to display files
               if (err) return err
               self.set('loading', false)
               if (entry.size !== 0) {
                 var file = {
                   name: entry.path,
                   length: entry.size,
                   createReadStream: function (opts) {
                     return feed.getFile(entry.data).createStream(opts)
                   }
                 }
                 clearMedia()
                 data.render(file, $display, function (err, elem) {
                   if (err) return err
                   $display.style.display = 'block'
                   elem.onclick = clearMedia
                   $display.style['background-color'] = elem.tagName === 'IFRAME' ? 'white' : 'black'
                 })
               }
             })
        self.on('clearMedia', clearMedia)
      })
    }
  })
}

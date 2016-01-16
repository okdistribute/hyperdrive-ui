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
      stream.on('data', function (entry) {
        entries.push(entry)
        var browser = tree('/', entries, document.getElementById('file-list'))

        browser.on('entry', function (entry) {
          if (entry.type === 'file') {
            var file = {
              name: entry.path,
              length: entry.size,
              createReadStream: function (opts) {
                return feed.getFile(entry.data).createStream(opts)
              }
            }
            clearMedia()
            data.render(file, $display, function (err, elem) {
              if (err) throw err
              $display.style.display = 'block'
              $overlay.style.display = 'block'
              elem.onclick = clearMedia
              $display.style['background-color'] = elem.tagName === 'IFRAME' ? 'white' : 'black'
            })
          }
        })
      })

      var clearMedia = function () {
        $display.style.display = 'none'
        $overlay.style.display = 'none'
        $display.innerHTML = ''
      }
      self.on('clearMedia', clearMedia)
    }
  })
}

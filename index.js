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
        $overlay.style.display = 'block'
        $overlay.innerHTML = '<h1>' + errorMsg + '</h1>'
        $overlay.onclick = clearMedia
        $overlay.style['color'] = 'red'
      }, 1000, "timed out: check the dat's host")

      stream.on('data', function (entry) {
        clearTimeout(timeOut)
        self.set('loading', false)
        entries.push(entry)
        var browser = tree('/', entries, document.getElementById('file-list'))

        browser.on('entry', function (entry) {
          display(entry)

          function display (entry) {
            if (entry.type === 'file') {
              displayFile(entry)
            } else { // entry.type === 'directory'
              displayDirectory(entry)
            }
          }

          function displayDirectory (entry) {
            browser = tree(entry.path, entries, document.getElementById('file-list'))
            browser.on('entry', function (entry) { display(entry) })
          }

          function displayFile (entry) {
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
                if (err) throw err
                $display.style.display = 'block'
                $overlay.style.display = 'block'
                elem.onclick = clearMedia
                $display.style['background-color'] = elem.tagName === 'IFRAME' ? 'white' : 'black'
              })
            }
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

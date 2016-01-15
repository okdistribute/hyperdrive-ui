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
      self.set('hash', link.replace('dat://', '').replace('dat:', ''))
      var $display = document.querySelector('#display')
      var $overlay = document.querySelector('#overlay')

      self.set('loading', true)
      requests.metadata(link, function (err, resp, entries) {
        if (err) throw err
        self.set('loading', false)
        createTree('/', entries)
      })
      
      var createTree = function (dir, entries) {
        var fileList = document.getElementById('file-list')
        fileList.innerHTML = ''
        var browser = tree(dir, entries, fileList)
        browser.on('entry', function (entry) {
          console.log('got', entry)
          if (entry.type === 'directory') {
            browser = createTree(entry.path, entries)
          } else {
            var file = {
              name: entry.path,
              length: entry.size,
              createReadStream: function () { return requests.data(link, entry.entry) }
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
      }

      var clearMedia = function () {
        $display.style.display = 'none'
        $overlay.style.display = 'none'
        $display.innerHTML = ''
      }
      self.on('clearMedia', clearMedia)
    }
  })
}

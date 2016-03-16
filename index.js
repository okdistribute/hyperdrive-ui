var Ractive = require('ractive')
var fs = require('fs')
var data = require('render-data')

var Dat = require('dat-browserify')
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
      var db = Dat()
      var swarm = db.join(link)

      swarm.on('peer', function (peer) {
        console.log('get', peer)
      })

      var archive = db.drive.get(new Buffer(link, 'hex'), '.')

      var entries = []
      var entryStream = archive.createEntryStream()
      self.set('loading', true)
      console.log('created entry stream')

      entryStream.on('data', function (entry) {
        console.log('got', entry)
        // clearTimeout(timeOut)
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
                   return archive.getFileStream(entry.data)
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
      //
      // var timeOut = setTimeout(function (errorMsg) {
      //   self.set('loading', false)
      //   $display.style.display = 'block'
      //   $display.innerHTML = '<h1>' + errorMsg + '</h1>'
      //   $display.onclick = clearMedia
      //   $display.style['color'] = 'red'
      // }, 20000, "timed out: check the dat's host")

      var clearMedia = function () {
        $display.style.display = 'none'
        $overlay.style.display = 'none'
        $display.innerHTML = ''
      }
    }
  })
}

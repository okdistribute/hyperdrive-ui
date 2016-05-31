var hyperdrive = require('hyperdrive')
var memdb = require('memdb')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var db = memdb()
var drive = hyperdrive(db)
var explorer = require('./')

var archive
var url = window.location.toString()
var key = url.split('#')[1]
main(key)

var button = document.querySelector('#new')
button.onclick = function () { main(null) }

function main (key) {
  archive = drive.createArchive(key, {live: true})
  window.location = '#' + archive.key.toString('hex')
  explorer('#dat', archive)
}

drop(document.body, function (files) {
  var i = 0
  loop()

  function loop () {
    if (i === files.length) return console.log('added files', files)

    var file = files[i++]
    var stream = fileReader(file)
    stream.pipe(choppa(16 * 1024)).pipe(archive.createFileWriteStream(file.fullPath)).on('finish', loop)
  }
})

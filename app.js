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
  var help = document.querySelector('#help-text')
  if (key) help.innerHTML = 'looking for peers...'
  else help.innerHTML = 'drag and drop files'

  archive = drive.createArchive(key, {live: true})
  window.location = '#' + archive.key.toString('hex')
  var sw = explorer('#dat', archive, onclick)
  sw.on('peer', function () { help.innerHTML = '' })
  archive.list().on('data', function () { help.innerHTML = '' })
}

function onclick (err, file) {
  if (err) throw err
  var $display = document.querySelector('#display')
  $display.innerHTML = ''
  data.render(file, $display, function (err, elem) {
    if (err) return err
  })
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

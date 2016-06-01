var hyperdrive = require('hyperdrive')
var data = require('render-data')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var db = level('./hyperdrive')
var drive = hyperdrive(db)
var explorer = require('./')

var $display = document.querySelector('#display')
var $hyperdrive = document.querySelector('#ui')

var archive
var url = window.location.toString()
var key = url.split('#')[1]
main(key)

var button = document.querySelector('#new')
button.onclick = function () { main(null) }

function main (key) {
  $hyperdrive.innerHTML = ''
  archive = drive.createArchive(key, {live: true})

  var help = document.querySelector('#help-text')
  if (key && !archive.owner) help.innerHTML = 'looking for peers...'
  else help.innerHTML = 'drag and drop files'

  window.location = '#' + archive.key.toString('hex')
  var sw = explorer($hyperdrive, archive, onclick)
  sw.on('peer', function () { help.innerHTML = '' })
  archive.list().on('data', function () { help.innerHTML = '' })
}

function onclick (err, file) {
  if (err) throw err
  clear()
  data.render(file, $display, function (err, elem) {
    if (err) return err
  })
}

function clear () {
  $display.innerHTML = ''
}

drop(document.body, function (files) {
  var i = 0
  loop()
  clear()

  function loop () {
    if (i === files.length) return console.log('added files', files)

    var file = files[i++]
    var stream = fileReader(file)
    stream.pipe(choppa(16 * 1024)).pipe(archive.createFileWriteStream(file.fullPath)).on('finish', loop)
  }
})

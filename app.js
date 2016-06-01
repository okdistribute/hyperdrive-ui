var hyperdrive = require('hyperdrive')
var data = require('render-data')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var db = level('./hyperdrive')
var drive = hyperdrive(db)
var explorer = require('./')
var swarm = require('./hyperdrive-browser.js')

var $display = document.querySelector('#display')
var $hyperdrive = document.querySelector('#ui')

var url = window.location.toString()
var key = url.split('#')[1]
var archive = drive.createArchive(key, {live: true})
swarm(archive)
var file
if (key) file = key.split('/').splice(1).join('/')
if (!file) main(key)
else {
  archive.createFileReadStream(file).pipe(concat(function (data) {
    document.write(data)
  }))
}
var button = document.querySelector('#new')
button.onclick = function () { main(null) }

function main (key) {
  $hyperdrive.innerHTML = ''
  clear()

  archive = drive.createArchive(key, {live: true})
  swarm(archive)
  var help = document.querySelector('#help-text')
  if (key && !archive.owner) help.innerHTML = 'looking for peers...'
  else if (archive.owner) help.innerHTML = 'drag and drop files'

  window.location = '#' + archive.key.toString('hex')
  var el = explorer(archive, onclick)
  $hyperdrive.appendChild(el)
  archive.list().on('data', function () {
    if (archive.owner) help.innerHTML = 'drag and drop files'
    else help.innerHTML = ''
  })
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

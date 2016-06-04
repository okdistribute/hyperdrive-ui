var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var level = require('level-browserify')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var swarm = require('hyperdrive-archive-swarm')
var db = level('./hyperdrive6')
var drive = hyperdrive(db)
var explorer = require('./')

var $display = document.querySelector('#display')
var $hyperdrive = document.querySelector('#hyperdrive-ui')

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

  archive = drive.createArchive(key, {live: true})
  swarm(archive)
  var help = document.querySelector('#help-text')
  if (key && !archive.owner) help.innerHTML = 'looking for peers...'
  else if (archive.owner) help.innerHTML = 'drag and drop files'

  window.location = '#' + archive.key.toString('hex')
  var widget = explorer(archive)
  $hyperdrive.appendChild(widget)
  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    if (archive.owner) help.innerHTML = 'drag and drop files'
    else help.innerHTML = ''
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

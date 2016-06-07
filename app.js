var hyperdrive = require('hyperdrive')
var concat = require('concat-stream')
var memdb = require('memdb')
var drop = require('drag-drop')
var fileReader = require('filereader-stream')
var choppa = require('choppa')
var swarm = require('hyperdrive-archive-swarm')
var db = memdb('./hyperdrive620')
var drive = hyperdrive(db)
var explorer = require('./')

var $hyperdrive = document.querySelector('#hyperdrive-ui')
var $shareLink = document.getElementById('share-link')

var url = window.location.toString()
var key = url.split('#')[1]
updateShareLink()
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
  if (key && !archive.owner) help.innerHTML = 'looking for peers …'
  else if (archive.owner) help.innerHTML = 'drag and drop files'

  window.location = '#' + archive.key.toString('hex')
  updateShareLink()
  var widget = explorer(archive)
  $hyperdrive.appendChild(widget)
  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    if (archive.owner) help.innerHTML = 'drag and drop files'
    else help.innerHTML = ''
  })
}

function updateShareLink () {
  $shareLink.value = window.location
}

drop(document.body, function (files) {
  var i = 0
  loop()

  function loop () {
    if (i === files.length) return console.log('added files', files)

    var file = files[i++]
    var stream = fileReader(file)
    var entry = {name: file.fullPath, mtime: Date.now(), ctime: Date.now()}
    stream.pipe(choppa(16 * 1024)).pipe(archive.createFileWriteStream(entry)).on('finish', loop)
  }
})

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

var keypath = window.location.hash.substr(1).match('([^\/]+)(/?.*)')
var key = keypath ? keypath[1] : null
var file = keypath ? keypath[2] : null

if (file) {
  getArchive(key, function (archive) {
    archive.createFileReadStream(file).pipe(concat(function (data) {
      document.write(data)
    }))
  })
} else {
  main(key)
}

var peers = 0
function updatePeers () {
  document.querySelector('#peers').innerHTML = peers + " peer" + (peers > 1 ? 's' : '')
}

function getArchive (key, cb) {
  var archive = drive.createArchive(key, {live: true})
  var sw = swarm(archive)
  sw.on('peer', function (peer) {
    peers++
    updatePeers()
  })
  archive.open(function () { cb(archive) })
}

function main (key) {
  var button = document.querySelector('#new')
  button.onclick = function () { main(null) }

  var help = document.querySelector('#help-text')
  help.innerHTML = 'looking for peers …'
  $hyperdrive.innerHTML = ''

  getArchive(key, function (archive) {
    if (archive.owner) {
      help.innerHTML = 'drag and drop files'
      installDropHandler(archive)
    }
    window.location = '#' + archive.key.toString('hex')
    updateShareLink()

    var widget = explorer(archive)
    $hyperdrive.appendChild(widget)
    var stream = archive.list({live: true})
    stream.on('data', function (entry) {
      if (archive.owner) help.innerHTML = 'drag and drop files'
      else help.innerHTML = ''
    })
  })
}

function updateShareLink () {
  $shareLink.value = window.location
}

var clearDrop
function installDropHandler (archive) {
  if (clearDrop) clearDrop()
  clearDrop = drop(document.body, function (files) {
    var i = 0
    loop()

    function loop () {
      if (i === files.length) return console.log('added files to ', archive.key.toString('hex'), files)

      var file = files[i++]
      var stream = fileReader(file)
      var entry = {name: file.fullPath, mtime: Date.now(), ctime: Date.now()}
      stream.pipe(choppa(16 * 1024)).pipe(archive.createFileWriteStream(entry)).on('finish', loop)
    }
  })
}

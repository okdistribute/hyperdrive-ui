var prettyBytes = require('pretty-bytes')
var yo = require('yo-yo')

module.exports = {
  init: init,
  update: update,
  reset: reset
}

var $parentEl
var didInit = false

function init (archive, elParentId) {
  if (didInit) return
  $parentEl = document.getElementById(elParentId)
  var size = getSize(archive)
  if ($parentEl) {
    $parentEl.appendChild(render(size))
  }
  didInit = true
}

function update (archive) {
  var size = getSize(archive)
  yo.update($parentEl, render(size))
}

function render (size) {
  return yo`<p id="size">Drive size: ${size}</p>`
}

function getSize (archive) {
  var bytes = 0
  if (archive && archive.content && archive.content.bytes) {
    bytes = archive.content.bytes
  }
  return prettyBytes(bytes)
}

function reset () {
  yo.update($parentEl, render(0))
}

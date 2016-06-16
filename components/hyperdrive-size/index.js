var yo = require('yo-yo')
var prettyBytes = require('pretty-bytes')

module.exports = HDSize

function HDSize (elId, archive) { // TODO: minidux + state instead of archive!
  if (!(this instanceof HDSize)) return new HDSize(elId, archive)
  this.$el = document.getElementById(elId)
  this.archive = archive
  if ($el) this.render(_getSize(this.archive))
  return this
}

HDSize.prototype.render = function () {
  var size = _getSize(this.archive)
  return yo`<p id="size">Drive size: ${size}</p>`
}

HDSize.prototype.update = function () {
  yo.update(this.$el, this.render( _getSize(this.archive)))
}

HDSize.prototype.reset = function () {
  return yo.update(this.$el, this.render( _getSize(this.archive) ))
}

function _getSize (archive) {
  var bytes = 0
  if (archive && archive.content && archive.content.bytes) {
    bytes = archive.content.bytes
  }
  return prettyBytes(bytes)
}

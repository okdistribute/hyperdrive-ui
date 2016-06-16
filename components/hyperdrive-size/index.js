var yo = require('yo-yo')
var prettyBytes = require('pretty-bytes')

module.exports = HDSize

function HDSize (el, store) {
  if (!(this instanceof HDSize)) return new HDSize(el, store)
  var self = this
  this.$el = document.getElementById(el)
  if (this.$el) {
    console.log('size component appendChild()')
    this.$el.appendChild(this.render())
  }
  // WIKKID awesome, state subscription is the power of minidux+yo:
  this.store = store
  this.store.subscribe(function (state) {
    console.log('hd size component subscriber triggers update()')
    self.update()
  })
}

HDSize.prototype.render = function () {
  console.log('hd size component render()')
  var size = this._getSize()
  return yo`<p id="size">Drive size: ${size}</p>`
}

HDSize.prototype.update = function () {
  console.log('hd size component update()')
  yo.update(this.$el, this.render())
}

HDSize.prototype._getSize = function () {
  var bytes = 0
  if (this.store && this.store.getState()) {
    var s = this.store.getState()
    if (s.archive &&  s.archive.content && s.archive.content.bytes) {
      bytes = s.archive.content.bytes
    }
  }
  console.log('_getSize: ' + prettyBytes(bytes))
  return prettyBytes(bytes)
}

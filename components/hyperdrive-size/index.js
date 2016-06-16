var yo = require('yo-yo')
var prettyBytes = require('pretty-bytes')

module.exports = HDSize

function HDSize (el, store) {
  if (!(this instanceof HDSize)) return new HDSize(el, store)
  var self = this
  this.component = this.render()
  this.$el = document.getElementById(el)
  this.store = store

  if (this.$el) {
    this.$el.appendChild(this.component)
  }
  // -> WIKKID awesome, state subscription is the power of minidux+yo!:
  this.store.subscribe(function (state) {
    self.update()
  })
}

HDSize.prototype.render = function () {
  var size = this._getSize()
  var component = yo`<p id="size">Drive size: ${size}</p>`
  return component
}

HDSize.prototype.update = function () {
  yo.update(this.component, this.render())
}

HDSize.prototype._getSize = function () {
  var bytes = 0
  if (this.store && this.store.getState()) {
    var s = this.store.getState()
    if (s.archive &&  s.archive.content && s.archive.content.bytes) {
      bytes = s.archive.content.bytes
    }
  }
  return prettyBytes(bytes)
}

var path = require('path')
var yo = require('yo-yo')
var data = require('render-data')
var yofs = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}
  var root = opts.root || '/'
  var entries = []
  var dirs = {}

  var fs = yofs(null, root, entries, clickEntry)
  var bc = breadcrumbs(root)

  var widget = yo`<div id="hyperdrive-ui">
    ${bc}
    ${fs}
  </div>`

  function breadcrumbs (root) {
    return yo`<div id="breadcrumbs">${root}</div>`
  }

  function clickEntry (ev, entry) {
    if (entry.type === 'directory') root = entry.name
    if (entry.type === 'file') {
      data.render({
        name: entry.name,
        createReadStream: function () {
          return archive.createFileReadStream(entry)
        }
      }, widget, function (err) {
        console.log('hello', err)
      })
    }
    yo.update(bc, breadcrumbs(root))
    onclick(ev, entry)
  }

  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    entries.push(entry)
    var dir = path.dirname(entry.name)
    if (!dirs[dir]) {
      entries.push({
        type: 'directory',
        name: dir,
        length: 0
      })
      dirs[dir] = true
    }
    yofs(fs, root, entries, clickEntry)
  })
  return widget
}

var path = require('path')
var tree = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}

  var entries = []
  var root = opts.root || '/'
  var dirs = {}

  function clickEntry (ev, entry) {
    if (entry.type === 'directory') root = entry.name
    onclick(ev, entry)
  }

  var widget = tree(null, root, entries, clickEntry)
  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    if (entry.type === 'file') {
      entry.createReadStream = function () {
        console.log(entry)
        return archive.createFileReadStream(entry)
      }
    }
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
    tree(widget, root, entries, clickEntry)
  })
  return widget
}

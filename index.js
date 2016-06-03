var path = require('path')
var tree = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}

  var entries = []
  var dirs = {}
  var widget = tree(null, opts.root || '/', entries, onclick)
  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    if (entry.type === 'file') entry.createReadStream = archive.createFileReadStream(entry.data)
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
    tree(widget, opts.root || '/', entries, onclick)
  })
  return widget
}

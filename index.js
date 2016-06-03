var path = require('path')
var data = require('render-data')
var tree = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}

  var entries = []
  var root = opts.root || '/'
  var dirs = {}

  var widget = tree(null, root, entries, clickEntry)

  function clickEntry (ev, entry) {
    if (entry.type === 'directory') root = entry.name
    if (entry.type === 'file') {
      data.append({
        name: entry.name,
        createReadStream: function () {
          return archive.createFileReadStream(entry)
        }
      }, widget, function (err) {
        console.log('hello', err)
      })
    }
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
    tree(widget, root, entries, clickEntry)
  })
  return widget
}

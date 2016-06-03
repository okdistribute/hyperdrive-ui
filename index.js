var yo = require('yo-yo')
var path = require('path')
var tree = require('./lib/tree.js')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}

  var entries = []
  var dirs = {}

  function itemClick (err, entry) {
    if (err) return onclick(err)
    console.log('creating read stream')
    entry.createReadStream = archive.createFileReadStream(entry.data)
    onclick(null, entry)
  }
  var widget = tree(opts.root || '/', entries, itemClick)
  var stream = archive.list()
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
    var fresh = tree(opts.root || '/', entries, itemClick)
    yo.update(widget, fresh)
  })
  return widget
}

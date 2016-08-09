var path = require('path')
var yo = require('yo-yo')
var yofs = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}
  var root = opts.root || ''
  var entries = opts.entries || {}

  function clicky (ev, entry) {
    if (entry.type === 'directory') {
      root = entry.name
    }
    onclick(ev, entry)
  }

  var tree = yofs(root, getEntries(), clicky)

  function getEntries () {
    // super inefficient. yo-fs should probably have a .add(entry)
    // function instead of recomputing the entry list every time
    var vals = []
    for (var key in entries) {
      if (entries.hasOwnProperty(key)) {
        vals.push(entries[key])
      }
    }
    return vals
  }

  function update () {
    var fresh = tree.render(root, getEntries(), clicky)
    yo.update(tree.widget, fresh)
  }

  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    entry.createReadStream = function () {
      return archive.createFileReadStream(entry)
    }
    entries[entry.name] = entry
    var dir = path.dirname(entry.name)
    if (!entries[dir]) {
      entries[dir] = {
        type: 'directory',
        name: dir,
        length: 0
      }
    }
    update()
  })
  return tree.widget
}

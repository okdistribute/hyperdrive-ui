var path = require('path')
var yo = require('yo-yo')
var yofs = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}
  var root = opts.root || ''
  var entries = opts.entries || []
  var uniques = {}
  opts.entries.forEach(addEntry)

  function addEntry (entry) {
    uniques[entry.name] = entry
    var dir = path.dirname(entry.name)
    if (!uniques[dir]) {
      uniques[dir] = {
        type: 'directory',
        name: dir,
        length: 0
      }
    }
  }

  function clicky (ev, entry) {
    if (entry.type === 'directory') {
      root = entry.name
    }
    return onclick(ev, entry)
  }

  var tree = yofs(root, getEntries(), clicky)

  function getEntries () {
    // super inefficient. yo-fs should probably have a .add(entry)
    // function instead of recomputing the entry list every time
    var vals = []
    for (var key in uniques) {
      if (uniques.hasOwnProperty(key)) {
        vals.push(uniques[key])
      }
    }
    return vals
  }

  function update () {
    var fresh = tree.render(root, getEntries(), clicky)
    yo.update(tree.widget, fresh)
  }

  if (archive) {
    var stream = archive.list({live: true})
    stream.on('data', function (entry) {
      addEntry(entry)
      update()
    })
  }
  return tree.widget
}

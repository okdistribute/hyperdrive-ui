var path = require('path')
var yo = require('yo-yo')
var yofs = require('yo-fs')

module.exports = function ui (archive, opts, onclick) {
  if (!onclick) return ui(archive, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, {}, opts)
  if (!opts) opts = {}
  var root = opts.root || '/'
  var dirs = {}
  var entries = []

  var tree = yofs('/', entries, onclick)

  function update () {
    var fresh = tree.render('/', entries, onclick)
    yo.update(tree.widget, fresh)
  }

  var stream = archive.list({live: true})
  stream.on('data', function (entry) {
    if (archive.owner) help.innerHTML = 'drag and drop files'
    else help.innerHTML = ''
    entry.createReadStream = function () {
      return archive.createFileReadStream(entry)
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
    update()
  })
  return tree.widget
}

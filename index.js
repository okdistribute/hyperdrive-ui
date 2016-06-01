var yo = require('yo-yo')
var path = require('path')
var treeWidget = require('file-tree-browser-widget')
var swarm = require('./hyperdrive-browser.js')

module.exports = function ui (el, archive, opts, onclick) {
  if ((typeof opts) === 'function') return ui(el, archive, {}, opts)
  if (typeof el === 'string') el = document.querySelector(el)
  el.innerHTML = ''

  var explorer = yo`<div id="hyperdrive"></div>`
  el.appendChild(explorer)

  // TODO: creating the swarm should probably be out of this repo
  var sw = swarm(archive, opts)

  var entries = []
  var dirs = {}

  archive.list({live: true}).on('data', function (entry) {
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

    var root = '/'

    tree(root, entries, el.querySelector('#hyperdrive'), function (err, entry) {
      if (err) return onclick(err)
      var file = {
        name: entry.path,
        length: entry.length,
        entry: entry.data,
        createReadStream: function (opts) {
          return archive.createFileReadStream(entry.data)
        }
      }
      onclick(null, file)
    })
  })
  return sw
}

function tree (root, entries, el, cbDisplayFile) {
  var children = []
  // data wrangling
  entries.forEach(function (entry) {
    var node = {
      type: entry.type,
      path: entry.name,
      size: entry.length,
      mtime: entry.mtime,
      data: entry
    }
    children.push(node)
  })
  return treeWidget(root, children, el, cbDisplayFile)
}

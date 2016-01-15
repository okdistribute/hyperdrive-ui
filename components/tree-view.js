var tree = require('file-tree-browser-widget')

module.exports = function (entries, el) {
  var browser = tree({ cwd: '/' })
  var children = []
  entries.forEach(function (entry) {
    var node = {
      type: entry.type,
      path: entry.value.name,
      size: entry.value.size,
      mtime: entry.value.mtime,
      entry: entry
    }
    children.push(node)
  })
  tree('/', children, el)
}

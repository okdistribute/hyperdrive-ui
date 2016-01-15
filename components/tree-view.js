var tree = require('file-tree-browser-widget')

module.exports = function (root, entries, el) {
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
  return tree(root, children, el)
}

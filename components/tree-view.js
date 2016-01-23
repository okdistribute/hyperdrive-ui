var tree = require('file-tree-browser-widget')

module.exports = function (root, entries, el, cbDisplayFile) {
  var children = []
  // data wrangling
  entries.forEach(function (entry) {
    var node = {
      type: entry.type,
      path: '/' + entry.value.name,
      size: entry.value.size,
      mtime: entry.value.mtime,
      data: entry
    }
    children.push(node)
  })
  return tree(root, children, el, cbDisplayFile)
}


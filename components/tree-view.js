var tree = require('file-tree-browser-widget')

module.exports = function (root, entries, el) {
  var children = []
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
  return createTree(root, children, el)
}

function createTree (root, children, el) {
  el.innerHTML = ''
  var browser = tree(root, children, el)
  return browser
}

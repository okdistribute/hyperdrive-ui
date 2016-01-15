var tree = require('file-tree-browser-widget')

module.exports = function (root, entries, el) {
  el.innerHTML = ''
  var children = []
  entries.forEach(function (entry) {
    var node = {
      type: entry.type,
      path: '/' + entry.value.name,
      size: entry.value.size,
      mtime: entry.value.mtime,
      entry: entry
    }
    children.push(node)
  })
  return createTree(root, entries)
}

function createTree (root, children, el) {
  var browser = tree(root, children, el)
  browser.on('entry', function (entry) {
    console.log('got', entry)
    if (entry.type === 'directory') {
      browser = createTree(entry.path, children)
    }
  })
  return browser
}

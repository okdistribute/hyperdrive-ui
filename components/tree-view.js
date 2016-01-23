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
  return createTree(root, children, el, cbDisplayFile)
}

function createTree (root, children, el, cbDisplayFile) {
  noError = null
  el.innerHTML = ''
  var browser = tree(root, children, el)

  browser.on('entry', function (entry) {
    display(entry)

    function display (entry) {
      if (entry.type === 'directory') {
        browser = createTree(entry.path, children, el, cbDisplayFile)
        browser.on('entry', function (entry) { display(entry) })
      } else { // entry.type === 'file'
        cbDisplayFile(noError, entry)
      }
    }
  })
}

var tree = require('file-tree-browser-widget')

module.exports = function (entries, el) {
  var children = []
  entries.forEach(function (entry) {
    console.log(entry)
    children.push({
      type: entry.type,
      path: entry.value.name,
      size: entry.value.size,
      mtime: entry.value.mtime
    })
  })
  tree('/', children, el)
}

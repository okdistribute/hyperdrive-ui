var tree = require('file-browser-widget')

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
  browser.directory('/', children)
  browser.appendTo(el)
  return browser
}

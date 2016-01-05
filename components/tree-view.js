var tree = require('file-browser-widget')

module.exports = function (entries, el) {
  var browser = tree()
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
  browser.directory('/', children)
  browser.appendTo(el)
  return browser
}

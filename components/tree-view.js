var tree = require('tree-view')

module.exports = function (entries, el) {
  var browser = tree()
  var children = []
  entries.forEach(function (entry) {
    console.log(entry)
    children.push({
      type: entry.type,
      path: entry.value.name
    })
  })
  browser.directory('/', children)
  browser.appendTo(el)
  return browser
}

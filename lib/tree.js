var yo = require('yo-yo')

module.exports = function (root, entries, onclick) {
  var visible = []
  var roots = split(root)
  console.log('yoyo')

  entries.forEach(function (entry) {
    var paths = split(entry.name)
    if (paths.length === (roots.length + 1)) {
      var isChild = true
      for (var i = 0; i < roots.length && isChild === true; i++) {
        isChild = (paths[i] === roots[i])
      }
      if (isChild === true) visible.push(entry)
    }
  })

  return yo`<ul id="file-widget">
    ${visible.map(function (entry) {
      return yo`<li>${entry.name}</li>`
    })}
  </ul>`
}

function split (pathName) {
  var fileArray = pathName.split('/')
  while (fileArray[0] === '' || fileArray[0] === '.') {
    fileArray.shift() // remove empty items from the beginning
  }
  while (fileArray[fileArray.length - 1] === '') {
    fileArray.pop() // remove empty items from the end
  }
  return fileArray
}

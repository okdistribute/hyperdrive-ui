var yo = require('yo-yo')
var path = require('path')
var data = require('render-data')
var treeWidget = require('file-tree-browser-widget')
var swarm = require('./hyperdrive-browser.js')

module.exports = function (el, archive) {
  if (typeof el === 'string') el = document.querySelector(el)
  el.innerHTML = ''

  var explorer = yo`
  <div id="hyperdrive">
    <div id="overlay" onclick="${clearMedia}">
    <div id="file-list"></div>
    </div>
    <div id="display" onclick="${clearMedia}"></div>
  </div>
  `
  el.appendChild(explorer)
  swarm(archive, {key: 'hyperdrive-explorer'})

  var entries = []
  var dirs = {}

  var $display = el.querySelector('#display')
  var $overlay = el.querySelector('#overlay')
  var $files = el.querySelector('#file-list')

  archive.list({live: true}).on('data', function (entry) {
    console.log('adding', entry)
    entries.push(entry)
    var dir = path.dirname(entry.name)
    if (!dirs[dir]) {
      entries.push({
        type: 'directory',
        name: dir,
        length: 0
      })
      dirs[dir] = true
    }

    var root = '/'

    tree(root, entries, $files, function (err, entry) {
      if (err) return err
      clearMedia()
      if (entry.length !== 0) {
        var file = {
          name: entry.path,
          length: entry.length,
          createReadStream: function (opts) {
            console.log('reading file')
            return archive.createFileReadStream(entry.data)
          }
        }
        data.render(file, $display, function (err, elem) {
          if (err) return err
          $display.style.display = 'block'
          $display.style['background-color'] = elem.tagName === 'IFRAME' ? 'white' : 'black'
        })
      }
    })
  })

  var clearMedia = function () {
    $display.style.display = 'none'
    $overlay.style.display = 'none'
    $display.innerHTML = ''
  }
}

function tree (root, entries, el, cbDisplayFile) {
  var children = []
  // data wrangling
  entries.forEach(function (entry) {
    var node = {
      type: entry.type,
      path: entry.name,
      size: entry.length,
      mtime: entry.mtime,
      data: entry
    }
    console.log(node)
    children.push(node)
  })
  return treeWidget(root, children, el, cbDisplayFile)
}

var path = require('path')
var yo = require('yo-yo')
var data = require('render-data')
var yofs = require('yo-fs')

module.exports = function ui (archive, entries, opts, onclick) {
  if (!onclick) return ui(archive, entries, opts, function thunk () {})
  if ((typeof opts) === 'function') return ui(archive, entries, {}, opts)
  if (!opts) opts = {}
  var root = opts.root || '/'
  var dirs = {}

  entries.forEach(function (entry) {
    var dir = path.dirname(entry.name)
    if (!dirs[dir]) {
      entries.push({
        type: 'directory',
        name: dir,
        length: 0
      })
      dirs[dir] = true
    }
  })

  var fs = yofs(null, root, entries, clickEntry)
  var displayId = 'display'
  var display = yo`<div id="${displayId}"></div>`

  var widget = yo`<div id="hyperdrive-ui">
    ${fs}
    ${display}
  </div>`

/*
  function page (newRoot) {
    root = newRoot
    yofs(fs, newRoot, entries, clickEntry)
  }

  function breadcrumbs (root) {
    var parts = root.split('/')
    while (parts[parts.length - 1] === '') { parts.pop() }
    function back () { page(path.dirname(root)) }
    var crumbs
    if (parts.length) crumbs = yo`<button class="link" onclick=${back}>back</button>`
    return yo`<div id="breadcrumbs" class="breadcrumbs"> ${crumbs} </div>`
  }
*/
  function clickEntry (ev, entry) {
    root = entry.name
    if (entry.type === 'directory') {
      document.getElementById(displayId).innerHTML = ''
    }
    if (entry.type === 'file') {
      data.render({
        name: entry.name,
        createReadStream: function () {
          return archive.createFileReadStream(entry)
        }
      }, display, function (err) {
        if (err) throw err
      })
    }
    onclick(ev, entry)
  }

  return widget
}

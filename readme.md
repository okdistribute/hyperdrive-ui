# hyperdrive-ui

Explore the contents of a [hyperdrive](http://github.com/mafintosh/hyperdrive) in the browser.

## Example

Live demo: [http://dat.land/](http://dat.land/)


## usage

```npm install hyperdrive-ui```

## `hyperdriveUI(archive, opts, onclick)`

Renders the explorer.

```js
var explorer = require('hyperdrive-ui')
function onclick (ev, entry) {
  console.log('clicked', entry.name, entry.type)
}
var tree = explorer(archive, onclick)
document.getElementById('#hyperdrive').appendChild(tree)

```

## get started

```
npm install
npm start
```

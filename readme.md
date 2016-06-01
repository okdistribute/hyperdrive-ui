# hyperdrive-explorer

Explore the contents of a [hypedrive](http://github.com/mafintosh/hyperdrive) in the browser.

## TODO

- [ ] ui work
- [ ] selective file or folder download

## Example

```
npm install
npm start
```


## usage

```npm install dat-explorer```

## `explorer(element, link, onclick)`

Renders the explorer given an HTML DOM element and a `dat://` link.

```js
var explorer = require('dat-explorer')
var link = 'dat://ea18e8fe42b1c344d8bfcdf6449d61f5228767ef8b5e9155768bba436245af84'
explorer('#dat', link)
```

See `app.js` for an example.

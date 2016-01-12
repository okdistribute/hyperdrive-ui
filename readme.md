# explore-dat

Explore and download a [dat link](http://github.com/maxogden/dat) in the browser.

## TODO

- [ ] have a big download button
- [ ] selective file or folder download
- [x] display metadata (like last modified, size) in file list
- [ ] handle sub-directories

## Install

```
npm install
npm start
```

## `explorer(element, link)`

Renders the explorer given an HTML DOM element and a `dat://` link.

```js
var explorer = require('explore-dat')
var link = 'dat://ea18e8fe42b1c344d8bfcdf6449d61f5228767ef8b5e9155768bba436245af84'
explorer('#dat', link)
```

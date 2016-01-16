# dat-explorer

Explore the contents of a [dat link](http://github.com/maxogden/dat) in the browser.

## TODO

- [x] work entirely in the browser
- [x] have a big download button
- [ ] selective file or folder download
- [x] display metadata (like last modified, size) in file list
- [x] handle sub-directories

## Example

```
npm install
npm start
```


## usage

```npm install dat-explorer```

## `explorer(element, link)`

Renders the explorer given an HTML DOM element and a `dat://` link.

```js
var explorer = require('dat-explorer')
var link = 'dat://ea18e8fe42b1c344d8bfcdf6449d61f5228767ef8b5e9155768bba436245af84'
explorer('#dat', link)
```

var explorer = require('./')

var input = document.getElementById('link')
var button = document.getElementById('submit')

button.onclick = function (event) {
  explorer('#dat', input.value)
}

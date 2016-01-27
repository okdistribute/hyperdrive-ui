var explorer = require('./')

var input = document.getElementById('link')
var button = document.getElementById('submit')

button.onclick = function (event) {
  event.preventDefault()
  explorer('#dat', input.value)
}

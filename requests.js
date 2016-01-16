var Dat = require('dat-browserify')

module.exports = Feed

function Feed (link) {
  if (!(this instanceof Feed)) return new Feed(link)
  this.db = Dat()
  this.db.joinWebrtcSwarm(link)
  this.feed = this.db.drive.get(link)
}

Feed.prototype.getFile = function (entry) {
  return this.db.drive.get(entry)
}

Feed.prototype.createStream = function (opts) {
  return this.feed.createStream(opts)
}

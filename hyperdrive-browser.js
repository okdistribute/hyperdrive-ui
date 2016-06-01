var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')

var DEFAULT_SIGNALHUB = 'https://signalhub.mafintosh.com'

module.exports = function join (archive, opts) {
  if (!opts) opts = {}
  if (!opts.key || !opts.signalhub) {
    opts.key = 'hyperdrive-public'
    console.warn('Using default signalhub and key. For better stability, use your own.')
  }
  var hub = opts.signalhub || DEFAULT_SIGNALHUB
  var sw = swarm(signalhub(opts.key + '-' + archive.key.toString('hex'), hub))
  sw.on('peer', function (peer) {
    peer.pipe(archive.replicate()).pipe(peer)
  })
  return sw
}

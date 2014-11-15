var path = require('path')
var _private = require('./_private')
var port = process.env.PORT || 3011

var config = {
  users: _private.users,
  dir: path.resolve('/'),
  port: port
}

module.exports = config

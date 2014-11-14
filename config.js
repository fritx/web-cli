var path = require('path')
var port = process.env.PORT || 3011

var config = {
  dir: path.resolve('/'),
  port: port
}

module.exports = config

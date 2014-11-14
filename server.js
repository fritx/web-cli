var express = require('express')
var path = require('path')
var app = express()
var socket_io = require('socket.io')
var child_process = require('child_process')
var _ = require('lodash')

var config = require('./config')
var server, io

app.use('/', express.static(
  path.resolve(__dirname, 'static')
))
app.use('/bower_components', express.static(
  path.resolve(__dirname, 'bower_components')
))

app.listen = (function(fn){
  return function(port, callback){
    callback = (function(fn){
      return function(){
        initSocketIO()
        return fn.apply(null, arguments)
      }
    })(callback)
    return fn.apply(app, [port, callback])
  }
})(app.listen)


// exports or listen
if (module.parent) {
  module.exports = app
} else {
  server = app.listen(config.port, function(err){
    if (err) throw err
    console.log('Listening at port %d', config.port)
  })
}

function initSocketIO(){
  io = socket_io(server)
  io.on('connection', function(socket){
    socket.data = {
      dir: config.dir
    }

    socket.on('dir', function(dir){
      socket.data.dir = dir
    })

    socket.on('run', function(input){
      runCommand(input, socket)
    })

    socket.emit('dir', socket.data.dir)
  })
  console.log('socket.io binded')
}

function runCommand(cmd, socket){
  var segs = cmd.split(/\n/)
  var opt = {
    cwd: socket.data.dir
  }

  _.each(segs, function(seg){
    child_process.exec(seg, opt, function(err, stdout, stderr){
      var result = {
        err: !!err,
        cwd: opt.cwd,
        stdout: stdout,
        stderr: stderr
      }
      socket.emit('respond', result)
    })
  })
}

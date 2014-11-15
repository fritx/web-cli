;(function(){

  var socket = io()

  var $form = $('form.main-form')
  var $log = $('div.main-output')
  var $cmd = $('textarea.main-input')
  var $dir = $('input.dir-input')
  var $run = $('button.run-btn')

  // auth
  socket.on('auth', function(result){
    if (result.ok) {
      setup(result)
    } else {
      alert(result.msg)
      setTimeout(login, 15000) // 15s
    }
  })
  login()


  function setup(result){
    socket.on('respond', respond)

    // ctrl+enter
    $form.on('submit', function(event){
      event.preventDefault()
      submit()
    })
    $cmd.on('keydown', function(event){
      if (event.ctrlKey && event.keyCode === 13) {
        submit()
      }
    })

    $dir.val(result.dir)
    $dir.on('change', function(){
      socket.emit('dir', $dir.val())
    })
  }

  function respond(result){
    if (result.err) {}
    if (result.stdout) {
      $('<pre>').addClass('log-stdout')
        .text(result.stdout)
        .appendTo($log)
    }
    if (result.stderr) {
      $('<pre>').addClass('log-stderr')
        .text(result.stderr)
        .appendTo($log)
    }

    var dateStr = new Date().toLocaleString()
    $('<pre>').addClass('log-info')
        .text(dateStr + '\n' + result.cwd + ' > ' + result.seg)
        .appendTo($log)
    $log.scrollTop($log.prop('scrollHeight'))
  }

  function submit(){
    var cmd = $cmd.val().replace(/\n+/g, '\n')
      .replace(/\n$/, '')
    socket.emit('run', cmd)
  }

  function login(){
    socket.emit('login', {
      username: prompt('Username'),
      password: prompt('Password')
    })
  }

})();

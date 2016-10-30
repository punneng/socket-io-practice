const socket = io()

function chat (message, callback) {
  socket.emit('chat message', message)
  callback(message)
}

function onRecieveMessage (callback) {
  socket.on('chat message', (message) => {
    callback(message)
  })
}

function onTyping () {
  socket.emit('chat typing')
}

function onRecieveTyping (callback) {
  socket.on('chat typing', (nickname) => {
    callback(nickname)
  })
}

window.API = {
  chat,
  onRecieveMessage,
  onTyping,
  onRecieveTyping
}

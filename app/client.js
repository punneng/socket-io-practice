function Client(io) {
  this.socket = io

  this.chat = (message, callback) => {
    this.socket.emit('chat message', message)
    callback(message)
  }

  this.onRecieveMessage = (callback) => {
    this.socket.on('chat message', (message) => {
      callback(message)
    })
  }

  this.onTyping = () => {
    this.socket.emit('chat typing')
  }

  this.onRecieveTyping = (callback) => {
    this.socket.on('chat typing', (nickname) => {
      callback(nickname)
    })
  }

  this.disconnect = (callback) => {

    this.socket.disconnect()
    // TODO: find how to exectue a callback function after this.socket.disconnect()
    if (callback) setTimeout(callback, 1900)
  }
}


module.exports = (io) => {
  return new Client(io)
}

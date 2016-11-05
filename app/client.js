function Client(io) {
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

  this.disconnect = () => {
    this.socket.disconnect()
  }

  this.socket = io
  return this
}


module.exports = (io) => {
  return new Client(io)
}

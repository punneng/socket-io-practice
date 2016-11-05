const _   = require('lodash')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const Command = require('./command')
const { getNickname } = require('./utils')

module.exports = () => {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  })

  app.get('/bundle/index.js', (req, res) => {
    res.sendFile(__dirname + '/bundle/index.js')
  })

  io.on('connection', (socket) => {
    socket.broadcast.emit('chat message', 'a user connected')

    socket.on('chat message', (message) => {
      const commandFn = Command.getCommandFn(message)
      if (commandFn) {
        try {
          if (commandFn(io, socket)) {
            return
          }
        } catch (e) {
          socket.emit('chat message', e.message)
          return
        }
      } else {
        socket.broadcast.emit('chat message', `[${getNickname(socket)}] ${message}`)
      }
    })

    socket.on('chat typing', () => {
      socket.broadcast.emit('chat typing', getNickname(socket))
    })

    socket.on('disconnect', (callback) => {
      socket.broadcast.emit('chat message', 'a user disconnected')
    })
  })


  server.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  })
  return server
}

const _ = require('lodash')

const { getNickname } = require('../utils')

const commands = {
  setNickname,
  getClients,
  sendMessageTo
}

function getCommandFn (message) {
  if (_.startsWith(message, '@command')) {
    const tokens = message.split(' ')
    return fn(tokens)
  }
}

function fn (tokens) {
  if (tokens.length < 2) {
    return
  }

  const command = commands[String(tokens[1])]
  if (command) {
    return command(_.slice(tokens, 2))
  }
}

function setNickname (tokens) {
  const nickname = tokens.join(' ')
  return function (io, socket) {
    if (!nickname) throw new Error('No nickname')
    socket._nickname = nickname
  }
}

function getClients () {
  return function (io, socket) {
    const nicknames = _.map(io.clients().connected, socket => {
      return getNickname(socket)
    })
    socket.emit('chat message', String(nicknames))
  }
}

function sendMessageTo ([toNickname, ...tokens]) {
  const message = tokens.join(' ')
  return function (io, socket) {
    const sockets = _.map(io.clients().connected, toSocket => {
      return toSocket._nickname === toNickname
        ? toSocket
        : {}
    })

    const toSockets = _.filter(sockets, socket => { return !_.isEmpty(socket)})
    if (_.isEmpty(toSockets)) throw new Error(`User[${toNickname}] not found`)
    _.map(toSockets, toSocket => {
      toSocket.emit('chat message', `Message from [${getNickname(socket)}]: ${message}`)
    })
  }
}

module.exports = {
  getCommandFn
}

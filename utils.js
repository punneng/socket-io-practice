function getNickname (socket) {
  return socket._nickname || 'Anonymous'
}

module.exports = {
  getNickname
}

const Server = require('../../server.js')
const Client = require('../../app/client.js')
const io = require('socket.io-client')
const assert = require('assert')

const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false
}

describe('chat message', () => {
  let server
  let client1
  let client2

  beforeEach(done => {
    server = Server()
    client1 = Client(io('http://localhost:3000', ioOptions))
    client2 = Client(io('http://localhost:3000', ioOptions))

    done()
  })
  afterEach(done => {
    server.close()
    client1.disconnect()
    client2.disconnect()
    done()
  })

  it('should send messages to client2 when client1 emit event', done => {

    client2.onRecieveMessage((message) => {
      assert.equal(message, '[Anonymous] helloworld')
      done()
    })


    client1.chat('helloworld', (message) => { })


  })
})

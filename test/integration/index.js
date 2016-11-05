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

  before(done => {
    server = Server()
    done()
  })

  beforeEach(done => {
    client1 = Client(io('http://localhost:3000', ioOptions))
    client2 = Client(io('http://localhost:3000', ioOptions))
    done()
  })

  afterEach(done => {
    client1.disconnect(() => {})
    client2.disconnect(done)
  })

  after(done => {
    server.close(done)
  })

  it('should send messages to client2 when client1 emit event', done => {
    client2.onRecieveMessage(message => {
      assert.equal(message, '[Anonymous] helloworld')
      done()
    })

    client1.chat('helloworld', message => { })
  })

  it('should send messages to client2 when client1 emit event with name', done => {

    client1.chat('@command setNickname neng', message => {})
    client2.onRecieveMessage(message => {

      assert.equal(message, '[neng] helloworld')
      done()
    })
    client1.chat('helloworld', message => { })
  })

})

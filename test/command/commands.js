const assert = require('assert')
const Sinon  = require('sinon')

const Command = require('../../command')

describe('Command', () => {
  describe('getCommandFn()', () => {
    it('should return a command function depend on arguments', () => {
       assert.equal('function', typeof(Command.getCommandFn('@command setNickname neng')));
    })

    it('should not return function on invalid command', () => {
      const fn = Command.getCommandFn('@command invalidCommand invalidInput')
      assert.notEqual('function', typeof(fn))
    })

    it('should not return function when message doesnt start with @command', () => {
      const fn = Command.getCommandFn('invalidCommand invalidInput')
      assert.notEqual('function', typeof(fn))
    })

    it('should not return function when the command doesnt have 3 words', () => {
      const fn = Command.getCommandFn('invalidCommand invalidInput')
      assert.notEqual('function', typeof(fn))
    })
  })

  describe('setNickname', () => {
    const io = {}
    const socket = {}
    
    it('should return a function to set _nickname to socket', () => {
      const setNickname = Command.getCommandFn('@command setNickname neng')
      setNickname(io, socket)
      assert.equal('neng', socket._nickname)
    })

    it('should raise error when a mentioned user doenst exist', () => {
      const setNickname = Command.getCommandFn('@command setNickname')
      assert.throws(() => {setNickname(io, socket)}, /No nickname/)
    })
  })

  describe('getClients', () => {
    const io = {
      clients: () => {
        return {
          connected: {
            socket_id1: { _nickname: 'neng' },
            socket_id2: { }
          }
        }
      }
    }

    const socket = {
      emit: () => { }
    }


    it('should return string of array of nicknames', () => {
      const getClients = Command.getCommandFn('@command getClients')
      const spy = Sinon.stub(socket, 'emit').withArgs('chat message', 'neng,Anonymous')
      getClients(io, socket)
      assert(spy.calledOnce)
    })
  })

  describe('sendMessageTo', () => {
    const socket1 = { _nickname: 'neng', emit: () => {} }
    const socket2 = { _nickname: 'nic',  emit: () => {} }
    const io = {
      clients: () => {
        return {
          connected: {
            socket_id1: socket1,
            socket_id2: socket2
          }
        }
      }
    }

    it('should send a message to a mentioned user', () => {
      const sendMessageTo = Command.getCommandFn('@command sendMessageTo neng helloworld')
      const spy = Sinon.stub(socket1, 'emit').withArgs('chat message', 'Message from [nic]: helloworld')
      sendMessageTo(io, socket2)
      assert(spy.calledOnce)
    })

    it('should raise error when a mentioned user doenst exist', () => {
      const sendMessageTo = Command.getCommandFn('@command sendMessageTo booom helloworld')
      assert.throws(() => {sendMessageTo(io, socket2)}, /User\[booom\] not found/)
    })
  })

})

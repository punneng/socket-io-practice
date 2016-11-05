var Client = require('./client')
var socket = io()

var client = Client(socket)
console.log(client)

$('form').submit(function(){
  var message = $('#m').val();
  client.chat(message, (message) => {
    $('#chatbox').append($('<li>').text(message));
  });
  $('#m').val('');
  return false;
});

client.onRecieveMessage((message) => {
  $('#chatbox').append($('<li>').text(message));
})

$('#m').keypress(function() {
  client.onTyping()
})

client.onRecieveTyping((nickname) => {
  $('li#user-is-typing').show();
  $('li#user-is-typing').text('[' + nickname + '] is typing');
  setTimeout(() => {
    $('li#user-is-typing').hide();
  }, 3000)
})

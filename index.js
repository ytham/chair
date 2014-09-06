var five = require('johnny-five');
var spark = require('spark-io');


// Spark Core:
var authToken = '9e1c8a96ed9532c18395b8c9c7a32d73b5b086f5';
var deviceId = '53ff6b066667574826562567';

var board = new five.Board({
  io: new Spark({
    token: authToken,
    deviceId: deviceId
  })
});

board.on('ready', function () {
  
});
/* Chair
 * 
 * TechCrunch Disrupt Hackathon 2014
 *
 * By: Yu Jiang Tham
 */
var five = require('johnny-five');
var spark = require('spark-io');
var leap = require('leapjs');

// Servos Chains
var fl = {}, fr = {}, rl = {}, rr = {};

// Spark Core Data
var sparkData = require('./sparkData');

// Leap
var palm = {};
leap.loop(function (frame) {
  if (frame.hands.length > 0) {
    palm.x = frame.hands[0].palmPosition[0];
    palm.y = frame.hands[0].palmPosition[1];
    palm.z = frame.hands[0].palmPosition[2];
  }
});

// Johnny-Five
var board = new five.Board({
  io: new spark({
    token: sparkData.authToken,
    deviceId: sparkData.deviceId
  })
});

// Board
board.on('ready', function () {
  var self = this;
  fl.s = new five.Servo('D0');
  
  setInterval(function () {
    if (typeof palm.x !== 'undefined') {
      console.log(palm.x);
      fl.s.to(Math.abs(palm.x));
      //self.servoWrite('D0', Math.abs(palm.x));
    }
  }, 50);
});

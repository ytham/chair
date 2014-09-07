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
var fl = {}, fr = {}, bl = {}, br = {};

// Spark Core Data
var sparkData = require('./sparkData');

// Leap
var palm = {};
var polar = {};
leap.loop(function (frame) {
  if (frame.hands.length > 0) {
    palm.x = -1*frame.hands[0].palmPosition[0];
    palm.y = frame.hands[0].palmPosition[1];
    palm.z = -1*frame.hands[0].palmPosition[2];
    palm.dx = -1*frame.hands[0].direction[0];
    polar = calculatePolarCoords(palm);
    console.log(frame.hands[0].direction);
    console.log(palm);
    console.log(polar);
    console.log('-----------------------');
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
  fl.s = new five.Servo('A6');
  fr.s = new five.Servo('A4');
  bl.s = new five.Servo('A1');
  br.s = new five.Servo('D1');

  fl.c = new five.Servo({
    pin: 'A7',
    type: 'continuous'
  });
  fr.c = new five.Servo({
    pin: 'A5',
    type: 'continuous'
  });
  bl.c = new five.Servo({
    pin: 'A0',
    type: 'continuous'
  });
  br.c = new five.Servo({
    pin: 'D0',
    type: 'continuous'
  });

  // Set defaults
  fl.s.to(90);
  fr.s.to(90);
  bl.s.to(90);
  br.s.to(90);

  // Movement input
  setInterval(function () {
    if (typeof palm.x !== 'undefined') {      
      fl.s.to(90+polar.theta+(100*palm.dx));
      fr.s.to(90+polar.theta+(100*palm.dx));
      bl.s.to(90+polar.theta);
      br.s.to(90+polar.theta);
      
      if (palm.z <= 0) {
        fl.c.ccw(polar.r);
        fr.c.ccw(polar.r);
        bl.c.ccw(polar.r);
        br.c.ccw(polar.r);
      } else {
        fl.c.cw(polar.r);
        fr.c.cw(polar.r);
        bl.c.cw(polar.r);
        br.c.cw(polar.r);
      }
    }
  }, 250);
});

function calculatePolarCoords(palm) {
  if (palm.z < 0) {
    palm.z = -1*palm.z;
  }
  var r = (1.5/100)*Math.sqrt(square(palm.x) + square(palm.z));
  if (r > 1.0) {
    r = 1.0;
  }
  var theta = Math.atan2(palm.x, palm.z);
  return {
    r: r,
    theta: radiansToDegrees(theta)
  };
}

function radiansToDegrees(rad) {
  return (180/Math.PI)*rad;
}

function square(x) {
  return x*x;
}
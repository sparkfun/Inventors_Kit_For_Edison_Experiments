/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 6 - Part 2: Edison RGB LED
 * This sketch was written by SparkFun Electronics
 * November 9, 2015
 * https://github.com/sparkfun
 *
 * Waits for socket.io connections and received messages to change RGB LED.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA and HTTP modules
var mraa = require('mraa');
var server = require('http').createServer();
var io = require('socket.io').listen(server);

// Port
var port = 4242;

// Set up PWM pins
var rPin = new mraa.Pwm(20);
var gPin = new mraa.Pwm(14);
var bPin = new mraa.Pwm(0);

// Enable PWM
rPin.enable(true);
gPin.enable(true);
bPin.enable(true);

// Set 1000 Hz period
rPin.period(0.001);
gPin.period(0.001);
bPin.period(0.001);

// Turn off LEDs initially
pwm(rPin, 0.0);
pwm(gPin, 0.0);
pwm(bPin, 0.0);

// Wait for a client to connect
io.on('connection', function(socket) {
    console.log("A client is connected!");
    
    // Look for the "color" message from the client and set the LED
    socket.on('color', function(rgb) {
        console.log("RGB(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")");
        pwm(rPin, rgb.r / 255);
        pwm(gPin, rgb.g / 255);
        pwm(bPin, rgb.b / 255);
    });
});

// PWM needs a "fix" that turns off the LED on a value of 0.0
function pwm(pin, val) {
    if (val === 0.0) {
        pin.write(0.0);
        pin.enable(false);
    } else {
        pin.enable(true);
        pin.write(val);
    }
}

// Run the server on a particular port
server.listen(port, function() {
    console.log("Server listening on port " + port);
});
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 3: Blinky
 * This sketch was written by SparkFun Electronics
 * October 29, 2015
 * https://github.com/sparkfun
 *
 * Blink an LED connected to GP12 (need a transistor if using the Base Block).
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA module
var mraa = require('mraa');

// Set up a digital output on MRAA pin 20 (GP12)
var ledPin = new mraa.Gpio(20);
ledPin.dir(mraa.DIR_OUT);

// Global variable to remember the LED state
var led = 0;

// Call this function over and over again
periodicActivity();
function periodicActivity() //
{
    // Switch state of LED
    if (led == 0) {
        led = 1;
    } else {
        led = 0;
    }
    
    // Turn the LED on
    ledPin.write(led);

    // Wait for 500 ms and call this function again
    setTimeout(periodicActivity, 500);
}
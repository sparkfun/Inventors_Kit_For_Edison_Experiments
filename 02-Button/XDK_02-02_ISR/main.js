/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 2 - Part 2: Interrupt Service Routine
 * This sketch was written by SparkFun Electronics
 * October 27, 2015
 * https://github.com/sparkfun
 *
 * This is a simple example program that prints an incrementing number
 * to the console every time a button is pushed.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA module
var mraa = require('mraa');

// Set up digital input on MRAA pin 36 (GP14)
var buttonPin = new mraa.Gpio(36);
buttonPin.dir(mraa.DIR_IN);

// Global counter
var num = 0;

// Our interrupt service routine
function serviceRoutine() {
    num++;
    console.log("BOOP " + num);
}

// Assign the ISR function to the button push
buttonPin.isr(mraa.EDGE_FALLING, serviceRoutine);

// Do nothing while we wait for the ISR
periodicActivity();
function periodicActivity() //
{
    setTimeout(periodicActivity, 1000);
}
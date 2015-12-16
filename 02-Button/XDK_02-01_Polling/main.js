/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 2 - Part 1: Pushing Some Buttons
 * This sketch was written by SparkFun Electronics
 * October 27, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * This is a simple example program that displays the state of a button
 * to the console.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA module
var mraa = require('mraa');

// Set up a digital input/output on MRAA pin 36 (GP14)
var buttonPin = new mraa.Gpio(36);

// Set that pin as a digital input (read)
buttonPin.dir(mraa.DIR_IN);

// Call the periodicActivity function
periodicActivity();

// This function is called forever (due to the setTimeout() function)
function periodicActivity() //
{
    // Read the value of the pin and print it to the screen
    var val = buttonPin.read();
    console.log('Button is ' + val);

    // Wait for 250 ms and call this function again
    setTimeout(periodicActivity, 250);
}
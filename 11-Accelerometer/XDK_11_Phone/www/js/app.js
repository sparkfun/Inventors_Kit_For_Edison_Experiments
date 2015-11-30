/*jslint unparam: true */
/*jshint strict: true, -W097, unused:false,  undef:true, devel:true */
/*global window, document, d3, $, io, navigator, setTimeout */
/*global ble*/

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 11: Accelerometer Demo
 * This sketch was written by SparkFun Electronics
 * November 29, 2015
 * https://github.com/sparkfun
 * 
 * Runs as BLE central on smartphone. Connects to the Edison and sends
 * accelerometer data.
 * 
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Put in strict mode to restrict some JavaScript "features"
"use strict" ;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    setInterval(function() {
        navigator.accelerometer.getCurrentAcceleration(function(accel) {
            debug("X:" + accel.x + " Y:" + accel.y + " Z:" + accel.z +
                  " T:" + accel.timestamp);
        }, function() {
            debug("Error reading accelerometer");
        });
    }, 500);
}

/******************************************************************************
 * Execution starts here after page has loaded
 *****************************************************************************/

// Short for jQuery(document).ready() method, which is called after the page
// has loaded. We can use this to assign callbacks to elements on the page.
$(function() {
    
    // Initialize the app and assign callbacks
    debug("test");
    
    // Read the stuff
    /*navigator.accelerometer.getCurrentAcceleration(function(accel) {
        debug("X:" + accel.x + " Y:" + accel.y + " Z:" + accel.z +
              " T:" + accel.timestamp);
    }, function() {
        debug("Error reading accelerometer");
    });*/
});

// Create a pseudo-debugging console
// NOTE: Real apps should use alert(), but list messages can be useful when
// you are debugging the program
function debug(msg) {
    $('#debug').append($('<li>').text(msg));
}
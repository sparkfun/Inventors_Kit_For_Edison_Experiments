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

// BLE service and characteristic information
window.edison = {
    deviceId: "98:4F:EE:04:3E:F9",
    service: "12ab",
    characteristic: "34cd"
};

/******************************************************************************
 * Bluetooth connection
 *****************************************************************************/

// Global app object we can use to create BLE callbacks
window.app = {
    
    // A way for us to reference the thread
    watchID: null,
    
    // Call this first!
    initialize: function() {
        window.app.connect();
    },
    
    // Scan for and connect to our statically-encoded Edison MAC address
    connect: function() {
        ble.scan([], 
                 5,
                 window.app.onDiscoverDevice,
                 window.app.onError);
    },
    
    // Find BLE devices in range and connect to the Edison
    onDiscoverDevice: function(device) {
        debug("Found " + device.name + " at " + device.id);
        if (device.id === window.edison.deviceId) {
            debug("Connecting to: " + window.edison.deviceId);
            ble.connect(window.edison.deviceId,
                        window.app.onConnect,
                        window.app.onError);
        }
    },
    
    //  On BLE connection, notify the user
    onConnect: function() {
        debug("Connected to " + window.edison.deviceId);
        
        // Set the accelerometer to sample and send data every 50 ms
        window.watchID = navigator.accelerometer.watchAcceleration(
            function(acceleration) {
                window.app.onAccelerometer(acceleration, window);
            },
            window.app.onError,
            { frequency: 500 }
        );
    },
        
    // This gets executed on new accelerometer data
    onAccelerometer: function(accel, win) {
            
        // Create an array of accelerometer values
        var a = [accel.x, accel.y, accel.z];

        // Set new values for X, Y, and Z acceleration on phone
        $('#x')[0].innerHTML = a[0].toFixed(2);
        $('#y')[0].innerHTML = a[1].toFixed(2);
        $('#z')[0].innerHTML = a[2].toFixed(2);
        
        // Assign X, Y and Z values to a 16-bit, signed integer array
        var buf = new Int16Array(3);
        buf[0] = a[0] * 100;
        buf[1] = a[1] * 100;
        buf[2] = a[2] * 100;
    
        // Write data to the characteristic
        ble.write(win.edison.deviceId,
                  win.edison.service,
                  win.edison.characteristic,
                  buf.buffer);
                  //function() {debug("Acc data written!");}, 
                  //function() {debug("Acc data NOT written");});        
    },
    
    // Alert the user if there is an error
    onError: function(err) {
        navigator.accelerometer.clearWatch(window.watchID);
        debug("Error: " + err);
        alert("Error: " + err);
    }
};

/******************************************************************************
 * Execution starts here after the phone has finished initializing
 *****************************************************************************/

// Wait for the device (phone) to be ready before connecting to the Edison
// and polling the accelerometer
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    
    // Prepare the BLE connection
    window.app.initialize();
}

// Create a pseudo-debugging console
// NOTE: Real apps should use alert(), but list messages can be useful when
// you are debugging the program
function debug(msg) {
    $('#debug').append($('<li>').text(msg));
}
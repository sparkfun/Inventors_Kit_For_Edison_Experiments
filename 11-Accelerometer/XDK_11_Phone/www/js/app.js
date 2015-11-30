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
    characteristic: "34cd",
    connected: false
};

/******************************************************************************
 * Bluetooth connection
 *****************************************************************************/

// Global app object we can use to create BLE callbacks
window.app = {
    
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
        window.edison.connected = true;
    },
    
    // Alert the user if there is an error
    onError: function(err) {
        window.edison.connected = false;
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
    
    // Poll the accelerometer every 50 ms and send that data to the Edison
    setInterval(function() {
        navigator.accelerometer.getCurrentAcceleration(function(accel) {
            
            // Create an array of accelerometer values
            var a = [accel.x, accel.y, accel.z];
            
            // Set new values for X, Y, and Z acceleration on phone
            $('#x')[0].innerHTML = a[0].toFixed(2);
            $('#y')[0].innerHTML = a[1].toFixed(2);
            $('#z')[0].innerHTML = a[2].toFixed(2);
            
            // Scale acceleration data to 16-bit, signed integers
            a.forEach(function(value, index, arr) {
                value = Math.trunc(value * 100);
                value = Math.min(value, 32767);
                arr[index] = Math.max(value, -32768);
            });
            
            // If we have a BLE connection, send out the accelerometer data
            debug("checking");
            if (window.edison.connected) {
                debug("Writing acc data...");
                /*ble.write(window.edison.deviceId,
                          window.edison.service,
                          window.edison.characterisstic,
                          Int16Array.from(a),
                          function() {
                    debug("Acc data written!");
                }, window.app.onError);*/
            } else {
                debug("NOT connected");
            }
            
        }, function() {
            debug("Error reading accelerometer");
        });
    }, 50);
}

// Create a pseudo-debugging console
// NOTE: Real apps should use alert(), but list messages can be useful when
// you are debugging the program
function debug(msg) {
    $('#debug').append($('<li>').text(msg));
}
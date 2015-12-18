/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 12: Edison BLE Controller
 * This sketch was written by SparkFun Electronics
 * November 24, 2015
 * https://github.com/sparkfun
 *
 * Broadcasts as a BLE device. When a central device (e.g. smarthphone)
 * connects, it sends out button pushes as a notification on a characteristic.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// As per usual, we need MRAA. Also, bleno.
var mraa = require('mraa');
bleno = require('bleno');

// Define our global variables first
var bleno;
var controllerCharacteristic;

// BLE service and characteristic information
var edison = {
    name: "Edison",
    deviceId: null,
    service: "12ab",
    characteristic: "34cd"
};

// Create buttons on pins 44, 45, 46, and 47
var upPin = new mraa.Gpio(44, true, true);
var downPin = new mraa.Gpio(45, true, true);
var leftPin = new mraa.Gpio(46, true, true);
var rightPin = new mraa.Gpio(47, true, true);

// Set that pin as a digital input (read)
upPin.dir(mraa.DIR_IN);
downPin.dir(mraa.DIR_IN);
leftPin.dir(mraa.DIR_IN);
rightPin.dir(mraa.DIR_IN);

// Define our controller characteristic, which can be subscribed to
controllerCharacteristic = new bleno.Characteristic({
    value: null,
    uuid: edison.characteristic,
    properties: ['notify'],
    onSubscribe: function(maxValueSize, updateValueCallback) {
        console.log("Device subscribed");
        this._updateValueCallback = updateValueCallback;
    },
    onUnsubscribe: function() {
        console.log("Device unsubscribed");
        this._updateValueCallback = null;
    },
});

// This field holds the value that is sent out via notification
controllerCharacteristic._updateValueCallback = null;

// We define a special function that should be called whenever a value
// needs to be sent out as a notification over BLE.
controllerCharacteristic.sendNotification = function(buf) {
    if (this._updateValueCallback !== null) {
        this._updateValueCallback(buf);
    }
};

// Once bleno starts, begin advertising our BLE address
bleno.on('stateChange', function(state) {
    console.log('State change: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(edison.name,[edison.service]);
    } else {
        bleno.stopAdvertising();
    }
});

// Notify the console that we've accepted a connection
bleno.on('accept', function(clientAddress) {
    console.log("Accepted connection from address: " + clientAddress);
});

// Notify the console that we have disconnected from a client
bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected from address: " + clientAddress);
});

// When we begin advertising, create a new service and characteristic
bleno.on('advertisingStart', function(error) {
    if (error) {
        console.log("Advertising start error:" + error);
    } else {
        console.log("Advertising start success");
        bleno.setServices([

            // Define a new service
            new bleno.PrimaryService({
                uuid: edison.service,
                characteristics: [
                    controllerCharacteristic
                ]
            })
        ]);
    }
});
 
// Call the periodicActivity function
periodicActivity();

// This function is called forever (due to the setTimeout() function)
function periodicActivity() {
    
    // If a button is pushed, notify over BLE
    if (upPin.read() == 0) {
        controllerCharacteristic.sendNotification(new Buffer([0]));
    }
    if (downPin.read() == 0) {
        controllerCharacteristic.sendNotification(new Buffer([1]));
    }
    if (leftPin.read() == 0) {
        controllerCharacteristic.sendNotification(new Buffer([2]));
    }
    if (rightPin.read() == 0) {
        controllerCharacteristic.sendNotification(new Buffer([3]));
    }

    // Wait for 20 ms and call this function again
    setTimeout(periodicActivity, 20);
}

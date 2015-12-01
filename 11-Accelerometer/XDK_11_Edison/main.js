/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 11: Edison BLE Display
 * This sketch was written by SparkFun Electronics
 * November 30, 2015
 * https://github.com/sparkfun
 *
 * Accepts a connection from a smartphone and processes accelerometer data
 * from the cell phone (sent over BLE). Displays a block on the LCD that is
 * moved with the phone's accelerometer data.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// bleno makes the Edison act as a BLE peripheral
var bleno = require('bleno');

// BLE service and characteristic information
var edison = {
    name: "Edison",
    deviceId: null,
    service: "12ab",
    characteristic: "34cd"
};
    
// Define our display characteristic, which can be subscribed to
displayCharacteristic = new bleno.Characteristic({
    value: null,
    uuid: edison.characteristic,
    properties: ['write'],
    onWriteRequest : function(data, offset, withoutResponse, callback) {
        this.value = data;
        console.log('Write request: value = ' + this.value[0]);
        callback(this.RESULT_SUCCESS);
    }
});
    
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
                    displayCharacteristic
                ]
            })
        ]);
    }
});
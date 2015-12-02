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
 * from the cell phone (sent over BLE). Displays a character on the LCD that is
 * moved with the phone's accelerometer data.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// bleno makes the Edison act as a BLE peripheral
var bleno = require('bleno');

// We'll also need johnny-five and its Edison wrapper
var five = require('johnny-five');
var Edison = require('edison-io');

// Global game object
var game = {
    lcd: null,
    charX: 7,
    prevX: 0
};

// Create a new Johnny-Five board object that we will use to talk to the LCD
var board = new five.Board({
    io: new Edison()
});

// BLE service and characteristic information
var edison = {
    name: "Edison",
    deviceId: null,
    service: "12ab",
    characteristic: "34cd"
};
    
// Define our display characteristic, which can be subscribed to
displayCharacteristic = new bleno.Characteristic({
    uuid: edison.characteristic,
    properties: ['write'],
    onWriteRequest : function(data, offset, withoutResponse, callback) {
        
        // Parse the incoming data into X, Y, and Z acceleration values
        var accel = {
            x: data.readInt16LE(0) / 100,
            y: data.readInt16LE(2) / 100,
            z: data.readInt16LE(4) / 100
        };
        
        // Write the X, Y, and Z values to the console
        console.log("Write request: X=" + accel.x + 
                    " Y=" + accel.y + 
                    " Z=" + accel.z);
        
        // Update character's position and bound it to the limits of the LCD
        game.charX += accel.y / 10;
        if (game.charX < 0) {
            game.charX = 0;
        }
        if (game.charX > 15) {
            game.charX = 15;
        }
        
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

// Initialization callback that is called when Johnny-Five is done initializing
board.on('ready', function() {
    
    // Create our LCD object and define the pins
    // LCD pin name:    RS  EN DB4 DB5 DB6 DB7
    // Edison GPIO:     14  15  44  45  46  47  
    game.lcd = new five.LCD({
        pins: ["GP14", "GP15", "GP44", "GP45", "GP46", "GP47"],
        rows: 2,
        cols: 16
    });
    
    // Make sure the LCD is on, has been cleared, and the cursor is set to home
    game.lcd.on();
    game.lcd.clear();
    game.lcd.home();

    // Start running the game thread
    setInterval(draw, 50);
});

// Main game thread
function draw() {
    
    // Erase previous character
    game.lcd.cursor(0, game.prevX);
    game.lcd.print(" ");
    
    // Set cursor to character's current position
    var x = Math.round(game.charX);
    game.lcd.cursor(0, x);
    
    // Draw character
    game.lcd.print("o");
    
    // Set previous character location
    game.prevX = x;
}
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 9 - Part 2: Weather Forecast
 * This sketch was written by SparkFun Electronics
 * November 28, 2015
 * https://github.com/sparkfun
 *
 * Download local weather information from openweathermap.org and display
 * the forecast on the character LCD.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// We'll need johnny-five, the Edison wrapper, and OpenWeatherMap
var five = require('johnny-five');
var Edison = require('edison-io');
var weather = require('openweathermap');

// Create a new Johnny-Five board object that we will use to talk to the LCD
var board = new five.Board({
    io: new Edison()
});

// Global variables
var lcd;

// Initialization callback that is called when Johnny-Five is done initializing
board.on('ready', function() {
    
    // Create our LCD object and define the pins
    // LCD pin name:    RS  EN DB4 DB5 DB6 DB7
    // Edison GPIO:     14  15  44  45  46  47
    lcd = new five.LCD({
        pins: ["GP14", "GP15", "GP44", "GP45", "GP46", "GP47"],
        rows: 2,
        cols: 16
    });
    
    // Make sure the LCD is on, has been cleared, and the cursor is set to home
    lcd.on();
    lcd.clear();
    lcd.home();
    
    // Print our string
    lcd.print("Hello, world...");
    
    // Move to the second line, and continue our thought
    lcd.cursor(1, 0);
    lcd.print("...again.");
});
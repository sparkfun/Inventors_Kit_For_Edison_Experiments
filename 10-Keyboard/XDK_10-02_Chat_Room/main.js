/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 10 - Part 2: Chat Room
 * This sketch was written by SparkFun Electronics
 * November 20, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Serves a chat room where users can post messages. Captures keyboard input
 * and posts messages to the chat room.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the filesystem module and our keymap table
var fs = require('fs');
var keymap = require('./libs/keymap.js');

// We'll also need johny-five and its Edison wrapper
var five = require('johnny-five');
var Edison = require('edison-io');
var board = new five.Board({
    io: new Edison()
});

// Import HTTP and Express modules
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Global variables
var port = 4242;
var lcd;

// Johnny Five initialization
board.on('ready', function() {
    
    // Create our LCD object and define the pins
    // LCD pin name:    RS  EN DB4 DB5 DB6 DB7
    // Edison GPIO:     14  15  44  45  46  47
    lcd = new five.LCD({
        pins: ["GP14", "GP15", "GP44", "GP45", "GP46", "GP47"],
        backlight: 6,
        rows: 2,
        cols: 16
    });
    
    // Turn on LCD, clear it, and set cursor to home
    lcd.on();
    lcd.clear();
    lcd.home();
    lcd.blink();
    lcd.cursorPos = 0;
    lcd.msg = "";
    console.log("Start typing!");
});

// Create a stream that emits events on every key stroke
var readableStream = fs.createReadStream('/dev/input/event2');

// Callback for a key event
readableStream.on('data', function(buf) {
    
    // Check for key down event and determine key pressed
    if ((buf[24] == 1) && (buf[28] == 1)) {
        var keyCode = ((buf[27] & 0xff) << 8) | (buf[26] & 0xff);
        var keyChar = keymap.keys[keyCode];
        
        // Make the character appear on the LCD
        if (lcd !== undefined) {
            
            // If it is a backspace, delete the previous character
            if (keyChar === 'bksp') {
                if (lcd.msg !== "") {
                    lcd.msg = lcd.msg.slice(0, -1);
                }
                lcd.cursorPos--;
                if (lcd.cursorPos <= 0) {
                    lcd.cursorPos = 0;
                }
                lcd.print(" ");
                lcd.cursor(
                    Math.floor(lcd.cursorPos / lcd.cols), 
                    (lcd.cursorPos % lcd.cols)
                );
                lcd.print(" ");
                lcd.cursor(
                    Math.floor(lcd.cursorPos / lcd.cols), 
                    (lcd.cursorPos % lcd.cols)
                );
                
            // If it is a return character, post message and clear the LCD
            } else if (keyChar == 'enter') {
                console.log("Server: " + lcd.msg);
                io.emit('chat message', "Server: " + lcd.msg);
                lcd.clear();
                lcd.cursorPos = 0;
                lcd.msg = "";
                
            // Otherwise, print the character to the LCD
            } else if ((keyChar !== null) && (keyChar !== undefined)) {
                
                // Have the character appear on the LCD and append to message
                lcd.print(keyChar);
                lcd.cursorPos++;
                
                // Stop the cursor at the end of the LCD
                if (lcd.cursorPos >= (lcd.rows * lcd.cols)) {
                    lcd.cursorPos = (lcd.rows * lcd.cols) - 1;
                }
                
                // Remove the last char if we reached the end of the buffer
                if (lcd.msg.length >= (lcd.rows * lcd.cols)) {
                    lcd.msg = lcd.msg.slice(0, -1);
                }
                
                // Append character to message
                lcd.msg = lcd.msg.concat(keyChar);
            }
            
            // Update the cursor position (wrap to second line if needed)
            lcd.cursor(
                Math.floor(lcd.cursorPos / lcd.cols), 
                (lcd.cursorPos % lcd.cols)
            );
        }
    }
});

// Send the web page on client request
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Create a handler for when a client connects
io.on('connection', function(socket) {
    var clientIP = socket.client.conn.remoteAddress;
    
    // If we get a chat message, send it out to all clients
    socket.on('chat message', function(msg) {
        console.log(clientIP + ": " + msg);
        io.emit('chat message', clientIP + ": " + msg);
    });
});

// Start the server
http.listen(4242, function() {
    console.log('Server listening on port ' + port);
});
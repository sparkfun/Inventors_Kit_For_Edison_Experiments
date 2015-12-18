/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 5 - Part 2: Web Page Button
 * This sketch was written by SparkFun Electronics
 * November 1, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Serves a web page that allows users to turn an LED on and off remotely.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA and HTTP modules
var mraa = require('mraa');
var http = require('http');

// Set up a digital output on MRAA pin 20 (GP12) for the LED
var ledPin = new mraa.Gpio(20);
ledPin.dir(mraa.DIR_OUT);
ledPin.write(0);

// Global LED variable to know if the LED should be on or off
var led = 0;

// Which port we should connect to
var port = 4242;

// Create a web server that serves a simple web page with a button
var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.write(" <!DOCTYPE html>                                             \
                <html>                                                      \
                <head>                                                      \
                    <title>LED Controller</title>                           \
                    <script src='/socket.io/socket.io.js'></script>         \
                </head>                                                     \
                <body>                                                      \
                    <p><button onclick='toggle()'>TOGGLE</button></p>       \
                    <script>                                                \
                        var socket = io.connect('http://" + 
                            req.socket.address().address + ":" + 
                            port + "');                                     \
                        function toggle() {                                 \
                            socket.emit('toggle');                          \
                        }                                                   \
                    </script>                                               \
                </body>                                                     \
                </html>");
    res.end();
});

// Listen for a socket connection
var io = require('socket.io').listen(server);

// Wait for a client to connect
io.on('connection', function(socket) {
    console.log('A client is connected!');
    
    // Look for the "toggle" message from the client, and toggle the LED
    socket.on('toggle', function() {
        led = led ? 0 : 1;
        ledPin.write(led);
    });
});

// Run the server on a particular port
server.listen(port, function() {
    console.log('Server listening on port ' + port);
});

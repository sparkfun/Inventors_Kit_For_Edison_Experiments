/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 5 - Part 1: Web Page
 * This sketch was written by SparkFun Electronics
 * November 1, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Serves a very simple web page from the Edison.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the HTTP module
var http = require('http');

// Which port we should connect to
var port = 4242;

// Create a web server that serves a simple web page
var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.write(" <!DOCTYPE html>                                             \
                <html>                                                      \
                <head>                                                      \
                    <title>My Page</title>                                  \
                </head>                                                     \
                <body>                                                      \
                    <p>This is my page. There are many like it,             \
                    but this one is mine.</p>                               \
                </body>                                                     \
                </html>");
    res.end();
});

// Run the server on a particular port
server.listen(port, function() {
    console.log('Server listening on port ' + port);
});

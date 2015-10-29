/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 4: Email Notifier
 * This sketch was written by SparkFun Electronics
 * October 29, 2015
 * https://github.com/sparkfun
 *
 * Connect to an email service and turn on an LED if there are any unread
 * emails.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA and IMAP modules
var mraa = require('mraa');
var Imap = require('imap');

// Set up a digital output on MRAA pin 20 (GP12)
var ledPin = new mraa.Gpio(20);
ledPin.dir(mraa.DIR_OUT);

// It's usually a good idea to set the LED to an initial state
ledPin.write(0);

// Global LED variable to know if the LED should be on or off
var led = 0;

// Set email credentials (Gmail)
// Turn on "Acess for less secure apps" in Google account settings
// https://www.google.com/settings/security/lesssecureapps
var imap = new Imap({
  user: "<username>@gmail.com",
  password: "<password>",
  host: "imap.gmail.com",
  port: 993,
  tls: true
});

// Set email credentials (Yahoo)
/*var imap = new Imap({
  user: "<username>@yahoo.com",
  password: "<password>",
  host: "imap.mail.yahoo.com",
  port: 993,
  tls: true
});*/

// Open the mail box with the name "INBOX"
function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

// This is called when a connection is successfully made to the IMAP server.
// In this case, we open the Inbox and look for all unread ("unseen")
// emails. If there are any unread emails, turn on a LED.
imap.on('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
      
        // Search for unread emails in the Inbox
        imap.search(["UNSEEN"], function(err, results) {
            if (err) throw err;
            
            // Print the number of unread emails
            console.log("Unread emails: " + results.length);
            
            // If there are unread emails, turn on an LED
            if (results.length > 0) {
                ledPin.write(1);
            } else {
                ledPin.write(0);
            }
            
            // Close the connection
            imap.end();
        });
    });
});

// If we get an error (e.g. failed to connect), print that error
imap.on('error', function(err) {
    console.log(err);
});

// When we close the connection, print it to the console
imap.on('end', function() {
  console.log("Connection closed.");
});

// Call this function over and over again
periodicActivity();
function periodicActivity() //
{
    // Perform a quick connection to the IMAP server and look for unread emails
    imap.connect();

    // Wait for 10 seconds before checking for emails again
    setTimeout(periodicActivity, 10000);
}
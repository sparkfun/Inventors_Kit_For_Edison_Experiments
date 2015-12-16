/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 7: Speaker
 * This sketch was written by SparkFun Electronics
 * November 17, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Plays a tune using a PWM speaker.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Import the MRAA, file system, and POSIX clock modules
// NOTE: You must build posix-clock (npm install posix-clock) on the Edison
// iteslf. Building on a Windows machine will fail!
var mraa = require('mraa');
var fs = require('fs');
var clock = require('posix-clock');

// Global constants
var MAX_FREQ = 2100;

// Set up a digital output on MRAA pin GP13 for the LED
var speakerPin = new mraa.Gpio(13, true, true);
speakerPin.dir(mraa.DIR_OUT);
speakerPin.write(0);

// Read and parse song file
var song = fs.readFileSync(__dirname + "/songs/song.txt", 'utf-8');
song = song.replace(/\r/g, '');
song = song.split('\n');

// Play song
console.log("Playing...");
for (var t = 0; t < song.length; t++) {
    
    // Read the frequency and time length of the note
    var note = song[t].split(',');
    
    // Play the note
    playNote(speakerPin, note[0], note[1]);
}
console.log("Done!");

// Play a note with a given frequency for msec milliseconds
function playNote(pin, freq, msec) {
    
    // Make sure we don't go over the maximum frequency
    if (freq >= MAX_FREQ) {
        freq = MAX_FREQ;
    }
    
    // If the frequency is 0, don't play anything
    if (freq == 0) {
        console.log("Silece for " + msec + "ms");
        sleepUsec(msec * 1000);
        return;
    }
    
    // Define the note's period and how long we play it for
    var period = 1 / freq;
    var length = msec / (period * 1000);
    
    console.log("Playing " + freq + "Hz for " + msec + "ms");
    
    // For one period, send pin high and low for 1/2 period each
    for (var i = 0; i < length; i++) {
        pin.write(1);
        sleepUsec((period / 2) * 1000000);
        pin.write(0);
        sleepUsec((period / 2) * 1000000);
    }
}

// Sleep for a number of given microseconds using the POSIX clock
function sleepUsec(usec) {
    var s = Math.floor(usec / 1000000);
    var ns = Math.floor((usec - (s * 1000000)) * 1000);
    clock.nanosleep(clock.MONOTONIC, 0, {sec: s, nsec: ns});
}
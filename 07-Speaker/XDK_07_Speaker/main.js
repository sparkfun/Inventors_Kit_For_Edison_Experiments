/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 7: Speaker
 * This sketch was written by SparkFun Electronics
 * November 17, 2015
 * Updated: August 1, 2016
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 *
 * Plays a tune using a PWM speaker.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

var mraa = require('mraa');
var fs = require('fs');

// Global constants
var MAX_FREQ = 2100;

// Set up a digital output on MRAA pin GP13 for the speaker
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
    playNote(speakerPin, parseFloat(note[0]), parseInt(note[1], 10));
}
console.log("Done!");

// Play a note with a given frequency for msec milliseconds
function playNote(pin, freq, msec) {
    
    // Check to make sure we actually have valid numbers
    if (freq === "NaN" || msec === "NaN") {
        return;
    }
    
    // Make sure we don't go over the maximum frequency
    if (freq >= MAX_FREQ) {
        freq = MAX_FREQ;
    }
    
    // If the frequency is 0, don't play anything
    if (freq === 0) {
        console.log("Silence for " + msec + "ms");
        delaynsec(msec * 1e6);
        return;
    }
    
    // Define the note's period and how long we play it for
    var period = 1 / freq;
    var length = msec / (period * 1000);
    
    console.log("Playing " + freq + "Hz for " + msec + "ms");
    
    // For one period, send pin high and low for 1/2 period each
    for (var i = 0; i < length; i++) {
        pin.write(1);
        delaynsec(Math.round((period / 2) * 1e9));
        pin.write(0);
        delaynsec(Math.round((period / 2) * 1e9));
    }
}

// Delay for a number of given nanoseconds
function delaynsec(nsec) {
    
    var time = process.hrtime();
    var diff;
    var diffNSec;
    
    // Wait until the specified number of nanoseconds has passed
    do {
        diff = process.hrtime(time);
        diffNSec = (diff[0] * 1e9) + diff[1];
    } while (diffNSec < nsec);
}
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 8: Temperature and Light Logger
 * This sketch was written by SparkFun Electronics
 * December 2, 2015
 * https://github.com/sparkfun
 *
 * Reads temperature and light values from ADC Block and posts them to
 * data.sparkfun.com.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// MRAA, as per usual
var mraa = require('mraa');

// The Request module helps us make HTTP calls (e.g. to data.sparkfun)
var request = require('request');

// TI ADS1015 on ADC Block (http://www.ti.com.cn/cn/lit/ds/symlink/ads1015.pdf)
var adc = new mraa.I2c(1);
adc.address(0x48);

// Read from ADC and return voltage
adc.readADC = function(channel) {
    
    // The ADC Block can't have more than 4 channels
    if (channel <= 0) {
        channel = 0;
    }
    if (channel >= 3) {
        channel = 3;
    }
    
    // We will use constant settings for the config register
    var config = 0;                 // Bits     Description
    config |= 1 << 15;              // [15]     Begin a single conversion
    config |= 1 << 14;              // [14]     Non-differential ADC
    config |= channel << 12;        // [13:12]  Choose a channel
    config |= 1 << 9;               // [11:9]   +/-4.096V range
    config |= 1 << 8;               // [8]      Power-down, single-shot mode
    config |= 4 << 5;               // [7:5]    1600 samples per second
    config &= ~(1 << 4);            // [4]      Traditional comparator
    config &= ~(1 << 3);            // [3]      Active low comparator polarity
    config &= ~(1 << 2);            // [2]      Non-latching comparator
    config |= 3;                    // [1:0]    Disable comparator
    
    // Write config settings to ADC to start reading
    this.writeWordFlip(0x01, config);
    
    // Wait for conversion to complete
    while (!(this.readWordFlip(0x01) & 0x8000)) {
    }
    
    // Read value from conversion register and shift by 4 bits
    var voltage = (adc.readWordFlip(0x00) >> 4);
    
    // Find voltage, which is 2mV per incement
    voltage = 0.002 * voltage;
    
    return voltage
};

// The ADS1015 accepts LSB first, so we flip the bytes
adc.writeWordFlip = function(reg, data) {
    var buf = ((data & 0xff) << 8) | ((data & 0xff00) >> 8);
    return this.writeWordReg(reg, buf);
};

// The ADS1015 gives us LSB first, so we flip the bytes
adc.readWordFlip = function(reg) {
    var buf = adc.readWordReg(reg);
    return ((buf & 0xff) << 8) | ((buf & 0xff00) >> 8);
};

// Take temperature and light readings at regular intervals
setInterval(takeReadings, 500);
function takeReadings() {
    
    // Read temperature sensor (on ADC0) and calculate temperature in Celsius
    var v0 = adc.readADC(0);
    var degC = (v0 - 0.5) * 100;
    
    // Read light sensor (on ADC1)
    var v1 = adc.readADC(1);
    
    // Print temperature and light to console
    console.log("Temp: " + degC.toFixed(1) + "C Light: " + v1.toFixed(3) + "V");
}
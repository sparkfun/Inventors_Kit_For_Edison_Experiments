/*jslint unparam: true */
/*jshint strict: true, -W097, unused:false,  undef:true, devel:true */
/*global window, document, d3, $, io, navigator, setTimeout */

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 6 - Part 1: Simple Web App
 * This sketch was written by SparkFun Electronics
 * November 10, 2015
 * https://github.com/sparkfun/Inventors_Kit_For_Edison_Experiments
 * 
 * Create a some dynamic text that appears when a button is pushed.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Make the toggle text div appear and disappear
function toggleText() {
    
    // Put in strict mode to restrict some JavaScript "features"
    "use strict";
    
    // Declare our variables at the beginning of the scope
    var toggleTextEl = $('#toggle_text');
    
    // Toggle the visibility of the text
    toggleTextEl.fadeToggle();
    
    // Print the visibility to the console
    console.log("Visibility: " + toggleTextEl.css('visibility'));
}

// Short for jQuery(document).ready() method, which is called after the page
// has loaded. We can use this to assign callbacks to elements on the page.
$(function() {
    "use strict";

    // Assign a callback to the "Push Me" button
    $('#toggle_button').on('click', function(){
        toggleText();
    });
});
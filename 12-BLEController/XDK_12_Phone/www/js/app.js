/*jslint unparam: true */
/*jshint strict: true, -W097, unused:false,  undef:true, devel:true */
/*global window, document, d3, $, io, navigator, setTimeout */
/*global ble*/

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 12: Phone BLE Ball
 * This sketch was written by SparkFun Electronics
 * November 23, 2015
 * https://github.com/sparkfun
 * 
 * Runs as BLE central on smartphone. Accepts BLE connection from Edison and 
 * moves ball around screen based on BLE notifications from the Edison.
 * 
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// Put in strict mode to restrict some JavaScript "features"
"use strict" ;

// BLE service and characteristic information
window.edison = {
    name: null,
    deviceId: null,
    service: "12ab",
    characteristic: "34cd"
};

/******************************************************************************
 * Game Class
 *****************************************************************************/

// Game constructor
function Game(canvas) {
    
    // Assign the canvas to our properties
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
    
    // Initialize the rest of the properties
    this._gameThread = null;
    this._ball = {
        x: this._canvas.width / 2,
        y: this._canvas.height / 2,
        radius: 10,
        visible: false
    };
}

// Call this to update the ball's position
Game.prototype.updateBallPos = function(dx, dy) {
    
    // Increment the ball's position
    this._ball.x += dx;
    this._ball.y += dy;

    // Make the ball stick to the edges
    if (this._ball.x > this._canvas.width - this._ball.radius) {
        this._ball.x = this._canvas.width - this._ball.radius;
    }
    if (this._ball.x < this._ball.radius) {
        this._ball.x = this._ball.radius;
    }
    if (this._ball.y > this._canvas.height - this._ball.radius) {
        this._ball.y = this._canvas.height - this._ball.radius;
    }
    if (this._ball.y < this._ball.radius) {
        this._ball.y = this._ball.radius;
    }
};

// Draws the ball on the canvas
Game.prototype.drawBall = function() {
    this._ctx.beginPath();
    this._ctx.arc(this._ball.x, 
                  this._ball.y, 
                  this._ball.radius, 
                  0, 
                  Math.PI * 2);
    this._ctx.fillStyle = "#BB0000";
    this._ctx.fill();
    this._ctx.closePath();
};

// This gets called by the main thread to repeatedly clear and draw the canvas
Game.prototype.draw = function() {
    if (typeof this._ctx != 'undefined') {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        if (this._ball.visible) {
            this.drawBall();
        }
    }
};

// Call this to start the main game thread
Game.prototype.start = function() {
    var that = this;
    this._ball.visible = true;
    this._gameThread = window.setInterval(function() {
        that.draw();
    }, 50);
};

// Call this to stop the main game thread
Game.prototype.stop = function() {
    this.ball.visible = false;
    this.draw();
    window.clearInterval(this.gameThread);
};

/******************************************************************************
 * Main App
 *****************************************************************************/

// Global app object we can use to create BLE callbacks
window.app = {
    
    // Game object
    game: null,
    
    // Call this first!
    initialize: function() {
        this.bindEvents();
    },
    
    // Connect events to elements on the page
    bindEvents: function() {
        var that = this;
        $('#connect_ble').on('click', this.connect);
    },
    
    // Scan for a BLE device with the name provided and connect to it
    connect: function() {
        var that = this;
        window.edison.name = $('#ble_name').val();
        debug("Looking for " + window.edison.name);
        ble.scan([], 
                 5, 
                 window.app.onDiscoverDevice,
                 window.app.onError);
    },
    
    // When we find a BLE device, if it has the name we want, connect to it
    onDiscoverDevice: function(device) {
        var that;
        debug("Found " + device.name + " at " + device.id);
        if (device.name == window.edison.name) {
            window.edison.deviceId = device.id;
            debug("Attempting to connect to " + device.id);
            ble.connect(window.edison.deviceId,
                        window.app.onConnect,
                        window.app.onError);
        }
    },
    
    //  On BLE connection, subscribe to the characteristic, and start the game
    onConnect: function() {
        window.app.game.start();
        debug("Connected to " + window.edison.name + " at " + 
              window.edison.deviceId);
        ble.startNotification(window.edison.deviceId, 
                              window.edison.service, 
                              window.edison.characteristic,
                              window.app.onNotify,
                              window.app.onError);
    },
    
    // Move the ball based on the direction of the notification
    onNotify: function(data) {
        var dir = new Uint8Array(data);
        debug("Dir: " + dir[0]);
        switch(dir[0]) {
            case 0:
                window.app.game.updateBallPos(0, -1);
                break;
            case 1:
                window.app.game.updateBallPos(0, 1);
                break;
            case 2:
                window.app.game.updateBallPos(-1, 0);
                break;
            case 3:
                window.app.game.updateBallPos(1, 0);
                break;
            default:
                debug("Message error");
        }
    },
    
    // Alert the user if there is an error and stop the game
    onError: function(err) {
        window.app.game.stop();
        debug("Error: " + err);
        alert("Error: " + err);
    }
};

/******************************************************************************
 * Execution starts here after page has loaded
 *****************************************************************************/

// Short for jQuery(document).ready() method, which is called after the page
// has loaded. We can use this to assign callbacks to elements on the page.
$(function() {
    
    // Initialize the app and assign callbacks
    window.app.initialize();
    
    // Create a new instance of the game and assign it to the app
    window.app.game = new Game($('#ball_canvas')[0]);
});

// Create a pseudo-debugging console
// NOTE: Real apps should use alert(), but list messages can be useful when
// you are debugging the program
function debug(msg) {
    $('#debug').append($('<li>').text(msg));
}
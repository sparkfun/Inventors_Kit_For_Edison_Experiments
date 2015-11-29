/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting

/**
 * SparkFun Inventor's Kit for Edison
 * Experiment 9 - Part 2: Weather
 * This sketch was written by SparkFun Electronics
 * November 29, 2015
 * https://github.com/sparkfun
 *
 * Download a city's weather information from Yahoo Weather
 * (https://developer.yahoo.com/weather/) and display that city's 
 * temperature and current condition.
 *
 * Released under the MIT License(http://opensource.org/licenses/MIT)
 */

// We'll need johnny-five, the Edison wrapper, and OpenWeatherMap
var five = require('johnny-five');
var Edison = require('edison-io');
var http = require('http');

// Replace this with the city you want to get the weather from
var cityStr = "Boulder, CO";

// Create a new Johnny-Five board object that we will use to talk to the LCD
var board = new five.Board({
    io: new Edison()
});

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
    
    // Print a splash string
    lcd.print("My Weather App");
    
    // Start getting weather data
    setInterval( function() {
        getTemperature(cityStr, lcd);
    }, 5000);
});

// A function to make a request to the Yahoo Weather API
function getTemperature(cityReq, lcd) {
    
    // Construct YQL (https://developer.yahoo.com/weather/)
    var yql = "select * from weather.forecast where woeid in " +
              "(select woeid from geo.places(1) where text='" + cityReq + "')";

    // Construct GET request
    var getReq = "http://query.yahooapis.com/v1/public/yql?q=" + 
                    yql.replace(/ /g,"%20") + 
                    "&format=json&env=store%3A%2F%2Fdatatables.org%2" +
                    "Falltableswithkeys";
    
    // Make the request
    var request = http.get(getReq, function(response) {
    
        // Where we store the response text
        var body = '';

        //Read the data
        response.on('data', function(chunk) {
            body += chunk;
        });

        // Print out the data once we have received all of it
        response.on('end', function() {
            if (response.statusCode === 200) {
                try {

                    // Parse the JSON to get the pieces we need
                    var weatherResp = JSON.parse(body);
                    var channelResp = weatherResp.query.results.channel;
                    var conditionResp = channelResp.item.condition;
                    
                    // Extract the city and region
                    var city = channelResp.location.city;
                    var region = channelResp.location.region;
                    
                    // Get the local weather
                    var temperature = conditionResp.temp;
                    var tempUnit = channelResp.units.temperature;
                    var description = conditionResp.text;
                    
                    // Construct city and weather strings to be printed
                    var cityString = city + ", " + region;
                    var weatherString = temperature + tempUnit + " " + 
                                        description;

                    //Print the city, region, time, and temperature
                    console.log(cityString);
                    console.log(weatherString + "\n");
                    
                    // Truncate the city and weather strings to fit on the LCD
                    cityString = cityString.substring(0, 16);
                    weatherString = weatherString.substring(0, 16);
                    
                    // Print them on the LCD
                    lcd.clear();
                    lcd.home();
                    lcd.print(cityString);
                    lcd.cursor(1, 0);
                    lcd.print(weatherString);

                } catch(error) {

                    // Report problem with parsing the JSON
                    console.log("Parsing error: " + error);
                }
            } else {

                // Report problem with the response
                console.log("Response error: " + 
                            http.STATUS_CODES[response.statusCode]);
            }
        })
    });

    // Report a problem with the connection
    request.on('error', function (err) {
        console.log("Connection error: " + err);
    });
}
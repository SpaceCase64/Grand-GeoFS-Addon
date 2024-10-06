// ==UserScript==
// @name         Grand GeoFS addon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds some value based mechanics to geofs.
// @author       SpAv12(acid=999227)
// @match        https://geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a container element to display the output
    var outputDiv = document.createElement('div');
    outputDiv.style.position = "fixed";
    outputDiv.style.bottom = "10px"; // Places it at the bottom of the screen
    outputDiv.style.right = "10px";
    outputDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
    outputDiv.style.color = "white";
    outputDiv.style.padding = "10px";
    outputDiv.style.borderRadius = "5px";
    outputDiv.style.zIndex = "1000"; // Keeps it on top of other elements
    document.body.appendChild(outputDiv);

    function checkConsoleOutput() {
        try {
            // Checking Height
            //var Hresult = eval('geofs.aircraft.instance.oldAltitude'); // Height result

            // Update the pad with calculated atmospheric pressure
            //var AtmP = 101325 * Math.exp(-(9.8 * 0.0289 * Hresult) / (8.31 * 300));
            outputDiv.innerHTML = "Atmospheric Pressure (Pascals): " + eval('weather.atmosphere.airPressureAtAltitude').toFixed(2) + ", temp(Celsius): " + eval("weather.atmosphere.airTempAtAltitude").toFixed(2);
        } catch (error) {
            outputDiv.innerHTML = "Error: " + error;
        }
    }

    // Update every 0.5 seconds
    setInterval(checkConsoleOutput, 500);





    (function() {
    'use strict';

    // Create a second output pad to display the second console output
    var secondOutputDiv = document.createElement('div');
    secondOutputDiv.style.position = "fixed";
    secondOutputDiv.style.bottom = "50px"; // Adjust to be above the first outputDiv
    secondOutputDiv.style.right = "10px";
    secondOutputDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    secondOutputDiv.style.color = "white";
    secondOutputDiv.style.padding = "10px";
    secondOutputDiv.style.borderRadius = "5px";
    secondOutputDiv.style.zIndex = "1000";
    document.body.appendChild(secondOutputDiv);

    // Function to check the first console command
    function checkConsoleOutput() {
        try {
            // If engine is on
            var OnCheck = eval('geofs.aircraft.instance.engine.on');

            if (OnCheck = "true") { // If engine is REALLY on
                var RpmCheck = eval('geofs.aircraft.instance.engine.rpm'); // Rpm value
                var OilCheck = RpmCheck * 0.001721347 * ((eval(weather.atmosphere.airTempAtAltitudeKelvin))*(eval(geofs.aircraft.instance.definition.mass)/70000))
                // Output the result of the second check into the second pad
                secondOutputDiv.innerHTML = "Oil pressure (kg/cm^2): " + (OilCheck * 0.070307).toFixed(2) + ",(psi)" + OilCheck.toFixed(2) + ", airspeed(m/s): " + eval("geofs.aircraft.instance.velocityScalar").toFixed(2) + ", vertical speed(m/s)" + eval("geofs.aircraft.instance.velocity[2]").toFixed(2);
            } else {
                secondOutputDiv.innerHTML = "Engine check failed, oil output not available.";
            }
        } catch (error) {
            secondOutputDiv.innerHTML = "Error: " + error;
        }
    }

    // Update every 0.5 seconds
    setInterval(checkConsoleOutput, 500);

})();




    //Suggested by 901528, fuel flow
(function() {
    'use strict';

var fuel; // Stating what fuel is

// Function to check if aircraft is loaded
function initializeFuel() {
    if (typeof geofs !== "undefined" && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.definition) {
        // Once the aircraft data is available, initialize the fuel
        fuel = geofs.aircraft.instance.definition.mass * 0.666;
        console.log("Fuel initialized: " + fuel);
        clearInterval(fuelCheckInterval); // Stop checking once initialized
    } else {
        console.log("Waiting for aircraft data...");
    }
}

// Periodically check if the aircraft data is available (every 100ms)
var fuelCheckInterval = setInterval(initializeFuel, 100);






    //var maxFuel = 0.6666 ; // Maximum fuel capacity(old)
    var consumption;

    // Create fuel display
    var fuelOutputDiv = document.createElement('div');
    fuelOutputDiv.style.position = "fixed";
    fuelOutputDiv.style.bottom = "90px";
    fuelOutputDiv.style.right = "10px";
    fuelOutputDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    fuelOutputDiv.style.color = "white";
    fuelOutputDiv.style.padding = "10px";
    fuelOutputDiv.style.borderRadius = "5px";
    fuelOutputDiv.style.zIndex = "1000";
    document.body.appendChild(fuelOutputDiv);

    // Create refuel button
    var refuelButton = document.createElement('button');
    refuelButton.innerHTML = "Refuel";
    refuelButton.style.position = "fixed";
    refuelButton.style.top = "150px";
    refuelButton.style.right = "10px";
    refuelButton.style.padding = "10px";
    refuelButton.style.zIndex = "1000";
    document.body.appendChild(refuelButton);

    // Function to check if engine is on
    function isEngineOn() {
        return eval('geofs.aircraft.instance.engine.on');
    }

    // Function to get RPM value
    function getRPM() {
        return eval('geofs.aircraft.instance.engine.rpm');
    }

    // Function to check if plane is on the ground
    function isOnGround() {
        return eval('geofs.aircraft.instance.groundContact');
    }

    // Function to shut off engine when fuel is 0
    function shutOffEngine() {
        eval('geofs.aircraft.instance.definition.maxRPM = 0'); // Set engine to off
    }

    // Function to calculate fuel consumption based on RPM
    function calculateFuelConsumption() {
        var rpm = getRPM();
        consumption = (rpm / 7000) * 0.3;
        return (rpm / 7000) * 0.3; // Fuel consumption formula based on RPM
    }

    // Function to update fuel display
    function updateFuelDisplay() {
        fuelOutputDiv.innerHTML = "Fuel Left: " + fuel.toFixed(2) + " liters, consumption(l/s): " + (consumption*2).toFixed(2) + ", estimated time: " + ((fuel/(consumption*2))/60).toFixed(0) + " min";
    }

    // Function to handle fuel consumption and engine shutdown
    function consumeFuel() {
        if (isEngineOn() && fuel > 0) {
            var fuelConsumed = calculateFuelConsumption();
            fuel -= fuelConsumed;
            if (fuel <= 0) {
                fuel = 0;
                shutOffEngine(); // Shut off engine if fuel is 0
            }
        }
        updateFuelDisplay(); // Update the display with the new fuel level
    }

    // Refuel button logic
    refuelButton.addEventListener('click', function() {
        if (isOnGround()) { // Only refuel if the plane is on the ground
            fuel = eval('geofs.aircraft.instance.definition.mass')*0.666; // Reset fuel to max
            eval('geofs.aircraft.instance.definition.maxRPM = 10000'); // Set engine to on
            updateFuelDisplay(); // Update the display
        } else {
            alert("You are in air! Land to refuel.");
        }
    });

    // Interval to consume fuel every 0.5 seconds
    setInterval(function() {
        consumeFuel();
    }, 500);

})();

})();

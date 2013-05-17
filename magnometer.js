var Magnometer = require('./adapters/hmc5883l').Magnometer;

var device = new Magnometer(30);

device.init(function () {
  console.dir(arguments);
  setInterval(function () {
    device.getData(function (err, data) {
      console.dir(data);
      var heading = Math.atan2(data[1], data[0]);
   
      // Correct for when signs are reversed.
      if (heading < 0) {
        heading += 2 * Math.Pi;
      }

      // Convert radians to degrees for readability.
      var headingDegrees = heading * 180/Math.PI; 


      console.log(headingDegrees, heading);
    });
  }, 200);
});

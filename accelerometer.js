var Accelerometer = require('./adapters/adxl345').Accelerometer;

var device = new Accelerometer(83);

device.init(function () {
  console.dir(arguments);
  setInterval(function () {
    device.getData(function (err, data) {
      console.dir(data);
    });
  }, 200);
});

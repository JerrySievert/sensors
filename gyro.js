var Gyro = require('./adapters/l3g4200d').Gyro;

var device = new Gyro(105);

device.init(function () {
  console.dir(arguments);
  setInterval(function () {
    device.readAxis(function () {
      console.dir(arguments);
    });
  }, 200);
});

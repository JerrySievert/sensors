var i2c = require('i2c');
var wire = new i2c();

wire.scan(function (err, data) {
  if (err) {
    console.log("ERROR: " + err);
  } else {
    for (var i = 0; i < data.length; i++) {
      console.log("device found at address " + data[i]);
    }
  }
});

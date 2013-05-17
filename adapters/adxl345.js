var DATA_FORMAT = 0x31,
    POWER_CTL   = 0x2D,  //Power Control Register
    DATAX0      = 0x32, //X-Axis Data 0
    DATAX1      = 0x33, //X-Axis Data 1
    DATAY0      = 0x34, //Y-Axis Data 0
    DATAY1      = 0x35, //Y-Axis Data 1
    DATAZ0      = 0x36, //Z-Axis Data 0
    DATAZ1      = 0x37; //Z-Axis Data 1


var i2c = require('i2c');


function Accelerometer (address) {
  this.address = address;
  this.wire = new i2c(address);

  this.wire.on('data', function (data) {
    console.log(data);
  });

  this.init = function (callback) {
    var self = this;
    this.wire.writeBytes(DATA_FORMAT, [ 0x01 ], function (err) {
      if (err) {
        callback(err);
      } else {
        self.wire.writeBytes(POWER_CTL, [ 0x08 ], callback);
      }
    });
  };

  this.getData = function (callback) {
    this.wire.readBytes(DATAX0, 6, function (err, values) {
      if (err) {
        callback(err);
      } else {
        var x = (values[1] * 256) + values[0],
            y = (values[3] * 256) + values[2],
            z = (values[5] * 256) + values[4];

        // this is a signed number, convert if needed
        if ((x & 0x8000) > 0) {
          x = x - 0x10000;
        }

        if ((y & 0x8000) > 0) {
          y = y - 0x10000;
        }

        if ((z & 0x8000) > 0) {
          z = z - 0x10000;
        }

        callback(null, [ x, y, z ]);
      }
    });
  };
}

exports.Accelerometer = Accelerometer;

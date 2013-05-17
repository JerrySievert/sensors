var i2c = require('i2c');

function Magnometer (address) {
  this.address = address;
  this.wire = new i2c(address);

  this.wire.on('data', function (data) {
    console.log(data);
  });

  this.init = function (callback) {
    var self = this; 

    // select mode register
    self.wire.writeBytes(0x02, [ 0 ], callback);
  };

  this.getData = function (callback) {
    var self = this;
    self.wire.readBytes(0x03, 6, function (err, data) {
      var x, y, z;

      if (err) {
        callback(err);
      } else {
        x = (data[0] * 256) + data[1];
        // this is a signed number, convert if needed
        if ((x & 0x8000) > 0) {
          x = x - 0x10000;
        }

        y = (data[2] * 256) + data[3];
        if ((y & 0x8000) > 0) {
          y = y - 0x10000;
        }

        z = (data[4] * 256) + data[5];
        if ((z & 0x8000) > 0) {
          z = z - 0x10000;
        }

        callback(null, [ x, y, z ]);
      }
    });
  };
}

exports.Magnometer = Magnometer;

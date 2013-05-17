
var i2c = require('i2c');

var CTRL_REG1 = 0x20,
    CTRL_REG2 = 0x21,
    CTRL_REG3 = 0x22,
    CTRL_REG4 = 0x23,
    CTRL_REG5 = 0x24;

var OUT_X_L = 0x28,
    OUT_X_H = 0x29,
    OUT_Y_L = 0x2a,
    OUT_Y_H = 0x2b,
    OUT_Z_L = 0x2c,
    OUT_Z_H = 0x2d;

function Gyro (address) {
  this.address = address;
  this.wire = new i2c(address);

  this.wire.on('data', function (data) {
    console.log(data);
  });

  this.init = function (callback) {
    var self = this;
    this.wire.readBytes(0x0f, 1, function (err, data) {
      if (err) {
        callback(err);
      } else {
        if (data[0] !== 0xd3) {
          callback("wrong device");
        } else {
          // enable x, y, z and turn off power down
          self.wire.writeBytes(CTRL_REG1, [ 15 ], function (err, data) {
            if (err) {
              callback(err);
            } else {
              // generate data ready interupt on INT2
              self.wire.writeBytes(CTRL_REG3, [ 8 ], function (err, data) {
                if (err) {
                  callback(err);
                } else {
                  self.wire.writeBytes(CTRL_REG4, [ 32 ], function (err, data) {
                    callback(err, data);
                  }); 
                }
             });
            }
          });
        }
      }
    });
  };

  this.readAxis = function (callback) {
    var self = this;

    var x = 0,
        y = 0,
        z = 0;

    // read the lsb x value
    self.wire.readBytes(OUT_X_L, 1, function (err, data) {
      if (err) {
        callback(err);
      } else {
        x = data[0];

        // read the msb x value
	self.wire.readBytes(OUT_X_H, 1, function (err, data) {
          if (err) {
            callback(err);
          } else {
            x += (data[0] * 256);

            // this is a signed number, convert if needed
            if ((x & 0x8000) > 0) {
              x = x - 0x10000;
            }

            // read the lsb y value
            self.wire.readBytes(OUT_Y_L, 1, function (err, data) {
              if (err) {
                callback(err);
              } else {
                y = data[0];

                // read the msb y value
                self.wire.readBytes(OUT_Y_H, 1, function (err, data) {
                  if (err) {
                    callback(err);
                  } else {
                    y += (data[0] * 256);

                    if ((y & 0x8000) > 0) {
                      y = y - 0x10000;
                    }

                    // read the lsb z value
                    self.wire.readBytes(OUT_Z_L, 1, function (err, data) {
                      if (err) {
                        callback(err);
                      } else {
                        z = data[0];

                        // read the msb z value
                        self.wire.readBytes(OUT_Z_H, 1, function (err, data) {
                          if (err) {
                            callback(err);
                          } else {
                            z += (data[0] * 256);

                            if ((z & 0x8000) > 0) {
                              z = z - 0x10000;
                            }

                            callback(null, [ x, y, z ]);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  };
}

exports.Gyro = Gyro;

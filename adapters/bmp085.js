
function BMP085 (address, wire) {
  this.address = address;
  this.wire = wire;
  this.calibrations = null;
}


BMP085.prototype.readInteger = function (value, callback) {
  var self = this;

  if (Array.isArray(value) === false) {
    value = [ value ];
  }

  self.wire.write(self.address, value, function (err) {
    if (err) {
      callback(err);
    } else {
      self.wire.read(self.address, 2, function (err, res) {
        var buf = new Buffer(res);

        if (err) {
          callback(err);
        } else {
          callback(null, buf.readUInt16BE(0));
        }
      });
    }
  });
};

BMP085.prototype.readByte = function (value, callback) {
  var self = this;

  if (Array.isArray(value) === false) {
    value = [ value ];
  }

  self.wire.write(self.address, value, function (err) {
    if (err) {
      callback(err);
    } else {
      self.wire.read(self.address, 1, function (err, res) {
        var buf = new Buffer(res);

        if (err) {
          callback(err);
        } else {
          callback(null, buf.readUInt8(0));
        }
      });
    }
  });
};


BMP085.prototype.calibrate = function (callback)
{
  var self = this;
  var calibrations = { };

  self.readInteger(0xAA, function (err, res) {
    calibrations['0xAA'] = res;

    self.readInteger(0xAC, function (err, res) {
      calibrations['0xAC'] = res;

      self.readInteger(0xAE, function (err, res) {
        calibrations['0xAE'] = res;

        self.readInteger(0xB0, function (err, res) {
          calibrations['0xB0'] = res;

          self.readInteger(0xB2, function (err, res) {
            calibrations['0xB2'] = res;

            self.readInteger(0xB4, function (err, res) {
              calibrations['0xB4'] = res;

              self.readInteger(0xB6, function (err, res) {
                calibrations['0xB6'] = res;

                self.readInteger(0xB8, function (err, res) {
                  calibrations['0xB8'] = res;

                  self.readInteger(0xBA, function (err, res) {
                    calibrations['0xBA'] = res;

                    self.readInteger(0xBC, function (err, res) {
                      calibrations['0xBC'] = res;

                      self.readInteger(0xBE, function (err, res) {
                        calibrations['0xBE'] = res;

                        self.calibration = calibrations;
                        callback();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

BMP085.prototype.readPressure = function () {
  var self = this;

  if (this.calibation === null) {
    this.calibrate(this.readPressure);
  }

  var msb, lsb, xlsb, up = 0;

  this.wire.write(this.address, [ 0xF4, 0x34 ], function (err, res) {
    setTimeout(function () {
    self.readByte(0xF6, function (err, value) {
      msb = value;
      self.readByte(0xF7, function (err, value) {
        lsb = value;
        self.readByte(0xF8, function (err, value) {
          xlsb = value;

          up = ((msb << 16) | (lsb << 8) | xlsb) >> 8;
          console.log("results: " + up);
        });
      });
    });
  }, 5);
  });

/*
  var msb, lsb, xlsb, up = 0;
  
  // Write 0x34+(OSS<<6) into register 0xF4
  // Request a pressure reading w/ oversampling setting
  Wire.beginTransmission(BMP085_ADDRESS);
  Wire.write(0xF4);
  Wire.write(0x34 + (OSS<<6));
  Wire.endTransmission();
  
  // Wait for conversion, delay time dependent on OSS
  delay(2 + (3<<OSS));
  
  // Read register 0xF6 (MSB), 0xF7 (LSB), and 0xF8 (XLSB)
  Wire.beginTransmission(BMP085_ADDRESS);
  Wire.write(0xF6);
  Wire.endTransmission();
  Wire.requestFrom(BMP085_ADDRESS, 3);
  
  // Wait for data to become available
  while(Wire.available() < 3)
    ;
  msb = Wire.read();
  lsb = Wire.read();
  xlsb = Wire.read();
  
  up = (((unsigned long) msb << 16) | ((unsigned long) lsb << 8) | (unsigned long) xlsb) >> (8-OSS);
  
  return up;
  */
};



exports.BMP085 = BMP085;



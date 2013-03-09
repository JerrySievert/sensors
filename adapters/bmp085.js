

var calibrations = { };

function readInteger(value, wire, address, callback) {
  wire.write(address, [ value ], function (err) {
    if (err) {
      callback(err);
    } else {
      wire.read(address, 2, function (err, res) {
        var buf = new Buffer(res);

        if (err) {
          callback(err);
        } else {
          callback(null, buf.readUInt8(0) << 8 | buf.readUInt8(1));
        }
      });
    }
  });
}

function calibrate(wire, address, callback)
{
  readInteger(0xAA, wire, address, function (err, res) {
    calibrations['0xAA'] = res;

    readInteger(0xAC, wire, address, function (err, res) {
      calibrations['0xAC'] = res;

      readInteger(0xAE, wire, address, function (err, res) {
        calibrations['0xAE'] = res;

        readInteger(0xB0, wire, address, function (err, res) {
          calibrations['0xB0'] = res;

          readInteger(0xB2, wire, address, function (err, res) {
            calibrations['0xB2'] = res;

            readInteger(0xB4, wire, address, function (err, res) {
              calibrations['0xB4'] = res;

              readInteger(0xB6, wire, address, function (err, res) {
                calibrations['0xB6'] = res;

                readInteger(0xB8, wire, address, function (err, res) {
                  calibrations['0xB8'] = res;

                  readInteger(0xBA, wire, address, function (err, res) {
                    calibrations['0xBA'] = res;

                    readInteger(0xBC, wire, address, function (err, res) {
                      calibrations['0xBC'] = res;

                      readInteger(0xBE, wire, address, function (err, res) {
                        calibrations['0xBE'] = res;

                        callback(null, calibrations);
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
}

exports.calibrate = calibrate;

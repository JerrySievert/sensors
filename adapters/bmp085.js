
var address = 0x77, wire;

var calibrations = { };

function readInteger(value, callback) {
  wire.write(address, [ value ], function (err) {
    if (err) {
      callback(err);
    } else {
      wire.read(address, 2, function (err, res) {
        if (err) {
          callback(err);
        } else {
          callback(null, res[0] << 8 | res[1]);
        }
      });
    }
  });
}

function calibrate(wire, callback)
{
  readInteger(0xAA, function (err, res) {
    calibrations['0xAA'] = res;

    readInteger(0xAC, function (err, res) {
      calibrations['0xAC'] = res;

      readInteger(0xAE, function (err, res) {
        calibrations['0xAE'] = res;

        readInteger(0xB0, function (err, res) {
          calibrations['0xB0'] = res;

          readInteger(0xB2, function (err, res) {
            calibrations['0xB2'] = res;

            readInteger(0xB4, function (err, res) {
              calibrations['0xB4'] = res;

              readInteger(0xB6, function (err, res) {
                calibrations['0xB6'] = res;

                readInteger(0xB8, function (err, res) {
                  calibrations['0xB8'] = res;

                  readInteger(0xBA, function (err, res) {
                    calibrations['0xBA'] = res;

                    readInteger(0xBC, function (err, res) {
                      calibrations['0xBC'] = res;

                      readInteger(0xBE, function (err, res) {
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

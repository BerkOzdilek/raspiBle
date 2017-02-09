/**
 * Created by berkozdilek on 10/06/16.
 */
var util 	= require('util');
var bleno 	= require('bleno');
var serialport = require('serialport');

var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
var BlenoCharacteristic = bleno.Characteristic;


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var serialPort = new SerialPort("/dev/ttyS0", {
    baudrate: 9600
    // ,parser: parsers.byteLength(35)
    // ,parser: parsers.readline('\n')
    ,autoOpen: false
    ,parser: parsers.byteDelimiter([255, 253, 187])
});

serialPort.on('error', function(error) {
    console.log("serial port on error "+ error);
});

serialPort.on('open', function(error) {
    if (!error)
        console.log("serial port opened successfuly");
    else
        console.log("serial can't open: "+ error);
});

serialPort.on('data', function(data) {
    console.log('data received ('+ data.length +'): '+ data);
    var hexString = ""
    for (var i = 0; i < data.length; i++){
        hexString += data[i].toString(16);
    }
    console.log('as hex: ' + hexString);
    if (_updateValueCallback)
        _updateValueCallback(new Buffer(hexString));
    else
        console.log('_updateValueCallback is null');
    });

  // serialPort.on('data', function(data) {
  //           console.log("data: "+  data);
  //       });


var EchoCharacteristic = function() {
    EchoCharacteristic.super_.call(this, {
        uuid: 'ec0e',
        properties: ['write', 'notify']
    });

 // this.updateValueCallback = null;
};

var _updateValueCallback = null;

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    console.log('EchoCharacteristic - onWriteRequest: value = ' + data);
    if (serialPort.isOpen()){
        // serialPort.write(new Buffer(data.toString('utf-8'), 'hex'));
        console.log('port is open');
    } else
        console.log('port is not open');

    callback(this.RESULT_SUCCESS);
};

EchoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('EchoCharacteristic - onSubscribe ');

    serialPort.open(function (err) {
        if (!err) {
            _updateValueCallback = updateValueCallback;
            console.log('callback set');
        } else {
            console.log('port cannot be opened');
        }
    })

    /** version 2 */
    // serialPort.on('data', function(data) {
    //     console.log('data received ('+ data.length +'): '+ data);
    //     var hexString = ""
    //     for (var i = 0; i < data.length; i++){
    //         hexString += data[i].toString(16);
    //     }
    //     console.log('as hex: ' + hexString);
    //     _updateValueCallback(new Buffer(hexString));
    //     });

    // serialPort.open(function (error) {
    //     console.log('opened serial comm', error);

    // serialPort.on('data', function(data) {
    //     console.log('data received: '+ data);
    //     _updateValueCallback(new Buffer(data));
    //     });

    // serialPort.on('error', function(error) {
    //         console.log("serial port on error ", error);
    //     });
    // });

// serialPort.open(function (error) {
//     console.log('open', error);;
    
//     serialPort.on('data', function(data) {
//       this.data = data.toString('hex');
//       if (this.data.charAt(0) == '2' && this.data.charAt(1) == '3') {
//         updateValueCallback(data);
//         console.log("Incoming DATA: ", this.data);
//       }

//       else{
//         console.log("ERROR");
//         process.exit(1);
//       }

//     });

//     serialPort.on('error', function(error) {
//       console.log(" error ", error)//, "heey", provider.data);
//     });
//   });
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
    console.log('EchoCharacteristic - onUnsubscribe');

     if (serialPort.isOpen()){
        serialPort.close(function(error) {
            console.log('serial port closed, '+error);
        })
     }

     _updateValueCallback = null;

    process.exit(2);
};

module.exports = EchoCharacteristic;

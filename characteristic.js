/**
 * Created by berkozdilek on 10/06/16.
 */
var util 	= require('util');
var bleno 	= require('bleno');
var serialport = require('serialport');

var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
var BlenoCharacteristic = bleno.Characteristic;


var serialPort = new SerialPort("/dev/ttyS0", {
    baudrate: 9600
    // ,parser: parsers.byteLength(35)
    // ,parser: parsers.readline('\n')
    ,autoOpen: false
    // ,parser: parsers.byteDelimiter([255, 253, 187])
    ,parser: parsers.byteLength(71)
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

    console.log('data received ('+ data.length +')');
    var hexString = data.toString('hex');
    var headerIndex = hexString.indexOf("23fffdbb");
    var dataBody = hexString.substr(headerIndex, 70);
    console.log('data to write: '+ dataBody);

    if (_updateValueCallback)
        _updateValueCallback(new Buffer(dataBody, 'hex'));
    else
        console.log('_updateValueCallback is null');
    });

var EchoCharacteristic = function() {
    EchoCharacteristic.super_.call(this, {
        uuid: 'ec0e',
        properties: ['write', 'notify']
    });
};
util.inherits(EchoCharacteristic, BlenoCharacteristic);

var _updateValueCallback = null;

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    console.log('EchoCharacteristic - onWriteRequest: value = ' + data);
    if (serialPort.isOpen()) {
        serialPort.write(new Buffer(data.toString('utf-8'), 'hex'), function (error) {
            if (!error)
                console.log('data written to serial port');
            else
                console.log('data cant written to serial port: '+ error);
        });
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
    });
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
    console.log('EchoCharacteristic - onUnsubscribe');

     if (serialPort.isOpen()){
        serialPort.close(function(error) {
            console.log('serial port closed, '+error);
        });
     }

     _updateValueCallback = null;

    process.exit(2);
};

module.exports = EchoCharacteristic;

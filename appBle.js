/**
 * Created by berkozdilek on 10/06/16.
 */
var bleno = require('bleno');
var EchoCharacteristic = require('./characteristic');

var BlenoPrimaryService = bleno.PrimaryService;

var currentEchoCharacteristic;

console.log('vestel - puzzle v2');

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        console.log('on');
        bleno.startAdvertising('echo', ['ec00']);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        if(!currentEchoCharacteristic) 
            currentEchoCharacteristic = new EchoCharacteristic();
        
        bleno.setServices([
            new BlenoPrimaryService({
                uuid: 'ec00',
                characteristics: [
                    currentEchoCharacteristic
                ]
            })
        ]);
    }
    else {
        console.log('[ERROR]advertisingStart: '+ error);
    }
});

bleno.on('advertisingStop', function(error) {
    console.log('on -> advertisingStop: ' + (error ? 'error ' + error : 'success'));
});

bleno.on('disconnect', function(clientAddress) {
  console.log("client disconnected -> " + clientAddress);
  currentEchoCharacteristic.closeSerial();

});

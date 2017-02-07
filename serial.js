var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
var endOfLine = require('os').EOL;

var serialPort = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600
    // ,parser: parsers.byteLength(35)
    // ,parser: parsers.readline('\n')
    ,parser: parsers.byteLength(71)
    // ,parser: serialport.parsers.readline(endOfLine)
    // ,autoOpen: false
    // ,parser: parsers.readline('16 77 66 35')
    // ,parser: parsers.byteDelimiter([255, 253, 187]) // ff fd bb
});


 serialPort.on('data', function(data) {
        // console.log('data: '+ data.length + ' ' + data);
        // var hexString = ""
        // for (var i = 0; i < data.length; i++){
        //     hexString += data[i].toString(16);
        // }
        // console.log(hexString);

      console.log(data);
      provider.data = data.toString('hex');
      console.log(provider.data);
      var str = data.toString('hex');
      var n = str.indexOf("23fffdbb");
      var dd = str.substr(n, 70);

      var bf = new Buffer(dd, 'hex');
      console.log(bf);
      // updateValueCallback();
        // var arr = data.toString().split(',');
        // console.log('arr: '+arr);
        // console.log('data.toString: '+ data.toString());

        // this.flush(function(error){
        //     console.log('flushed');
        // });
    });
    serialPort.on('error', function(error) {
        console.log("serial port on error ", error);
    });

// serialPort.open(function (error) {
//     console.log('opened serial comm', error);

   
// });

 // serialPort.on('open', function(error) {
 //        console.log("serial port opened ", error);
 //        // this.flush(function(error){
 //        //     console.log('flushed');
 //        // });
 //    });

/**
 * Created by goer on 4/30/15.
 */
angular.module('Audio', ['ngCordova', 'Socket', 'Data', 'CompanyModule','base64'])






.factory('SystemFileReader',function($q){

        var d;
        var fileName;

        function fail(err) {
            console.log('Error:'+err);
            d.reject(err)
        }

        function OnFileSystem(fileSystem) {
            fileSystem.root.getFile(fileName, null, OnGetFile, fail);
        }

        /**
         * Callback for geting the file for disk
         *
         * @method OnGetFile
         */
        function OnGetFile(fileEntry) {
            fileEntry.file(OnFileEntry, fail);
        }

        /**
         * Callback for file entry, this get the file.
         *
         * @method OnFileEntry
         */
        function OnFileEntry(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {

                var image = evt.target.result;
                d.resolve(image)

            };
            reader.readAsDataURL(file);
        }

    return {

        open : function(url){

            d=$q.defer()
            fileName=url;
            OnFileEntry(fileName);
            return d.promise;

        }



    }


})


/**
 * Record service
 * @module record
 * @author Claudio A. Marrero
 * @class famvoice
 */
    .factory('$record',
    function ($rootScope,
              Message) {

        var enumerator = 0;
        var recordName = 'temp.wav';
        var mediaRec = null;
        var OnCallback = null;
        var OnAppendData = {};

        /**
         * Start a record
         *
         * @method startRecord
         */
        function startRecord() {
            enumerator++;
            recordName = 'temp.wav';
            mediaRec = new Media(recordName,
                function () {
                },
                function (err) {
                });
            mediaRec.startRecord();
        }

        /**
         * Stop record
         *
         * @method stopRecord
         */
        function stopRecord() {
            mediaRec.stopRecord();
        }

        /**
         * Stop record
         *
         * @method stopRecord
         */
        function playRecord() {
            mediaRec.play();
        }

        /**
         * Get the name of the record
         *
         * @method getRecord
         */
        function getRecord() {
            return recordName;
        }

        /**
         * Save the recorded file to the server
         *
         * @method save
         */
        function save(callback, appendData) {
            OnCallback = callback;
            OnAppendData = appendData;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, OnFileSystem, fail);
        }

        /**
         * Callback for setting the file system to persistent.
         *
         * @method OnFileSystem
         */
        function OnFileSystem(fileSystem) {
            fileSystem.root.getFile(recordName, null, OnGetFile, fail);
        }

        /**
         * Callback for geting the file for disk
         *
         * @method OnGetFile
         */
        function OnGetFile(fileEntry) {
            fileEntry.file(OnFileEntry, fail);
        }

        /**
         * Callback for file entry, this get the file.
         *
         * @method OnFileEntry
         */
        function OnFileEntry(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {

                var image = evt.target.result;
                //console.log(image);
                var base64Data = image.replace(/^data:audio\/x-wav;base64,/, "");
                base64Data += base64Data.replace('+', ' ');

                //$socket.emit(
                //  'playlists:file',
                //  {file:base64Data,name:recordName,token: $account.token(), info:OnAppendData},
                //  OnCallback);

                OnCallback(base64Data);

                // Message.create({roomid: 'def1235a029da8a5', userid: '0d8a22ad48da8af5', content: base64Data, typeid: 2}).then(function(msg){

                //   console.log("Audio Message Saved: "+base64Data);
                //   console.log("msgid:"+msg.id);


                // });


            };
            reader.readAsDataURL(file);
        }

        /**
         * When any process of saving file fail, this console the error.
         *
         * @method OnFileEntry
         */
        function fail(err) {
            console.log('Error');
            console.log(err);
        }

        /**
         * Play record
         *
         * @method playRecord
         */
        function playRecord() {
            var mediaFile = new Media(recordName,
                function () {
                    console.log("playAudio():Audio Success");
                },
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                }
            );
            // Play audio
            mediaFile.play();
        }

        function playBase64(base64Data) {

            var snd = new Audio("data:audio/wav;base64," + base64string);
            snd.play();

        }

        return {
            start: startRecord,
            stop: stopRecord,
            play: playRecord,
            name: getRecord,
            save: save
        };
    })

    .factory('WebAudio',function($q,$base64,SystemFileReader){

                // variables
        var leftchannel = [];
        var rightchannel = [];
        var recorder = null;
        var recording = false;
        var recordingLength = 0;
        var volume = null;
        var audioInput = null;
        var sampleRate = null;
        var audioContext = null;
        var context = null;
        var outputElement = document.getElementById('output');
        var outputString;

        function interleave(leftChannel, rightChannel){
          var length = leftChannel.length + rightChannel.length;
          var result = new Float32Array(length);

          var inputIndex = 0;

          for (var index = 0; index < length; ){
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
          }
          return result;
        }

        function mergeBuffers(channelBuffer, recordingLength){
          var result = new Float32Array(recordingLength);
          var offset = 0;
          var lng = channelBuffer.length;
          for (var i = 0; i < lng; i++){
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
          }
          return result;
        }

        function writeUTFBytes(view, offset, string){ 
          var lng = string.length;
          for (var i = 0; i < lng; i++){
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        }

        function success(e){
            // creates the audio context
            audioContext = window.AudioContext || window.webkitAudioContext;
            context = new audioContext();

            // we query the context sample rate (varies depending on platforms)
            sampleRate = context.sampleRate;

            console.log('succcess');
            
            // creates a gain node
            volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            audioInput = context.createMediaStreamSource(e);

            // connect the stream to the gain node
            audioInput.connect(volume);

            /* From the spec: This value controls how frequently the audioprocess event is 
            dispatched and how many sample-frames need to be processed each call. 
            Lower values for buffer size will result in a lower (better) latency. 
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 2048;
            recorder = context.createScriptProcessor(bufferSize, 2, 2);

            recorder.onaudioprocess = function(e){
                if (!recording) return;
                var left = e.inputBuffer.getChannelData (0);
                var right = e.inputBuffer.getChannelData (1);
                // we clone the samples
                leftchannel.push (new Float32Array (left));
                rightchannel.push (new Float32Array (right));
                recordingLength += bufferSize;
                //console.log('recording');
            }

            // we connect the recorder
            volume.connect (recorder);
            recorder.connect (context.destination); 
        }


        function encodeWav(interleaved){


            // we create our wav file
            var buffer = new ArrayBuffer(44 + interleaved.length * 2);
            var view = new DataView(buffer);

            // RIFF chunk descriptor
            writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, 44 + interleaved.length * 2, true);
            writeUTFBytes(view, 8, 'WAVE');
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            // stereo (2 channels)
            //view.setUint16(22, 2, true);
            view.setUint16(22, 1, true);

            view.setUint32(24, sampleRate, true);

            //view.setUint32(28, sampleRate * 4, true);
            //mono
            view.setUint32(28, sampleRate * 2, true);

            //view.setUint16(32, 4, true);
            //mono
            view.setUint16(32, 2, true);

            view.setUint16(34, 16, true);
            // data sub-chunk
            writeUTFBytes(view, 36, 'data');
            view.setUint32(40, interleaved.length * 2, true);

            // write the PCM samples
            var lng = interleaved.length;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++){
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }

            // our final binary blob
            return new Blob ( [ view ], { type : 'audio/wav' } );

        }

        return {

            init : function(){

                // feature detection 
                if (!navigator.getUserMedia)
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                if (navigator.getUserMedia){
                    navigator.getUserMedia({audio:true}, success, function(e) {
                        console.error('Error capturing audio.');
                    });
                } else 
                    console.error('getUserMedia not supported in this browser.');

            },


            start : function(){

                recording = true;
                // reset the buffers for the new recording
                leftchannel.length = rightchannel.length = 0;
                recordingLength = 0;

                


            },

            stop : function(){

                    var d=$q.defer()

                    recording = false;
        
                    console.log('Building wav file...');

                    // we flat the left and right channels down
                    var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
                    //var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
                    // we interleave both channels together
                    // interleaved = interleave ( leftBuffer, rightBuffer );
                    
                    var blob = encodeWav(leftBuffer);
                    
                    // let's save it locally

                    console.log('Handing off the file now...');

                    console.log('blob:'+blob);
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        var image = evt.target.result;
                        //data:audio/wav;base64,
                        var d64 = image.replace(/^data:audio\/wav;base64,/, "");
                        //console.log('data audio:'+d64);
                        d.resolve(d64)
                    };
                    reader.readAsDataURL(blob);

                    // var url = (window.URL || window.webkitURL).createObjectURL(blob);
                    // console.log('url:'+url);
                    // d.resolve(url)

                    // SystemFileReader.open(url).then(function(data){
                    //     d.resolve($base64.encode(data))
                    // })

                    // var link = window.document.createElement('a');
                    // link.href = url;
                    // link.download = 'output.wav';
                    // var click = document.createEvent("Event");
                    // click.initEvent("click", true, true);
                    // link.dispatchEvent(click);

                    return d.promise;
            }


        }

    })


    .factory('AudioSvc', function ($record, ServerSvc, CRoomSvc, COwnerSvc, MessageAudio, Message, $socket, WebAudio) {

        function sendAudio(base64Data){
                    var amsg = {
                        roomid: CRoomSvc.getRoom().id,
                        userid: COwnerSvc.getOwner().id,
                        typeid: 2
                    };
                    
                    console.log("Sending sound base64 size:" + base64Data.length + ' msg:' + JSON.stringify(amsg));
                    amsg.content = base64Data;
                    MessageAudio.create(amsg).then(function (msg) {
                        console.log("Receive audio msg URL:" + JSON.stringify(msg));
                    });
                }

        return {

            playSound: function (soundid) {

                var url = ServerSvc.audioServer() + '/' + soundid;
                console.log("playRecord"+url);
                var snd = new Audio(url);
                snd.play();

            },

            startRecord: function () {
                console.log("startRecord");

                if( ionic.Platform.isAndroid() || ionic.Platform.isIOS() ){
                    $record.start();
                }else{
                    WebAudio.start();
                }

            },


            stopRecord: function () {

                console.log("stopRecord");
                if( ionic.Platform.isAndroid() || ionic.Platform.isIOS() ){
                    $record.stop();
                    $record.save(function (base64Data) {
                            sendAudio(base64Data)
                    });
                }else{
                    WebAudio.stop().then(function(base64Data){
                        sendAudio(base64Data);
                    })
                }


            }


        }

    })

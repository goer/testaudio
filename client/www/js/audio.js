/**
 * Created by goer on 4/30/15.
 */
angular.module('Audio',['ngCordova','Auth','ServerConfig','Socket','Data'])

/**
 * Record service
 * @module record
 * @author Claudio A. Marrero
 * @class famvoice
 */
    .factory('$record',
    function(
        $rootScope,
        Message
    ) {

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
        function startRecord(){
            enumerator++;
            recordName = 'temp.wav';
            mediaRec = new Media(recordName,
                function() {
                },
                function(err) {
                });
            mediaRec.startRecord();
        }

        /**
         * Stop record
         *
         * @method stopRecord
         */
        function stopRecord(){
            mediaRec.stopRecord();
        }

        /**
         * Stop record
         *
         * @method stopRecord
         */
        function playRecord(){
            mediaRec.play();
        }

        /**
         * Get the name of the record
         *
         * @method getRecord
         */
        function getRecord(){
            return recordName;
        }

        /**
         * Save the recorded file to the server
         *
         * @method save
         */
        function save(callback,appendData){
            OnCallback = callback;
            OnAppendData = appendData;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, OnFileSystem, fail);
        }

        /**
         * Callback for setting the file system to persistent.
         *
         * @method OnFileSystem
         */
        function OnFileSystem(fileSystem){
            fileSystem.root.getFile(recordName, null, OnGetFile, fail);
        }

        /**
         * Callback for geting the file for disk
         *
         * @method OnGetFile
         */
        function OnGetFile(fileEntry){
            fileEntry.file(OnFileEntry, fail);
        }

        /**
         * Callback for file entry, this get the file.
         *
         * @method OnFileEntry
         */
        function OnFileEntry(file){
            var reader = new FileReader();
            reader.onloadend = function(evt) {

                var image = evt.target.result;
                //console.log(image);
                var base64Data  =   image.replace(/^data:audio\/x-wav;base64,/, "");
                base64Data  +=  base64Data.replace('+', ' ');

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
        function fail(err){
            console.log('Error');
            console.log(err);
        }

        /**
         * Play record
         *
         * @method playRecord
         */
        function playRecord(){
            var mediaFile = new Media(recordName,
                function() {
                    console.log("playAudio():Audio Success");
                },
                function(err) {
                    console.log("playAudio():Audio Error: "+err);
                }
            );
            // Play audio
            mediaFile.play();
        }

        function  playBase64(base64Data){

            var snd = new Audio("data:audio/wav;base64," + base64string);
            snd.play();

        }

        return {
            start: startRecord,
            stop: stopRecord,
            play:playRecord,
            name:getRecord,
            save:save
        };
    })


    .controller('AudioCtrl', function(
        $socket,
        $scope,
        $cordovaCapture,
        $record,
        $cordovaMedia,
        Message,
        AuthSvc,
        ServerSvc
    ){


        $scope.googleLogin = AuthSvc.googleLogin;

        $socket.emit('ready',
            { roomid: 'def1235a029da8a5', userid: '0d8a22ad48da8af5' }
        )

        $socket.on('connected',function(data){
            $scope.status = data.status+":"+data.message;
        })



        $scope.startRecord = function(){
            console.log("startRecord");
            $record.start();


        }
        $scope.stopRecord = function () {

            console.log("stopRecord");
            $record.stop();
            //$scope.playRecord();
            $record.save(function (base64Data) {

                console.log("Sending sound base64");

                Message.create({
                    roomid: 'def1235a029da8a5',
                    userid: '0d8a22ad48da8af5',
                    content: base64Data,
                    typeid: 2
                }).then(function (msg) {

                    //console.log("Audio Message Saved: "+base64Data);
                    console.log("msgid:" + msg.id);
                    console.log("audioid:" + msg.content);
                    $scope.audioUrl = ServerSvc.baseUrl+'/audio/' + msg.content;

                    //$scope.playRecord();

                });
            });

        }

        $socket.on('audio',function(data){
            console.log("receive audioid:"+data.audioid);
            $scope.audioUrl = ServerSvc.baseUrl+'/audio/'+data.audioid;
            $scope.playRecord();
        })

        $scope.playRecord = function(){

            console.log("playRecord");

            var snd = new Audio($scope.audioUrl);
            snd.play();

        }


    })
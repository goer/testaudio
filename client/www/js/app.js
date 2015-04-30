// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','js-data','Auth'])

    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('ServerSvc',function(){

        return {

            baseUrl: 'http://192.168.35.145:7070'

        }

    })

.factory('$socket', function($rootScope,ServerSvc) {

  var socket = io.connect(ServerSvc.baseUrl);
  //var socket = io.connect('http://localhost:8080');

  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
})


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



.config(function (DSProvider) {
        DSProvider.defaults.basePath = 'http://192.168.35.145:7070'; // etc.
    })

.factory('Message', function (DS) {
        return DS.defineResource('message');
    })



.controller('AudioCtrl', function($socket,$scope,$cordovaCapture,$record,$cordovaMedia, Message, AuthSvc, ServerSvc){


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
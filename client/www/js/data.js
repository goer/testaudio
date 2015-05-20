/**
 * Created by goer on 4/30/15.
 */
angular.module('Data',['js-data','ServerConfig','dpd'])


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




    .config(function (DSProvider,ServerSvc) {
        DSProvider.defaults.basePath = ServerSvc.baseUrl(); // etc.
    })

    .factory('Room', function (DS) {
        return DS.defineResource('room');
    })
    .factory('User', function (DS) {
        return DS.defineResource('myuser');
    })
    .factory('DeviceToken', function (DS) {
        return DS.defineResource('devicetoken');
    })
    .factory('Company', function (DS) {
        return DS.defineResource('company');
    })
    .factory('Member', function (DS) {
        return DS.defineResource('member');
    })
    .factory('UserRelation', function (DS) {
        return DS.defineResource('userrelation');
    })
    .factory('Message', function (DS) {
        return DS.defineResource('message');
    })
    .factory('MessageAudio', function (DS,ServerSvc) {
        return DS.defineResource('api/audio/messageaudio');
    })
    .factory('RoomUser', function (DS) {
        return DS.defineResource({

                name: 'roomuser',
                relations: {
                    belongsTo: {
                        room: {
                            localKey: 'roomid',
                            localField: 'room'
                        }
                    }
                }

            }
        );
    })



    // Configuration:
    //.value('dpdConfig',['categories'])
    // or
    .factory('dpdConfig', function(ServerSvc){

        return {
            collections: ['message','myuser'],
            serverRoot: ServerSvc.baseUrl(), // optional, defaults to same server
            socketOptions: { reconnectionDelayMax: 3000 }, // optional socket io additional configuration
            useSocketIo: false, // optional, defaults to false
            noCache: false, // optional, defaults to false (false means that caching is enabled, true means it disabled)
        }

    } )


/**
 * Created by goer on 4/30/15.
 */
angular.module('Data',['js-data','ServerConfig'])


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
        DS.basePath = ServerSvc.audioMessage();
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


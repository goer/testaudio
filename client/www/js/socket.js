/**
 * Created by goer on 4/30/15.
 */
angular.module('Socket',['ServerConfig'])

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
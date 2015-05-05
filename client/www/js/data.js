/**
 * Created by goer on 4/30/15.
 */
angular.module('Data',['js-data'])


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

    .config(function (DSProvider) {
        DSProvider.defaults.basePath = 'http://192.168.35.145:7070'; // etc.
    })

    .factory('Message', function (DS) {
        return DS.defineResource('message');
    })


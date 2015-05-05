/**
 * Created by goer on 4/30/15.
 */
angular.module('ServerConfig',[])

    .factory('ServerSvc',function(){

        return {

            baseUrl: 'http://192.168.35.140:7070'

        }

    })
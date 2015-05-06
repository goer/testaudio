/**
 * Created by goer on 4/30/15.
 */
angular.module('ServerConfig',[])

    .constant('ServerSvc',{

        baseUrl : function () {
            return 'http://192.168.35.140:7070';
        }

    })
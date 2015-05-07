/**
 * Created by goer on 4/30/15.
 */
angular.module('ServerConfig',[])

    .constant('ServerSvc',{

        baseUrl : function () {
            return 'http://localhost:2403/';
        },

        socketIOUrl : function() {
            return 'http://localhost:7070/';
        }

    })
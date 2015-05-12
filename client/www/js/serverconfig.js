/**
 * Created by goer on 4/30/15.
 */
angular.module('ServerConfig',[])

    .constant('ServerSvc',{

        base : 'http://52.5.248.238:7070/',

        baseUrl : function () {
            return this.base;
        },

        socketIOUrl : function() {
            return this.base;
        },

        audioServer : function() {
            return this.base+'audio';
        },

        audioMessage : function() {
            return this.base;
        }

    })
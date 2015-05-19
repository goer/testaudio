/**
 * Created by goer on 5/7/15.
 */
angular.module('Login',['CompanyModule','Audio'])
    .controller('LoginCtrl',function($scope,COwnerSvc,$state,$socket,AudioSvc){

        $scope.data = {
            email: '',
            password: '',
        }

        $scope.login = function(){

            COwnerSvc.login($scope.data.email,$scope.data.password).then(function(owner){

            $socket.on('message',function(data){

                AudioSvc.onMessage(data);

            })    


                $state.go('main');

            });

        }

    });
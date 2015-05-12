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
                console.log('Receive Message:'+JSON.stringify(data))
                //if(parseInt(data.type)==2){
                    console.log('Audio Message')
                    AudioSvc.playSound(data.content);
                //}

            })    


                $state.go('main');

            });

        }

    });
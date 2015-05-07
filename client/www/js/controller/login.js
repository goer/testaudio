/**
 * Created by goer on 5/7/15.
 */
angular.module('Login',['Company'])
    .controller('LoginCtrl',function($scope,COwnerSvc,$state){

        $scope.login = function(){

            COwnerSvc.login($scope.username,$scope.password,function(owner){

                $state.go('main');

            });

        }

    });
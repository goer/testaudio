/**
 * Created by goer on 5/7/15.
 */
angular.module('Login',['CompanyModule'])
    .controller('LoginCtrl',function($scope,COwnerSvc,$state){

        $scope.login = function(){

            COwnerSvc.login('fonetix@gmail.com','goer1thea').then(function(owner){

                $state.go('main');

            });

        }

    });
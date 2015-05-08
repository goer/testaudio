/**
 * Created by goer on 5/8/15.
 */
angular.module('UserCtrlModule', ['CompanyModule'])

    .controller('UsersCtrl', function ($scope, $state, $stateParams, CompanySvc, CUserSvc) {

        $scope.data = {

            email : '',
            users : [],

        }

        CompanySvc.getUsers().then(function(users){
            $scope.data.users = users;
        })

        $scope.addUser = function(){

            CompanySvc.addUser($scope.data.email).then(function(user){
                console.log('Adding OK user:'+JSON.stringify(user));
                $state.go('users');
            })

        }

        $scope.goToUserDetail = function (user){

            CUserSvc.setUser(user);
            $state.go('userdetail');
        }

    })

    .controller('UserDetailCtrl', function ($scope, $state, $stateParams, CUserSvc) {

        $scope.data = {

            user : CUserSvc.getUser(),

        }

        $scope.updateUser = function(){

            CUserSvc.setUser($scope.data.user);
            CUserSvc.save().then(function(user){
                console.log('Updated user:'+JSON.stringify(user));
                $scope.data.user = user;
            })

        }

    })
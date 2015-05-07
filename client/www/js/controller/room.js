/**
 * Created by goer on 5/6/15.
 */
angular.module('RoomModule', ['CompanyModule'])

    .controller('RoomCtrl', function ($scope, $state, $stateParams, CRoomSvc) {

        $scope.data = {

            name: CRoomSvc.getRoom().name,
            members: [],

        }

        $scope.goToMembers = function () {
            $state.go('members');
        }


    })

    .controller('MembersCtrl', function ($scope, $state, $stateParams, CRoomSvc,CUserSvc) {

        $scope.data = {

            name: CRoomSvc.getRoom().name,
            members: [],

        }

        CRoomSvc.getMembers().then(function (members) {
            $scope.data.members = members;
            console.log('members size:' + members.length);
        })

        $scope.goToUserDetail = function(user){

            CUserSvc.setUser(user);
            $state.go('memberdetail');

        }

    })

    .controller('MemberDetailCtrl', function ($scope, $state, $stateParams, CUserSvc) {


        $scope.data = {
            user : CUserSvc.getUser(),
        }


    })

    .controller('AddMemberCtrl', function ($scope, $state, $stateParams, CompanySvc) {


        $scope.data = {
            users : [],
        }

        CompanySvc.getUsers().then(function(users){
            $scope.data.users = users;
        })

    })

;
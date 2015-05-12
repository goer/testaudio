/**
 * Created by goer on 5/6/15.
 */
angular.module('RoomModule', ['CompanyModule','Audio'])

    .controller('RoomCtrl', function ($scope, $state, $stateParams, CRoomSvc, AudioSvc) {

        $scope.data = {

            name: CRoomSvc.getRoom().name,
            members: [],

        }

        $scope.goToMembers = function () {
            $state.go('members');
        }

        $scope.startRecord = AudioSvc.startRecord;
        $scope.stopRecord = AudioSvc.stopRecord;


    })

    .controller('MembersCtrl', function ($scope, $state, $stateParams, CRoomSvc,CUserSvc) {

        $scope.data = {

            name: CRoomSvc.getRoom().name,
            members: [],

        }

        function listMembers() {
            CRoomSvc.getMembers().then(function (members) {
                $scope.data.members = members;
                console.log('members size:' + members.length);
            })
        }
        listMembers();

        $scope.goToUserDetail = function(user){

            CUserSvc.setUser(user);
            $state.go('memberdetail');

        }

        $scope.deleteMember = function(id){
            CRoomSvc.deleteMember(id).then(function(){
                listMembers();
            });
        }

    })

    .controller('MemberDetailCtrl', function ($scope, $state, $stateParams, CUserSvc) {


        $scope.data = {
            user : CUserSvc.getUser(),
        }


    })

    .controller('AddMemberCtrl', function ($q, $scope, $state, $stateParams, CRoomSvc, CompanySvc) {


        $scope.data = {
            users : [],
        }

        CRoomSvc.getMemberChoices().then(function(users){
            $scope.data.users = users;
        })

        function execAddMembers(){
            var d=$q.defer();
            angular.forEach($scope.data.users,function(v,k){
                if(v.selected) {
                    CRoomSvc.addMember(v).then(function(){
                        d.resolve(false)
                    })
                }
            })
            d.resolve(true);

            return d.promise;
        }

        $scope.addMembers = function(){

                execAddMembers().then(function(s){
                    if(s)
                        $state.go('members');
                })
        }



    })

;
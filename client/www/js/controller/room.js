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

        $scope.classButton = "button-positive"

        $scope.startRecord = function(){

            $scope.classButton = "button-negative"
            AudioSvc.startRecord();


        }
        $scope.stopRecord = function(){

            AudioSvc.stopRecord().then(function(msg){
                $scope.classButton = "button-positive"
            })
        }


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

    .controller('MemberDetailCtrl', function ($scope, $state, $stateParams, CUserSvc,CRoomSvc, COwnerSvc) {


        $scope.data = {
            user : CUserSvc.getUser(),
        }

        $scope.privateChat = function (userid){

            COwnerSvc.privateChat(userid).then(function(room){

                CRoomSvc.setRoom(room);
                $state.go('room');

            })


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

    .controller('MessagesCtrl', function(User,$rootScope,$scope,CRoomSvc,COwnerSvc,AudioSvc,$ionicScrollDelegate){

        $scope.data = {
            messages : [],
        }

        CRoomSvc.getMessages().then(function(msgs){
            //console.log('get messages: '+JSON.stringify(msgs))
            $scope.data.messages = msgs.data.slice().reverse();
            for(var i=0;i<$scope.data.messages.length;i++){
                $scope.data.messages[i].date = new Date($scope.data.messages[i].created)
            }
            $ionicScrollDelegate.scrollBottom(true);
        })


        var offNewMessage = $rootScope.$on('newmessage',function(event,data){

            if(CRoomSvc.getRoom().id!=data.roomid) return null;

            User.find(data.userid).then(function(user){
                data.user=user;
                $scope.data.messages.push(data);
                $ionicScrollDelegate.scrollBottom(true);
            })

        })

        $scope.isOwnerMessage = function(msg){
            return (msg.userid==COwnerSvc.getOwner().id)
        }

        $scope.playMessageContent = function(m){
            AudioSvc.playSound(m.content);
        }

        $scope.$on("$destroy", function(){
            //de register listener
            offNewMessage();
        });

    })


;
/**
 * Created by goer on 5/6/15.
 */
angular.module('Main',['CompanyModule', 'Audio'])
    .controller('MainCtrl',function($scope,$state,COwnerSvc,CRoomSvc,$socket,AudioSvc){

        $scope.data = {
            rooms : []
            };

        COwnerSvc.getRooms().then(function(rooms){

            $scope.data.rooms = rooms;


                angular.forEach(rooms,function(v,k){
                    $socket.emit('join',{ roomid: v.roomid, userid: COwnerSvc.getOwner().id })
                })




        })

        $scope.goToRoom = function(room){
            CRoomSvc.setRoom(room);
            $state.go('room');
        }



    });
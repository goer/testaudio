/**
 * Created by goer on 5/6/15.
 */
angular.module('Main',['CompanyModule'])
    .controller('MainCtrl',function($scope,$state,COwnerSvc,CRoomSvc){

        $scope.data = {
            rooms : []
            };

        COwnerSvc.getRooms().then(function(rooms){
            $scope.data.rooms = rooms;
        })

        $scope.goToRoom = function(room){
            CRoomSvc.setRoom(room);
            $state.go('room');
        }

    });
/**
 * Created by goer on 5/6/15.
 */
angular.module('RoomsModule',['CompanyModule'])
.controller('RoomsCtrl',function($scope,$state,COwnerSvc){

        $scope.data = {
            roomname : 'RoomName'+Date.now().toString()
            };

        $scope.addRoom = function(){

            COwnerSvc.addRoom($scope.data.roomname).then(function(member){
                COwnerSvc.getRooms().then(function(rooms){
                    $state.go('main');
                })
            })
        }

    });
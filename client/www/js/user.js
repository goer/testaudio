/**
 * Created by goer on 5/5/15.
 */

angular.module('User', ['ServerConfig','js-data'])

    .config(function (DSProvider,ServerSvc) {
        DSProvider.defaults.basePath = ServerSvc.baseUrl(); // etc.
    })

    .factory('Room', function (DS) {
        return DS.defineResource('room');
    })
    .factory('User', function (DS) {
        return DS.defineResource('myuser');
    })
    .factory('UserRelation', function (DS) {
        return DS.defineResource('userrelation');
    })
    .factory('Message', function (DS) {
        return DS.defineResource('message');
    })
    .factory('RoomUser', function (DS) {
        return DS.defineResource({

                name: 'roomuser',
                relations: {
                    belongsTo: {
                        room: {
                            localKey: 'roomid',
                            localField: 'room'
                        }
                    }
                }

            }
        );
    })


    .factory('FriendSvc', function (UserRelation, User) {

        var ownerId;

        var setOwnerId = function (oid) {
            ownerId = oid;
        }


        var selectedFriends = [];

        var setSelectedFriends = function (sf) {
            selectedFriends = sf;
        }


        var getFriends = function (f) {

            UserRelation.findAll({ownerid: ownerId}, {bypassCache: true}).then(f);

        }

        var isUserExist = function (uid, fo, fe) {

            User.find(uid).then(fo).catch(fe);

        }

        var isFriend = function (uid, fo, fe) {

            UserRelation.findAll({ownerid: ownerId, userid: uid}).then(function (usrs) {
                if (usrs.length > 0)
                    fo(usrs)
                else
                    fe(usrs);

            }).catch(fe);

        }

        var addFriend = function (userid, f) {

            UserRelation.create({
                ownerid: ownerId,
                userid: userid
            }).then(f);

        }

        return {
            setOwnerId: setOwnerId,
            getFriends: getFriends,
            addFriend: addFriend,
            isFriend: isFriend,
            isUserExist: isUserExist,
            setSelectedFriends: setSelectedFriends,
            selectedFriends: selectedFriends,
        }
    })


    .factory('RoomDetailSvc', function ($q, Room, Message, RoomUser) {

        var roomId;
        var room;

        var setRoomId = function (rid, f) {
            roomId = rid;
            Room.find(roomId).then(function (r) {
                room = r;
                f(r);
            })
        }

        var getRoom = function () {
            return room;
        }

        var addMessage = function (uid, content, type, f) {
            Message.create(
                {
                    roomid: roomId,
                    content: content,
                    userid: uid
                }
            ).then(f);

        }

        var getMessages = function (f) {
            Message.findAll({roomid: roomId}, {bypassCache: true}).then(f);
        }

        var deleteMessage = function (mid, f) {
            Message.destroy(mid).then(f);
        }


        var selectedFriends = [];

        var setSelectedFriends = function (sf, f) {
            selectedFriends = sf;
            var defer = $q.defer();

            angular.forEach(selectedFriends, function (f) {
                addMember(f.userid).then(function () {
                    defer.resolve();
                });
            });

            return defer.promise;
        }

        var getMembers = function (f) {
            RoomUser.findAll({roomid: roomId}, {bypassCache: true}).then(f);
        }

        var isMember = function (uid, fo, fe) {
            RoomUser.findAll({roomid: roomId, userid: uid}, {bypassCache: true}).then(function (rus) {
                console.log("rus:" + rus.length);
                if (rus.length > 0) {
                    fo(rus);
                } else {
                    fe(rus);
                }
            }).catch(function (err) {
                fe(err);
            });
        }

        var addMember = function (uid) {
            return RoomUser.create({roomid: roomId, userid: uid});
        }

        var deleteMember = function (ruid, f) {
            RoomUser.destroy(ruid).then(f);
        }

        return {

            setRoomId: setRoomId,
            getRoom: getRoom,
            addMessage: addMessage,
            getMessages: getMessages,
            deleteMessage: deleteMessage,
            getMembers: getMembers,
            addMember: addMember,
            isMember: isMember,
            deleteMember: deleteMember,
            setSelectedFriends: setSelectedFriends,

        }

    })

    .factory('RoomSvc', function (RoomUser, Room, Message, FriendSvc, OwnerSvc) {

        var ownerId;


        var initOwner = function () {

            OwnerSvc.getOwner(function (o) {
                ownerId = o;
            })

        }

        var setOwnerId = function (oid) {
            if (oid) {
                ownerId = oid;
                FriendSvc.setOwnerId(oid);
                return;
            }
            initOwner();
            return;
        }

        var getRooms = function (f) {
            Room.findAll({userid: ownerId}, {bypassCache: true}).then(f);
        }

        var addRoom = function (roomName, f) {

            Room.create({
                name: roomName,
                userid: ownerId
            }).then(function (r) {
                getRooms(f);
            });

        }

        var deleteRoom = function (roomId, f) {
            Room.destroy(roomId).then(function (r) {
                RoomUser.destroyAll({roomid: r.id});
                Message.destroyAll({roomid: r.id});
            });
        }


        return {

            setOwnerId: setOwnerId,
            getRooms: getRooms,
            addRoom: addRoom,
            deleteRoom: deleteRoom,

        }


    })

    .factory('OwnerSvc', function (User) {

        var owner = null;


        var load = function () {
            owner = $localstorage.getObject('owner');
        }

        var save = function () {
            $localstorage.setObject('owner',owner);
        }

        var login = function (userName, password,cb,ob) {

            console.log('try login: '+userName)

            owner = {
                id : 1,
                username : 'goer',
                email: 'fonetix@gmail.com'
            }

            cb(owner);

            return owner;

            return User.findAll(
                {
                    username: 'goer',
                    //password: password
                }
            ).then(function (usr) {
                owner = usr;
            })

        }

        var signup = function (userName, password, optional,cb,ob) {

            return User.create(
                {
                    username: userName,
                    password: password

                },function(usr){

                    owner = usr;
            })

        }

        var getOwner = function (f) {

            if (owner != null) {
                f(owner);
                return;
            }

            login('', '').then(function (o) {
                f(o);
            })

        }

        var isLogin = function () {
            if (owner != null) {
                console.log('Login')
                return true;
            }
            console.log('Not Login');
            return false;
        }

        var logout = function () {


        }

        return {

            owner: owner,
            login: login,
            logout: logout,
            isLogin: isLogin,
            getOwner: getOwner,
            signup: signup,
            load: load,
            save: save,
        }

    })
/**
 * Created by goer on 5/7/15.
 */
angular.module('Company',['Data'])

.factory('CompanySvc',function(User){

        var company=null;

        return {

            setCompanyByOwner : function(owner,cb){

                Company.find(owner.companyid).then(function(c){
                    company=c;
                    cb(company);
                })

            },

            getUsers : function(){

                return User.findall({companyid: company.id}, {bypassCache: true});

            },

            addUser : function(email){

                return User.create({ companyid: company.id, email: email, statusid: 1 });

            }



        }


    })


    .factory('COwnerSvc',function(User,CompanySvc,Room,Member){

        var owner = null;

        return {

            login : function(email,password,cb){
                User.findAll({email:email, password:password}, {bypassCache: true},function(users){
                    owner = users[0];
                    CompanySvc.setCompanyByOwner(owner);
                    cb(owner);
                })
            },

            getOwner : function(){
                return owner;
            },

            getRooms : function(){

                return Member.findAll(
                    {userid: owner.id},
                    {bypassCache: true}
                );


            },

            addRoom : function(name) {

                return Room.create({name: name, userid: owner.id});

            },

            deleteRoom : function(id) {

                return Room.destroy(id);

            }

        }


    })

.factory('CRoomSvc',function(Room,Message,Member){

        var room=null;

        return {


            setRoom : function(r){

                room = r

            },

            getMessages : function(){

               return  Message.findAll({roomid: room.id  }, {bypassCache: true});

            },


            sendMessage : function(owner,message){

                message.userid = owner.id;
                return Message.create(message);

            },

            getMembers : function(){

                return Member.findAll({roomid: room.id}, {bypassCache: true});

            },

            addMember : function(user){

                var member = {
                    roomid : room.id,
                    userid : user.id,
                }
                return Member.create(member);

            }




        }


    })
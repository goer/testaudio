/**
 * Created by goer on 5/7/15.
 */
angular.module('CompanyModule',['Data'])

.factory('CompanySvc',function(User,Company){

        var company=null;

        return {

            setCompanyByOwner : function(owner,cb){

                Company.find(owner.companyid).then(function(c){
                    company=c;
                    if(angular.isDefined(cb)) cb(company);
                })

            },

            getUsers : function(){

                return User.findAll({companyid: company.id}, {bypassCache: true});

            },

            addUser : function(email){

                return User.create({ companyid: company.id, email: email, statusid: 1 });

            }



        }


    })


    .factory('COwnerSvc',function($q,User,CompanySvc,Room,Member){

        var owner = null;

        return {

            login : function(email,password){
                var d = $q.defer();

                console.log('Login email:'+email+' password:'+password);
                User.findAll({email:email}, {bypassCache: true}).then(function(users){
                    if(users.length>0) {
                        owner = users[0];
                        CompanySvc.setCompanyByOwner(owner);
                        console.log('Login OK:' + JSON.stringify(owner));
                        d.resolve(owner);
                    }else{
                        d.reject("Login Err: user not found")
                        console.log("Login Err: user not found")
                    }
                }).catch(function(err){
                    d.reject(err);
                    console.log("Login Err:"+err)
                })
                return d.promise;
            },

            getOwner : function(){
                if(owner==null){
                    return this.login('fonetix@gmail.com','goer1thea');
                }
                var d=$q.defer();
                d.resolve(owner);
                return d.promise;
            },

            getRooms : function(){

                var d = $q.defer();

                if(owner==null){


                    this.getOwner().then(function(owner){
                        d.resolve(Member.findAll(
                            {userid: owner.id},
                            {bypassCache: true}
                        ));
                    })

                }else {

                    d.resolve(Member.findAll(
                        {userid: owner.id},
                        {bypassCache: true}
                    ));

                }

                return d.promise;


            },

            addRoom : function(name) {
                console.log('Adding room:'+ name);
                var d=$q.defer();
                Room.create({name: name, userid: owner.id}).then(function(room){
                    d.resolve(Member.create({roomid:room.id,userid: owner.id}));
                })
                return d.promise;
            },

            deleteRoom : function(id) {

                return Room.destroy(id);

            }

        }


    })

.factory('CRoomSvc',function(Room,Message,Member){

        var room=null;

        return {

            getRoom : function(){
                console.log('Reading Room:'+room.id);
                return room;
            },

            setRoom : function(r){
                console.log('Setting Room:'+ r.id);
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


    .factory('CUserSvc',function(){

        var user=null;

        return {

            getUser : function(){
                return user;
            },
            setUser : function(u){
                user=u;
            },



        }

    })
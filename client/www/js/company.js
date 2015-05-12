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


    .factory('COwnerSvc',function($q,User,CompanySvc,Room,Member,DeviceToken){

        var owner = null;
        var deviceToken = null;

        function updateTokenOwner(){
            DeviceToken.findAll({token: deviceToken}).then(function(dts){
                if(dts.length>0){
                    console.log('device exist: '+deviceToken);
                    DeviceToken.update(dts[0].id, { userid: owner.id }).then(function(r){
                         console.log('updating DeviceToken ok :'+JSON.stringify(r))
                    })
                }else{
                    console.log('found new device: '+deviceToken);
                    DeviceToken.create({ token: deviceToken.token , devicetype: deviceToken.devicetype, userid: owner.id}).then(function(r){
                        console.log('creating DeviceToken ok :'+JSON.stringify(r))
                    })            

                }
            })    
        }


        return {

            setDeviceToken : function(dt){
                deviceToken = dt;
            },

            owner : owner,

            login : function(email,password){
                var d = $q.defer();

                if(email=='') email='fonetix@gmail.com';
                console.log('Login email:'+email+' password:'+password);
                User.findAll({email:email}, {bypassCache: true}).then(function(users){
                    if(users.length>0) {
                        owner = users[0];
                        CompanySvc.setCompanyByOwner(owner);
                        updateTokenOwner();
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
                return owner;
            },

            getRooms : function(){

                var d = $q.defer();

                if(owner==null){



                        d.resolve(Member.findAll(
                            {userid: this.getOwner().id},
                            {bypassCache: true}
                        ));


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

.factory('CRoomSvc',function($q,Room,Message,Member,CompanySvc){

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

            deleteMember : function(id){
                return Member.destroy(id);
            },

            getMembers : function(){

                return Member.findAll({roomid: room.id}, {bypassCache: true});

            },

            getMemberChoices : function(){

                var kchoices = []
                var kmembers = []
                var d = $q.defer()

                this.getMembers().then(function(members){

                    //angular.forEach(members,function(v,k){
                    //    kmembers.push(v.userid)
                    //})
                    kmembers= _.map(members,function(m){ return m.userid; })

                    console.log('members:'+JSON.stringify(kmembers));

                    CompanySvc.getUsers().then(function(users){

                        angular.forEach(users,function(v,k){


                            if(!_.contains(kmembers,v.id)) {
                                console.log('Selected:'+ v.id);
                                v.selected=false;
                                kchoices.push(v);
                            }

                        })

                        d.resolve(kchoices);

                    })
                })

                return d.promise;

            },

            addMember : function(user){

                var member = {
                    roomid : room.id,
                    userid : user.id,
                };
                return Member.create(member);

            }




        }


    })


    .factory('CUserSvc',function(User){

        var user=null;

        return {

            getUser : function(){
                return user;
            },
            setUser : function(u){
                user=u;
            },
            save : function(){
                return User.update(user)
            }


        }

    })
dpd.room.get({id: this.roomid},function(room){
    this.room = room;
})

dpd.myuser.get({id: this.userid},function(user){
    this.user = user;
})
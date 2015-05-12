dpd.message.get({roomid: this.id},function(messages){
    this.messages = messages;
})

dpd.myuser.get({id: this.userid},function(user){
    this.user = user;
    this.owner = user;
})
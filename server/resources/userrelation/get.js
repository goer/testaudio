dpd.myuser.get({id : this.ownerid },function(owner){
    this.owner = owner;
});

dpd.myuser.get({id : this.userid },function(user){
    this.user = user;
});

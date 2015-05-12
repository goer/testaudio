dpd.users.get({username : this.username}, function(user){
    cancel("Duplicate user name",401);
})
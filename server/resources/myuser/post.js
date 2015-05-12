dpd.myuser.get({email: this.email},function(users){
    if(users.length>0)
        cancel('Failed, username exist');
})
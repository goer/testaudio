
var _ = require('underscore');
var baseUrl = 'http://52.5.248.238:7070';

var dpd = require('dpd-js-sdk')(baseUrl, '/' );
dpd.message = dpd("/message")
dpd.member = dpd('/member')

var Q = require('q');
var uuid = require('uuid');
var fs=require('fs');
var child_process= require('child_process');
var gcm = require('node-gcm');


exports.saveAudioData = function(data,cb){

	var buf = new Buffer(data, 'base64');
	var fin = '/tmp/'+uuid.v4()+'.wav';
	var fout = uuid.v4()+'.mp3';
	var input = fs.createWriteStream(fin);
	input.write(buf);
	input.end();
	var ffmpeg = child_process.spawn('ffmpeg', [ '-v', 'debug', '-i', fin, '-f', 'mp3', '-y', 'public/audio/'+fout]);
	ffmpeg.stderr.on('close', function() {
	    console.log('Saving OK: '+fout);
	    fs.unlink(fin);
	    cb(fout);
	});
	return fout;
}

exports.saveVoiceMessage = function(msg){

// Message.create({
//                             roomid: CRoomSvc.getRoom().id,
//                             userid: COwnerSvc.getOwner().id,
//                             content: msg.content,
//                             typeid: 2

//                         }).then(function (m) {

//                             //console.log("sending message:" + m);
//                             //$socket.emit('message', m);


//                         })
		var d=Q.defer();
		dpd.message.post({

            roomid: msg.roomid,
            userid: msg.userid,
            content: msg.content,
            typeid: 2

		},function(m){
			d.resolve(m);
		})

		return d.promise;

}


function pushToDeviceAndroid(deviceToken,data){
	console.log('Start pushToDeviceAndroid')
	var d=Q.defer();
	
	var message = new gcm.Message({
	    collapseKey: 'pttserver',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        message: data,
	    }
	});
	var registrationIds = [];
	registrationIds.push(deviceToken.token);
	var sender = new gcm.Sender('AIzaSyD2AQDi6a0TPX-kGnbyFbj4VF3WrmwVpj8');
	console.log('GCM Sender: msg:'+JSON.stringify(message)+' regids:'+registrationIds);
	sender.send(message, registrationIds, 10, function (err, result) {
	  	if(err){
	  		console.error(err);
	  		d.reject(err);
	  	}
	  	else{
	  		console.log(result);
	  		d.resolve(result);
	  	}
	});
	return d.promise;
}

exports.pushMessage = function(data){
	var d=Q.defer()
	dpd.member.get({roomid: data.roomid },function(members){
		_.each(members,function(member){
			console.log('member:'+member.id);
			console.log('devicetokens'+JSON.stringify(member.user.devicetokens))
			_.each(member.user.devicetokens,function(dt){
				console.log('dt:'+ JSON.stringify(dt));
				if(dt.devicetype==='android'){
					//do push for android
					console.log('push to token:'+dt.token);
					d.resolve(pushToDeviceAndroid(dt,data))
				}
			})
		})
	})
	return d.promise;
}

//this.pushMessage({ roomid: '47c55ab57dcaa8d6', content: 'this is message content'})

// var JSData = require('js-data');
// var DSHttpAdapter = require('js-data-http');

// var adapter = new DSHttpAdapter();
// adapter.defaults.basePath = 'http://192.168.35.126:2403/';


// var chat = new JSData.DS();
// chat.registerAdapter(
// 	'http', 
// 	adapter, 
// 		{ 	default: true,
// 		}
// 	);
// var Message = chat.defineResource('message');
// Message.findAll({ roomid: "123" }).then(function(ms){
// 	array.forEach(ms,function(v,k){
// 		console.log("m:"+v.id);
// 	});
// })


// var Restangular=require('node-restangular');

// Restangular.setBaseUrl('http://192.168.35.126:2403/');
// Restangular.all('message').getList().then(function(msgs){
// 	console.log("msgs:"+msgs);
// })


// var unirest = require('unirest');
// var _ = require('underscore');
// unirest.get('http://192.168.35.126:2403/message').end(function(response){
// 		console.log("status:"+response.status);
// 		if(response.status===200){
// 			res.status=200;
// 			res.body=response.body;
// 			// _.each(response.body,function(v, k){
// 			// 	console.log("message:"+v.id);
// 			// });
// 		}
// 	});

// express = require('express');
// app = require('express.io')();
// app.http().io();
// var fs=require('fs');
// var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();


var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require("socket.io").listen(server);

function saveAudioData(data,cb){

	var buf = new Buffer(data, 'base64'); 
	var uuid = require('uuid');
	var fin = '/tmp/'+uuid.v4()+'.wav';
	var fout = uuid.v4()+'.mp3';
	var fs=require('fs');
	var input = fs.createWriteStream(fin);
	input.write(buf);
	input.end();
	var child_process= require('child_process');
	var ffmpeg = child_process.spawn('ffmpeg', [ '-v', 'debug', '-i', fin, '-f', 'mp3', '-y', 'public/audio/'+fout]);
	ffmpeg.stderr.on('close', function() {
	    console.log('...closing time! bye');
	    fs.unlink(fin);
	    cb();
	});
	return fout;

}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 7070);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0");
app.use(express.static(__dirname + '/public'));	

app.use(express.bodyParser());
app.use(express.methodOverride());

// app.use(function (req, res, next) {
// 		res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "X-Requested-With");
//         res.header("Access-Control-Allow-Headers", "Content-Type");
//         res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//         next();
//     }
// );



io.sockets.on('connection', function(s) {

	console.dir("New User");
	s.emit('connected',{status:200,message: 'connected'})

	s.on('join',function(data){
		console.log('user:'+data.userid+' join room:'+data.roomid);
		s.socket.join(data.roomid);
	})

	s.on('leave',function(data){
		console.log('user:'+data.userid+' join room:'+data.roomid);
		s.socket.leave(data.roomid);
	})

	s.on('leave',function(data){
		console.log('user:'+data.userid+' join room:'+data.roomid);
		io.sockets.in(data.roomid).emit('message', data);
	})


})

app.post('/message/:roomId', function(req, res) {

	if (!req.body) return res.sendStatus(400);
	var data = req.body;
	fo = saveAudioData(data.content,function(){
		io.sockets.in(data.roomid).emit('message',{ content: fo,  typeid: 4, userid: data.userid });
	});	
	res.json({ statusid: 200 });

});




server.listen(app.get('port'), app.get('ipaddr'), function(){
    console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});


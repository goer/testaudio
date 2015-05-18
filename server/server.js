var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require("socket.io").listen(server)
	, util = require('util')
	, bodyParser = require('body-parser')
	, cfg = require('./config.js')
	, config = cfg.getConfig()
	, logic = require('./logic.js')
	;


var ENV = 'development';

app.set('port', config.server.port);
app.set('ipaddr', config.server.ip);
app.use(express.static(__dirname + '/public'));	


app.use('/api/audio',bodyParser.json());
app.get('/api/audio/test', function(req, res) {
	console.log('Receive Audio Message:')
	res.json({statusid:200, content:'cool !'});
});


app.post('/api/audio/messageaudio', function(req, res) {

	console.log('Receive Audio Message:')
	var uuid = require('uuid');
	var data = req.body;
	var m={ id:uuid.v4(), statusid:200, roomid: data.roomid,   typeid: 2, userid: data.userid }
	logic.saveAudioData(data.content,function(fo){
		m.content= fo
		logic.saveVoiceMessage(m);
		io.sockets.in(data.roomid).emit('message',m);
		// logic.pushMessage(m).then(function(r){
		// 	console.log('Audio OK:'+JSON.stringify(r))
		// }).catch(function(err){
		// 	console.log('Audio Send Failed:'+err);
		// });
		res.json(m);
	});

});


// setup deployd
//MongoDB 2.4 database added.  Please make note of these credentials:
//
//	Root User:     admin
//Root Password: hTUSfXHY-Fbq
//Database Name: audioserver
//
//Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
//URL:        http://audioserver-fonetix.rhcloud.com/
//SSH to:     554c9bf94382ec6feb00001f@audioserver-fonetix.rhcloud.com
//Git remote: ssh://554c9bf94382ec6feb00001f@audioserver-fonetix.rhcloud.com/~/git/audioserver.git/
//Cloned to:  /Users/goer/projects/testaudio/server/audioserver


require('deployd').attach(server, {
	socketIo: io,  // if not provided, attach will create one for you.
	env: ENV,
	db: config.db
	
});
// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest);


// app.use(function (req, res, next) {
// 		res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "X-Requested-With");
//         res.header("Access-Control-Allow-Headers", "Content-Type");
//         res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//         next();
//     }
// );


io.on('connection', function(s) {

	console.dir("New User");
	s.emit('connected',{status:200,message: 'connected'})

	s.on('join',function(data){
		console.log('Join user:'+data.userid+' join room:'+data.roomid);
		s.join(data.roomid);
	})

	s.on('leave',function(data){
		console.log('Leave user:'+data.userid+' join room:'+data.roomid);
		s.leave(data.roomid);
	})

	s.on('message',function(data){
		console.log('Message user:'+data.userid+'  room:'+data.roomid+' content:'+data.content);
		s.broadcast.to(data.roomid).emit('message', data);
	})


})


server.listen(app.get('port'), app.get('ipaddr'), function(){
    console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});


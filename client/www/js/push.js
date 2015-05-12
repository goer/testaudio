angular.module('PushModule',['CompanyModule','Audio'])

.factory('PushSvc', function($rootScope,$cordovaPush,COwnerSvc,AudioSvc){

	return {

		android : function () {


					var androidConfig = {
				    	"senderID": "AIzaSyD2AQDi6a0TPX-kGnbyFbj4VF3WrmwVpj8",
				  	};

				    $cordovaPush.register(androidConfig).then(function(result) {
				      // Success
				      console.log("try Register ok")
				    }, function(err) {
				      // Error
				      console.log("try Register error")
				    })

				    $rootScope.$on(
				    	'$cordovaPush:notificationReceived', 
				    	function(event, notification) {

				      switch(notification.event) {
				        case 'registered':
				          if (notification.regid.length > 0 ) {

				            console.log('registration ID = ' + notification.regid);
				            COwnerSvc.setDeviceToken({ token: notification.regid, devicetype: 'android'});

				          }
				          break;

				        case 'message':
				          // this is the actual push notification. its format depends on the data model from the push server
				          console.log('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
				          console.log('Audio Message')
                    	  var data=JSON.parse(notification.message);
                    	  AudioSvc.playSound(data.content);
				          
				          break;

				        case 'error':
				          console.error('GCM error = ' + notification.msg);
				          break;

				        default:
				          console.error('An unknown GCM event has occurred');
				          break;
				      }
				    });


				    // WARNING: dangerous to unregister (results in loss of tokenID)
				    //$cordovaPush.unregister(options).then(function(result) {
				      // Success!
				    //}, function(err) {
				      // Error
				    //})



		}


	}


})
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter',
    [
        'ionic',
        'ngCordova',
        'Auth',
        'Audio',
        'Router',
        'User',
        'Main',
        'Login',
        'PushModule',
        'ui.gravatar'
    ]
)

    .config([
        'gravatarServiceProvider', function(gravatarServiceProvider) {
            gravatarServiceProvider.defaults = {
                size     : 50,
                "default": 'mm'  // Mystery man as default for missing avatars
            };

            // Use https endpoint
            gravatarServiceProvider.secure = false;

            // Force protocol
            gravatarServiceProvider.protocol = 'http';
        }
    ])

    .run(function ($ionicPlatform, $rootScope,  $state, OwnerSvc, PushSvc, $socket,AudioSvc,WebAudio) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

                console.log("Check Login");

            //    var requireLogin = toState.data.requireLogin;
            //
            //    if (requireLogin) {
            //        event.preventDefault();
            //        // get me a login modal!
            //        if(!OwnerSvc.isLogin()){
            //            console.log("must log in first");
            //            $state.go('login');
            //        }
            //    }else{
            //        console.log("Free")
            //    }

            });

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            PushSvc.android();
            cordova.plugins.backgroundMode.setDefaults({
                text: 'Doing heavy tasks.'
            });
            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.onactivate = function() {

                $socket.on('message', function(data) {

                    cordova.plugins.backgroundMode.configure({
                        text: 'Receive Message from:' + data.userid + ' mp3:' + data.content
                    });

                    AudioSvc.onMessage(data);

                })

            }


        } else {
            WebAudio.init();
        }




            

                // setTimeout(function () {
                //     // Modify the currently displayed notification
                //     cordova.plugins.backgroundMode.configure({
                //         text:'Running in background for more than 5s now.'
                //     });
                // }, 5000)


           


        });
    })















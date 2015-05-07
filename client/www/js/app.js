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
        'Main'
    ]
)



    .run(function ($ionicPlatform, $rootScope,  $state, OwnerSvc) {
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


        });
    })















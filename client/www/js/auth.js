/**
 * Created by goer on 4/28/15.
 */
angular.module('Auth',['User','Data','ionic', 'ngCordova',  'satellizer',  ])


    // Configure Satellizer.
    .config(function($authProvider) {

        // Configuration common for all providers.
        var commonConfig = {
            // Popup should expand to full screen with no location bar/toolbar.
            popupOptions: {
                location: 'no',
                toolbar: 'no',
                width: window.screen.width,
                height: window.screen.height
            }
        };

        //$authProvider.tokenName = 'access_token';

        // Change the platform and redirectUri only if we're on mobile
        // so that development on browser can still work.
        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            $authProvider.platform   = 'mobile';
            commonConfig.redirectUri = 'http://localhost/callback';
        }

        // Configure Facebook login.
        $authProvider.facebook(angular.extend({}, commonConfig, {
            clientId: '657854390977827',
            url: 'http://localhost'
        }));

        // Configure Google login.
        $authProvider.google(angular.extend({}, commonConfig, {
            clientId: '169622791103-pr7n4oofbdemokc79ooolv2j3elnht0j.apps.googleusercontent.com',
            //url : '',
            redirectUri : 'http://localhost/callback'
        }));
    })

    .factory("AuthSvc", function ($cordovaOauth,$http,$localstorage, User) {


        var user = {
            data : {
                statusid : 0,
                islogin : false,
                email: '',
                firstname : '',
                lastname : '',
                picture: '',
                gender: 'm'
            },
            providers : {
                google : {
                    access_token : '',
                    gmailLogin : '',
                    gmailID : '',
                    gmailEmail : '',
                    gmailFirstName : '',
                    gmailLastName : '',
                    gmailProfilePicture : '',
                    lgmailGender : ''
                }
            }
        };


        function findUserByEmail(email,cb,ob){

            return User.findAll({email: email}).then(function (usr) {
                cb(usr);
            }).catch(function(err){
                ob(err);
            })

        }

        return {

            user : user,

            isLogin : function () {
                return user.data.islogin
            },

            load : function (cb) {
                user = $localstorage.getObject('user');
                cb(user);
            },

            save : function () {
                $localstorage.setObject('user',user);
                console.log("User saving OK");
            },

            googleLogin: function () {
                $cordovaOauth.google(
                    "169622791103-pr7n4oofbdemokc79ooolv2j3elnht0j.apps.googleusercontent.com",
                    [
                        "https://www.googleapis.com/auth/urlshortener",
                        "https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/plus.login",

                    ]).then(function (result) {
                        console.log(JSON.stringify(result));
                        getDataProfile(result.access_token);

                    }, function (error) {
                        console.log(error);
                    });

                function getDataProfile(accessToken) {

                    console.log("getting user data=" + accessToken);
                    $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken).
                        success(function (data, status, headers, config) {
                            var item;

                            console.log(JSON.stringify(data));
                            // Save the userprofile data in your localStorage.
                            processGoogleData(data,accessToken);
                            processData();
                            disconnectUser(accessToken);
                        })


                };

                function processGoogleData(data,accessToken){
                    user.providers.google = {
                        access_token : accessToken,
                        gmailLogin : "true",
                        gmailID : data.id,
                        gmailEmail : data.email,
                        gmailFirstName : data.given_name,
                        gmailLastName : data.family_name,
                        gmailProfilePicture : data.picture,
                        gmailGender : data.gender
                    }
                    save();
                }

                function processData(){
                     user.data = {
                         statusid : 0,
                         islogin : true,
                         firstname : user.providers.google.gmailFirstName,
                         lastname : user.providers.google.gmailLastName,
                         email: user.providers.google.gmailEmail,
                         picture: user.providers.google.gmailProfilePicture,
                         gender: user.providers.google.gmailGender
                     };
                    findUserByEmail(user.data.email,function(usr){
                        user.data.userid = usr.id;
                        save();
                        console.log('Login Process OK');
                    },function(err){
                        console.log('Login Process failed');
                    });


                }

                function disconnectUser(accessToken) {
                    console.log("getting user data=" + accessToken);
                    $http.get('https://accounts.google.com/o/oauth2/revoke?token=' + accessToken)
                        .success(function (data, status, headers, config) {
                            console.log(JSON.stringify(data));
                            console.log("logout");
                        })


                };

            }
        }

    })


    .factory('GoogleOAuth',function($q){

        var accessToken;
        var UserData=null;


        function authorize(options) {
            var deferred = $.Deferred();

            //Build the OAuth consent page URL
            var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                    client_id: options.client_id,
                    redirect_uri: options.redirect_uri,
                    response_type: 'code',
                    scope: options.scope

                });

            //Open the OAuth consent page in the InAppBrowser
            var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

            //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
            //which sets the authorization code in the browser's title. However, we can't
            //access the title of the InAppBrowser.
            //
            //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
            //authorization code will get set in the url. We can access the url in the
            //loadstart and loadstop events. So if we bind the loadstart event, we can
            //find the authorization code and close the InAppBrowser after the user
            //has granted us access to their data.
            $(authWindow).on('loadstart', function(e) {
                var url = e.originalEvent.url;
                var code = /\?code=(.+)$/.exec(url);
                var error = /\?error=(.+)$/.exec(url);

                if (code || error) {
                    //Always close the browser when match is found
                    authWindow.close();
                }

                if (code) {
                    //Exchange the authorization code for an access token
                    $.post('https://accounts.google.com/o/oauth2/token', {
                        code: code[1],
                        client_id: options.client_id,
                        client_secret: options.client_secret,
                        redirect_uri: options.redirect_uri,
                        grant_type: 'authorization_code'
                    }).done(function(data) {
                        deferred.resolve(data);

                        $("#loginStatus").html('Name: ' + data.given_name);
                    }).fail(function(response) {
                        deferred.reject(response.responseJSON);
                    });
                } else if (error) {
                    //The user denied access to the app
                    deferred.reject({
                        error: error[1]
                    });
                }
            });

            return deferred.promise();
        };

        return  {




        callGoogle : function()
        {

            //  alert('starting');
            authorize({
                client_id: '169622791103-vj8jv915ao2q3joghvg12h3jtrvk013d.apps.googleusercontent.com',
                client_secret: 'tr8T_szcZ01DWbM7ocx9n44P',
                redirect_uri: 'http://localhost',
                scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
            }).done(function(data) {
                accessToken=data.access_token;
                // alert(accessToken);
                // $loginStatus.html('Access Token: ' + data.access_token);
                console.log(data.access_token);
                console.log(JSON.stringify(data));
                getDataProfile();


            });

        },
        // This function gets data of user.
        getDataProfile : function ()
        {
            var term=null;
            //  alert("getting user data="+accessToken);
            $.ajax({
                url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken,
                type:'GET',
                data:term,
                dataType:'json',
                error:function(jqXHR,text_status,strError){
                },
                success:function(data)
                {
                    var item;

                    console.log(JSON.stringify(data));
// Save the userprofile data in your localStorage.
                    localStorage.gmailLogin="true";
                    localStorage.gmailID=data.id;
                    localStorage.gmailEmail=data.email;
                    localStorage.gmailFirstName=data.given_name;
                    localStorage.gmailLastName=data.family_name;
                    localStorage.gmailProfilePicture=data.picture;
                    localStorage.gmailGender=data.gender;
                }
            });
            disconnectUser();
        },
        disconnectUser :  function () {
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + accessToken;

            // Perform an asynchronous GET request.
            $.ajax({
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (nullResponse) {
                    // Do something now that user is disconnected
                    // The response is always undefined.
                    accessToken = null;
                    console.log(JSON.stringify(nullResponse));
                    console.log("-----signed out..!!----" + accessToken);
                },
                error: function (e) {
                    // Handle the error
                    // console.log(e);
                    // You could point users to manually disconnect if unsuccessful
                    // https://plus.google.com/apps
                }
            });

        }

    }

    })

    .controller('AuthCtrl',function ($scope, AuthSvc, $auth,  OwnerSvc, $state) {

        $scope.login = function () {

            console.log('AuthCtrl login')

            OwnerSvc.login($scope.username,$scope.password,function(owner){
                console.log('Login OK: owner:'+ JSON.stringify(owner));
                $state.go('main');
            });

            //if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            //    AuthSvc.googleLogin();
            //}else{
            //    $auth.authenticate('google');
            //}

        }



    })

;


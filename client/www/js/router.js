/**
 * Created by goer on 4/28/15.
 */
angular.module('Router',['Auth'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider


            .state('login', {
                url: "/login",
                views: {
                    'main': {
                        templateUrl: "tpl/login.html",
                        controller: 'AuthCtrl',
                    }
                },
                data: {
                    requireLogin: false
                }

            })



            .state('main', {
                url: "/main",
                views: {
                    'main': {
                        templateUrl: "tpl/main.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('addroom', {
                url: "/addroom",
                views: {
                    'main': {
                        templateUrl: "tpl/addroom.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('invitefriends', {
                url: "/invitefriends",
                views: {
                    'main': {
                        templateUrl: "tpl/invitefriends.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('room', {
                url: "/room",
                views: {
                    'main': {
                        templateUrl: "tpl/room.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('settings', {
                url: "/settings",
                views: {
                    'main': {
                        templateUrl: "tpl/settings.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('users', {
                url: "/users",
                views: {
                    'main': {
                        templateUrl: "tpl/users.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('adduser', {
                url: "/adduser",
                views: {
                    'main': {
                        templateUrl: "tpl/adduser.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('userdetail', {
                url: "/userdetail",
                views: {
                    'main': {
                        templateUrl: "tpl/userdetail.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('members', {
                url: "/members",
                views: {
                    'main': {
                        templateUrl: "tpl/members.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('memberdetail', {
                url: "/memberdetail",
                views: {
                    'main': {
                        templateUrl: "tpl/memberdetail.html",
                        controller: 'MainCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })


        $urlRouterProvider.otherwise('/login');

    })

;



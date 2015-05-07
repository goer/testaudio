/**
 * Created by goer on 4/28/15.
 */
angular.module('Router',['RoomModule','RoomsModule','Main'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider


            .state('login', {
                url: "/login",
                views: {
                    'main': {
                        templateUrl: "tpl/login.html",
                        controller: 'LoginCtrl',
                    }
                },
                data: {
                    requireLogin: false
                }

            })



            .state('main', {
                url: "/main",
                cache: false,
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
                        controller: 'RoomsCtrl',
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
                        controller: 'RoomCtrl',
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
                cache : false,
                views: {
                    'main': {
                        templateUrl: "tpl/members.html",
                        controller: 'MembersCtrl',
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
                        controller: 'MemberDetailCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('addmember', {
                url: "/addmember",
                cache : false,
                views: {
                    'main': {
                        templateUrl: "tpl/addmember.html",
                        controller: 'AddMemberCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

            .state('messages', {
                url: "/messages",
                views: {
                    'main': {
                        templateUrl: "tpl/messages.html",
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



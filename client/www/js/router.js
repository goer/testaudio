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

        $urlRouterProvider.otherwise('/login');

    })

;



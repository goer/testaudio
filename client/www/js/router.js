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
                        controller: 'AudioCtrl',
                    }
                },
                data: {
                    requireLogin: true
                }

            })

        $urlRouterProvider.otherwise('/login');

    })

;



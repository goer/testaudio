/**
 * Created by goer on 4/28/15.
 */
angular.module('Router',['Auth'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('login', {
                url: "/login",
                views : {
                    'main' : {
                        template: "tpl/login.html",
                        controller: 'AuthCtrl',
                    }
                },

            })

    })
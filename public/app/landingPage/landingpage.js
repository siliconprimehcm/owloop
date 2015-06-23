var landingPageModule = angular.module('owloop.landingPage', ['ui.router']);

landingPageModule.config(function($stateProvider, $urlRouterProvider) {
    
   // $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('landingpage', {
            url: '/landingpage',
            templateUrl: 'public/app/landingPage/landingpage.html'
        })
        
        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })
        
        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            views: {
                '': { templateUrl: 'partial-about.html' },
                'columnOne@about': { template: 'Look I am a column!' },
                'columnTwo@about': { 
                    templateUrl: 'table-data.html',
                    controller: 'scotchController'
                }
            }
            
        });
        
});

landingPageModule.controller('landingPageController', function($scope, $state) {
    
    $scope.goSignupScreen = function(){
        $state.go('signup');
    }
     
});
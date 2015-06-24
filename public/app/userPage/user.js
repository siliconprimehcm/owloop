var userModule = angular.module('owloop.user',['ui.router']);

userModule.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            views: {

	            // the main template will be placed here (relatively named)
                '': { templateUrl: 'public/app/userPage/home.html' },

	            // the child views will be defined here (absolutely named)
	            'columnOne@home': {
	                templateUrl: 'public/app/userPage/column1.html',
	            	controller: 'columnOneController'
	             },

	            // for column two, we'll define a separate controller 
	            'columnTwo@home': { 
	                templateUrl: 'public/app/userPage/column2.html',
	                controller: 'columnTwoController'
	            }
       		},
       		resolve: {
       			authenticate: function (authenticationSvc) {
			        return authenticationSvc.requireLogin();
			    },
                data: function(authenticate, Restangular) {
                	var header = {
				        'Content-type': 'application/json',
				        'ApplicationKey': 'HuDNpU8EjgJJhsSV',
				        'CustomerId': '',
				        'AuthenKey':'',
				        'BuildNumber': '',
				        'Os': 0,
				        'X-Requested-With': 'XMLHttpRequest'              
				    };

                    return Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST({"userId": 1}, '', {}, header).then(function(data){
			            return data;
			        });
                },

            }
        });
        
});

userModule.controller('columnOneController', function($scope, data) {
	
	$scope.privateLoops = data.objectValue.privateLoops;
	$scope.publicLoops = data.objectValue.publicLoops;
	
});

userModule.controller('columnTwoController', function($scope, data) {
	$scope.postLoops = data.objectValue.posts;
	$scope.questionPostLoops = data.objectValue.questionPosts;
	$scope.popularLoops = data.objectValue.loopPopulars;
});
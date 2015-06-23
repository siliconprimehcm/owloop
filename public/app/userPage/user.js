var userModule = angular.module('owloop.user',['ui.router']);

userModule.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            views: {

	            // the main template will be placed here (relatively named)
	            '': { templateUrl: 'app/userPage/home.html' },

	            // the child views will be defined here (absolutely named)
	            'columnOne@home': {
	            	templateUrl: 'app/userPage/column1.html',
	            	controller: 'columnOneController'
	             },

	            // for column two, we'll define a separate controller 
	            'columnTwo@home': { 
	                templateUrl: 'app/userPage/column2.html',
	                controller: 'columnTwoController'
	            }
       		},
       		resolve: {
       			authenticate: function ($q, $localStorage, $state, $timeout) {
			        if (1) {
			        	return $q.when();
			        } else {
			        	$timeout(function() {$state.go('signup')});
			        	return $q.reject();
			    	}
			    },
                data: function(Restangular) {
                	var header = {
				        'Content-type': 'application/json',
				        'ApplicationKey': 'HuDNpU8EjgJJhsSV',
				        'CustomerId': '',
				        'AuthenKey':'',
				        'BuildNumber': '',
				        'Os': 0,
				        'X-Requested-With': 'XMLHttpRequest'              
				    };

                    Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST({"userId": 1}, '', {}, header).then(function(data){
			            console.log(data);
			           
			        });
                },

            }
        });
        
});

userModule.controller('columnOneController', function($scope) {
       
});

userModule.controller('columnTwoController', function($scope) {
	$scope.feeds = [
		{

		}
	]
});
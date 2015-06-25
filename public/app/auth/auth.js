var signupModule = angular.module('owloop.auth', ['ui.router']);

signupModule.config(function($stateProvider) {
    
   // $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'public/app/authPage/signup.html',
            controller: 'authController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/authPage/login.html',
            controller: 'authController'
        })
        .state('forgotpassword', {
            url: '/forgotpassword',
            templateUrl: 'app/authPage/forgotpassword.html',
            controller: 'authController'
        })

   
});

signupModule.controller('authController', function($scope, Restangular, $localStorage, $state) {
    
    $scope.user = {
        username:'',
        password:'',
        email:''
    };

    var header = {
        'Content-type': 'application/json',
        'ApplicationKey': 'HuDNpU8EjgJJhsSV',
        'CustomerId': '',
        'AuthenKey':'',
        'BuildNumber': '',
        'Os': 0,
        'X-Requested-With': 'XMLHttpRequest'              
    }
        
    $scope.register = function(){
        console.log($scope.user);

        Restangular.one('/v1/Customer/SignupEmail').customPOST($scope.user, '', {}, header).then(function(data){
            console.log(data);
            if(data && data.objectValue){
                $localStorage['authenticate'] = {
                    authenKey: data.objectValue.authenKey,
                    customerId: data.objectValue.customerId
                };
                $state.go('home');
            }else{
                $state.go('login');
            }
        });
    };

    $scope.login = function(){

        Restangular.one('/v1/Customer/LoginEmail').customPOST($scope.user, '', {}, header).then(function(data){
            console.log(data);
            if(data && data.objectValue){
                $localStorage['authenticate'] = {
                    authenKey: data.objectValue.authenKey,
                    customerId: data.objectValue.customerId
                };
                $state.go('home');
            }else{
                $state.go('login');
            }
        });
    };

    $scope.logout = function () {
        debugger;
            $localStorage['authenticate'] = null
            $state.go('login');
    };
});
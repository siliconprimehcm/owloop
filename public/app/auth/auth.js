var authModule = angular.module('owloop.auth', []);

authModule.config(function($authProvider) {
    $authProvider.facebook({
      clientId: '1625789900991409',
      responseType: 'token',
      redirectUri: 'http://owloop-test.azurewebsites.net/#/user/homefeed'
    });
});

authModule.controller('authController', function(
    $scope, Restangular, $localStorage, $state, authenticationSvc, $auth, Account) {
    
    $scope.user = {
        username:'',
        password:'',
        email:''
    };

    var header = authenticationSvc.getHeader();
        
    $scope.register = function(){
        console.log($scope.user);

        Restangular.one('/v1/Customer/SignupEmail').customPOST($scope.user, '', {}, header).then(function(data){
            console.log(data);
            if(data && data.objectValue){
                $localStorage['owloopAuth'] = {
                    authenKey: data.objectValue.authenKey,
                    customerId: data.objectValue.customerId
                };
                $state.go('app.user.homefeed');
            }else{
                $state.go('app.user.signup');
            }
        });
    };

    $scope.facebookLogin = function(provider) {
        $auth.authenticate(provider).then(function(response) {
          console.log(response);
          Account.getProfile()
            .success(function(data) {
              $scope.user = data;
              console.log(data);
            })
            .error(function(error) {
                console.log(error);
            });
        });
    };

    $scope.login = function(){

        Restangular.one('/v1/Customer/LoginEmail').customPOST($scope.user, '', {}, header).then(function(data){
            console.log(data);
            if(data && data.objectValue){
                $localStorage['owloopAuth'] = {
                    authenKey: data.objectValue.authenKey,
                    customerId: data.objectValue.customerId
                };
                $state.go('app.user.homefeed');
            }else{
                $state.go('app.user.login');
            }
        });
    };

    $scope.logout = function () {
        debugger;
            $localStorage['owloopAuth'] = null
            $state.go('app.user.login');
    };
});


authModule.factory('Account', function($http) {
    return {
        getProfile: function() {
            return $http.get('/api/me');
        },
        updateProfile: function(profileData) {
            return $http.put('/api/me', profileData);
        }
    };
});
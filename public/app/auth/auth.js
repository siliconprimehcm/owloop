var authModule = angular.module('owloop.auth', []);

authModule.config(function(FacebookProvider) {

    FacebookProvider.init('1625789900991409');
});

authModule.controller('authController', function(
    $scope, Restangular, $localStorage, $state, authenticationSvc, Facebook) {
    
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


    $scope.facebookLogin = function(aaaa) {
      // From now on you can use the Facebook service just as Facebook api says
        Facebook.login(function(response) {

            console.log(response);

            Facebook.api('/me', function(me) {
                console.log(me);
                var path = '/' + me.id + '/friends'
                Facebook.api(path, function(friends) {
                    console.log(friends);;
                });
            });
        },{scope: 'email, user_friends'});
    };

    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.facebookReady = true;
    });

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


// authModule.factory('Account', function($http) {
//     return {
//         getProfile: function() {
//             return $http.get('/api/me');
//         },
//         updateProfile: function(profileData) {
//             return $http.put('/api/me', profileData);
//         }
//     };
// });
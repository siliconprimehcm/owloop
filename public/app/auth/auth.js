var signupModule = angular.module('owloop.auth', []);

signupModule.controller('authController', function(
    $scope, Restangular, $localStorage, $state, authenticationSvc) {
    
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
var authModule = angular.module('owloop.auth', ['validation', 'validation.rule', 'server-validate']);

authModule.config(function (FacebookProvider) {
    FacebookProvider.init('1625789900991409');
});

authModule.controller('authController', function (
    $scope, $injector, Restangular, $localStorage, $state, authenticationSvc, Facebook, userService) {
    
    var $validationProvider = $injector.get('$validation');
    
    $scope.user = {
        username: userService.getUsername(),
        email: userService.getEmail(),
        password: '',
        confirm: ''
    };

    $scope.friends = userService.getFriendlist();

    if($scope.user.email){
        $('#rethu').css({'display': 'none'});
    }

    $scope.idloginForm = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            if (!$validationProvider.checkValid(form)) {
                $validationProvider.validate(form);
            } else {
                var header = authenticationSvc.getHeader();
                Restangular.one('/v1/Customer/LoginEmail').customPOST($scope.user, '', {}, header).then(function (data) {
                    console.log(data);
                    if (data && data.objectValue) {
                        $localStorage['owloopAuth'] = {
                            authenKey: data.objectValue.authenKey,
                            customerId: data.objectValue.customerId,
                            firstName: data.objectValue.firstName,
                            lastName: data.objectValue.lastName,
                            avatarUrl: data.objectValue.avatarUrl,
                        };
                        $state.go('app.user.homefeed');
                    } else {
                        $scope.errorLogins = {};
                        $scope.loginForm['username'].$setValidity('server', false);
                        $scope.errorLogins['username'] = data.description;
                    }
                });
            }
        }
    };

    $scope.formErrors = {};
    $scope.idsignupForm = {

        submit: function (form) {
            if (!$validationProvider.checkValid(form)) {
                $validationProvider.validate(form);
            } else {
                var header = authenticationSvc.getHeader();
                Restangular.one('/v1/Customer/SignupEmail').customPOST($scope.user, '', {}, header).then(function (data) {
                    console.log(data);
                    if (data && data.objectValue) {
                        $localStorage['owloopAuth'] = {
                            authenKey: data.objectValue.authenKey,
                            customerId: data.objectValue.customerId
                        }; 
                        $state.go('app.auth.connect_facebook');          
                    } else {
                        $scope.errors = {};
                        $scope.signupForm['name'].$setValidity('server', false);
                        $scope.errors['name'] = data.description;
                    }
                });

            }
        }
    };

    var isFacebookLogin = false;
    $scope.facebookLogin = function (aaaa) {
        
        Facebook.login(function (response) {

            console.log(response);

            Facebook.api('/me', function (me) {
                console.log(me);
                var param = {
                    "socialType": 1,
                    "profile": JSON.stringify(me),
                    "deviceToken": null,
                    "accessToken": response.authResponse.accessToken
                }

                var path = '/' + me.id + '/friends'
                Facebook.api(path, function (data) {
                    console.log(data);
                    userService.setFriendlist(data.data);
                });

                var header = authenticationSvc.getHeader();
                Restangular.one('/v1/Customer/LoginSocial').customPOST(param, '', {}, header).then(function (data) {
                    if(data.objectValue && !data.objectValue.isNewUser){
                        isFacebookLogin = true;
                        $localStorage['owloopAuth'] = {
                            authenKey: data.objectValue.authenKey,
                            customerId: data.objectValue.customerId,
                            firstName: data.objectValue.firstName,
                            lastName: data.objectValue.lastName,
                            avatarUrl: data.objectValue.avatarUrl,
                        };
                        $state.go('app.user.homefeed');
                    }else{

                        $localStorage['owloopAuth'] = {
                            authenKey: data.objectValue.authenKey,
                            customerId: data.objectValue.customerId,
                            firstName: data.objectValue.firstName,
                            lastName: data.objectValue.lastName,
                            avatarUrl: data.objectValue.avatarUrl,
                        };
                        
                        if(data.objectValue.email){
                            userService.setEmail(data.objectValue.email);
                        };

                        if(data.objectValue.username){
                            userService.setUsername(data.objectValue.username);
                        };

                        $state.go('app.auth.signup_after_login_facebook');
                    };
                });

            });

        }, { scope: 'email, user_friends' });
    };

    $scope.updateUsername = function(){
        var param = $scope.user;
        var header = authenticationSvc.getHeader();
        Restangular.one('/v1/Customer/UpdatedInfo').customPOST(param, '', {}, header).then(function (data) {
            $state.go('app.auth.friendlist');
        });
    };

    $scope.connectFacebook = function() {
        Facebook.login(function (response) {

            console.log(response);

            Facebook.api('/me', function (me) {
                console.log(me);
                var path = '/' + me.id + '/friends'
                Facebook.api(path, function (data) {
                    console.log(friends);
                    $scope.friends = data;
                    $state.go('app.auth.friendlist');
                });
            });
        })
    };

    var listFollowIds = [];
    $scope.follow = function(id){
        console.log(id);
        for(var i=0; i<listFollowIds.length; i++){
            if(id == listFollowIds[i]){
                listFollowIds.splice(i, 1);
                break;
            }else{
                if(i == listFollowIds.length - 1){
                    listFollowIds.push(id)
                }
            }
        }
    };

    $scope.followAll = function(){
        for(var i=0; i < $scope.friends.length; i++){
            listFollowIds.push($scope.friends[i].id);
        }
    };

    $scope.doneFollow = function(){
        var header = authenticationSvc.getHeader();
        var param = {
            customerIds: listFollowIds
        };
        Restangular.one('/v1/Customer/FollowCustomer').customPOST(param, '', {}, header).then(function (data) {
            //console.log(data.objectValue.data);
            // $state.go('app.user.homefeed');
        });
        $state.go('app.user.homefeed');
    }

    $scope.$watch(function () {
        // This is for convenience, to notify if Facebook is loaded and ready to go.
        return Facebook.isReady();
    }, function (newVal) {
        // You might want to use this to disable/show/hide buttons and else
        $scope.facebookReady = true;
    });

});

authModule.service('userService', function() {

    this.setEmail = function(email) {
        this.email = email;
    };

    this.setUsername = function(username) {
        this.username = username;
    };

    this.setFriendlist = function(friendlist) {
        this.friendlist = friendlist;
    };

    this.getEmail = function() {
        return this.email;
    };

    this.getUsername = function() {
        return this.username;
    };

    this.getFriendlist = function() {
        return this.friendlist;
    };
});

authModule.directive('serverError', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, el, attrs, formCtrl) {
            return el.on('change', function () {
                $scope.$apply(function () {
                    formCtrl.$setValidity('server', true);
                });
            });
        }
    };
});

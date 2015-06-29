var authModule = angular.module('owloop.auth', ['validation', 'validation.rule', 'server-validate']);
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
authModule.config(function(FacebookProvider) {

    FacebookProvider.init('1625789900991409');
});


      
authModule.controller('authController', function(
    $scope,$injector, Restangular, $localStorage, $state, authenticationSvc, Facebook) {
    var $validationProvider = $injector.get('$validation');
    $scope.user = {
        username:'',
        email:'',
        password:'',
        confirm:''
    };

    var header = authenticationSvc.getHeader();
        

    $scope.register = function () {
        console.log($scope.user);

        Restangular.one('/v1/Customer/SignupEmail').customPOST($scope.user, '', {}, header).then(function (data) {
            console.log(data);
            if (data && data.objectValue) {
                $localStorage['owloopAuth'] = {
                    authenKey: data.objectValue.authenKey,
                    customerId: data.objectValue.customerId
                };
                $state.go('app.user.homefeed');
                $scope.formErrors = {};
                $scope.idsignupForm = {

                    submit: function (form) {
                        if (!$validationProvider.checkValid(form)) {
                            $validationProvider.validate(form);
                        } else {
                            Restangular.one('/v1/Customer/SignupEmail').customPOST($scope.user, '', {}, header).then(function (data) {
                                console.log(data);
                                if (data && data.objectValue) {
                                    $localStorage['owloopAuth'] = {
                                        authenKey: data.objectValue.authenKey,
                                        customerId: data.objectValue.customerId
                                    };
                                    $state.go('app.user.homefeed');
                                } else {
                                    $scope.errors = {};
                                    $scope.signupForm['name'].$setValidity('server', false);
                                    $scope.errors['name'] = data.description;
                                }
                            });
                        }


                    }
                };
            }
        })
    }


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
    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.facebookReady = true;
    });

    $scope.idloginForm = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            if (!$validationProvider.checkValid(form)) {
                $validationProvider.validate(form);
            } else {
                Restangular.one('/v1/Customer/LoginEmail').customPOST($scope.user, '', {}, header).then(function (data) {
                    console.log(data);
                    debugger;
                    if (data && data.objectValue) {
                        $localStorage['owloopAuth'] = {
                            authenKey: data.objectValue.authenKey,
                            customerId: data.objectValue.customerId
                        };
                        $state.go('app.user.homefeed');

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

                            $scope.idloginForm = {
                                checkValid: $validationProvider.checkValid,
                                submit: function (form) {
                                    if (!$validationProvider.checkValid(form)) {
                                        $validationProvider.validate(form);
                                    } else {
                                        Restangular.one('/v1/Customer/LoginEmail').customPOST($scope.user, '', {}, header).then(function (data) {
                                            console.log(data);
                                            if (data && data.objectValue) {
                                                $localStorage['owloopAuth'] = {
                                                    authenKey: data.objectValue.authenKey,
                                                    customerId: data.objectValue.customerId
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
                        }
                    })
                }
            });
        

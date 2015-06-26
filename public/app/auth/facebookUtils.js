(function(exports, global) {
    global["true"] = exports;
    "use strict";
    var defaultSettings = {
        appID: "1625789900991409",
        permissions: "",
        channelFile: "channel.html",
        routingEnabled: false,
        loginPath: "/"
    };
    var application = angular.module("facebookUtils", [ "ngRoute" ]).constant("facebookConfigDefaults", defaultSettings).constant("facebookConfigSettings", defaultSettings).run([ "facebookConfigSettings", "facebookConfigDefaults", "$rootScope", "$location", "facebookUser", "$route", function(facebookConfigSettings, facebookConfigDefaults, $rootScope, $location, facebookUser, $route) {
        debugger;
        if (facebookConfigSettings.routingEnabled) {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if (next && next.$$route && next.$$route.needAuth) {
                    facebookUser.then(function(user) {
                        if (!user.loggedIn) {
                            $location.path(facebookConfigSettings.loginPath || facebookConfigDefaults.loginPath);
                        }
                    });
                }
            });
            $rootScope.$on("fbLogoutSuccess", function () {

                if ($route.current.$$route.needAuth) {
                    $location.path(facebookConfigSettings.loginPath || facebookConfigDefaults.loginPath);
                }
            });
        }
    } ]);

    "use strict";
    angular.module("facebookUtils").provider("facebookSDK", function () {
        debugger;
        var loadScript = function (d, cb) {
            debugger;
            var js = d.createElement("script");
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            js.onreadystatechange = function() {
                if (this.readyState == "complete") {
                    cb();
                }
            };
            js.onload = cb;
            d.getElementsByTagName("body")[0].appendChild(js);
        };
        this.$get = [ "$q", "facebookConfigDefaults", "facebookConfigSettings", "$timeout", function($q, facebookConfigDefaults, facebookConfigSettings, $timeout) {
            var deferred = $q.defer();
            if (!facebookConfigSettings.appID) {
                deferred.reject("You must provide an app-id for the facebook-login directive to work!");
            } else {
                loadScript(document, function(callback) {
                    FB.init({
                        appId: facebookConfigSettings.appID,
                        channelUrl: facebookConfigSettings.channelFile || facebookConfigDefaults.channelFile,
                        status: true,
                        cookie: true
                    });
                    $timeout(function() {
                        deferred.resolve(FB);
                    });
                });
            }
            return deferred.promise;
        } ];
    });
    "use strict";
    angular.module("facebookUtils").service("facebookUser", [ "$window", "$rootScope", "$q", "facebookConfigDefaults", "facebookConfigSettings", "facebookSDK", function($window, $rootScope, $q, facebookConfigDefaults, facebookConfigSettings, facebookSDK) {
        debugger;
        var FacebookUser = function () { };
        var checkStatus = function() {
            var deferred = $q.defer();
            FB.getLoginStatus(function(response) {
                $rootScope.$apply(function() {
                    if (response.status === "connected") {
                        user.loggedIn = true;
                        $rootScope.$broadcast("fbLoginSuccess", response);
                        deferred.resolve(response);
                    } else {
                        user.loggedIn = false;
                        deferred.reject(response);
                    }
                });
            }, true);
            return deferred.promise;
        };
        FacebookUser.prototype.loggedIn = false;
        FacebookUser.prototype.api = function() {
            var deferred = $q.defer();
            var args = [].splice.call(arguments, 0);
            args.push(function(response) {
                $rootScope.$apply(function() {
                    deferred.resolve(response);
                });
            });
            FB.api.apply(FB, args);
            return deferred.promise;
        };
        FacebookUser.prototype.login = function() {
            var _self = this;
            FB.login(function(response) {
                if (response.authResponse) {
                    response.userNotAuthorized = true;
                    _self.loggedIn = true;
                    $rootScope.$broadcast("fbLoginSuccess", response);
                } else {
                    _self.loggedIn = false;
                    $rootScope.$broadcast("fbLoginFailure");
                }
            }, {
                scope: facebookConfigSettings.permissions || facebookConfigDefaults.permissions
            });
        };
        FacebookUser.prototype.logout = function () {
            debugger;
            var _self = this;
            FB.logout(function(response) {
                if (response) {
                    _self.loggedIn = false;
                    $rootScope.$broadcast("fbLogoutSuccess");
                } else {
                    $rootScope.$broadcast("fbLogoutFailure");
                }
            });
        };
        var user = new FacebookUser();
        var deferred = $q.defer();
        facebookSDK.then(function() {
            checkStatus()["finally"](function() {
                deferred.resolve(user);
            });
        }, function() {
            deferred.reject("SDK failed to load because your app ID wasn't set");
        });
        return deferred.promise;
    } ]);
    "use strict";
    angular.module("facebookUtils").directive("facebookLoginButton", ["facebookUser", function (facebookUser) {
        debugger;
        return {
            templateUrl: "src/views/facebookLoginPartial.html",
            restrict: "E",
            replace: true,
            scope: false,
            link: function postLink($scope, $element, $attrs) {
                facebookUser.then(function (user) {
                    debugger;
                    $scope.signInOrConfigure = function () {
                        debugger;
                        var action = !user.loggedIn ? "login" : "logout";
                        user[action]();
                    };
                    var syncLoggedIn = function () {
                        debugger;
                        $scope.connectedToFB = user.loggedIn;
                    };
                    $scope.$on("fbLoginSuccess", syncLoggedIn);
                    $scope.$on("fbLogoutSuccess", function () {
                        debugger;
                        $scope.$apply(function () {
                            debugger;
                            syncLoggedIn();
                        });
                    });
                    syncLoggedIn();
                }, function () {
                    debugger;
                    $scope.signInOrConfigure = function () {
                        debugger;
                        $scope.configureLocation = window.location.origin;
                        $scope.showConfigure = true;
                    };
                });
            }
        };
    } ]);
})({}, function() {
    return this;
}());
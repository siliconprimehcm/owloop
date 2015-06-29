var loopApp = angular.module('loopApp', [
    'ui.router'
    , 'restangular'
    , 'ngStorage'
    , 'facebook'

    , 'owloop.auth'
    , 'owloop.user'
    , 'owloop.landingPage'

]);

loopApp.config(function ($httpProvider, RestangularProvider, $urlRouterProvider, $stateProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    RestangularProvider.setBaseUrl('http://owloopstaging-api.azurewebsites.net');

    $urlRouterProvider.otherwise('/user/homefeed');

    $stateProvider

        .state('app', {
            abstract: true,
            url: '',
            template: '<ui-view/>'
        })
        .state('app.landing', {
            url: '/landing',
            views: {
                '': {
                    templateUrl: 'public/app/landing/landingpage.html',
                    controller: 'landingController'
                }
            }
        })
        .state('app.auth', {
            abstract: true,
            url: '/auth',
            template: '<ui-view/>'
        })
        .state('app.auth.signup', {
            url: '/signup',
            views: {
                '': {
                    templateUrl: 'public/app/auth/signup.html',
                    controller: 'authController'
                }
            }
        })
        .state('app.auth.login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: 'public/app/auth/login.html',
                    controller: 'authController'
                }
            }
        })
        .state('app.user', {
            abstract: true,
            url: '/user',
            views: {
                '': {
                    templateUrl: 'public/app/user/layout.html'
                },
                'leftbar@app.user': {
                    templateUrl: 'public/app/user/leftbar.html'
                    , controller: 'leftbarController'
                },
                'content@app.user': {
                    template: '<ui-view/>'
                }
            },
            resolve: {
                authenticate: function (authenticationSvc) {
                    return authenticationSvc.requireLogin();
                }
            }
        })
        .state('app.user.homefeed', {
            url: '/homefeed',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/homefeed/homefeed.html'
                    , controller: 'homefeedController'
                }
            }
        })
        .state('app.user.explore', {
            url: '/explore',
            views: {
                'leftbar@app.user': {
                    templateUrl: 'public/app/user/explore/leftbar.html'
                    , controller: 'exploreController'
                },
                'content@app.user': {
                    templateUrl: 'public/app/user/explore/explore.html'
                    , controller: 'exploreController'
                }
            }
        })
        .state('app.user.question', {
            url: '/question',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/questiondetail/questiondetail.html',
                    controller: 'questionController'
                }
            }
        })
        .state('app.user.post', {
            url: '/post',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/postdetail/postdetail.html',
                    controller: 'postController'
                }
            }
        })
        .state('app.user.album', {
            url: '/album',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/albumdetail/albumdetail.html',
                    controller: 'albumController'
                }
            }
        })
        .state('app.user.profile', {
            url: '/profile',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/profile/profile.html',
                    controller: 'profileController'
                }
            }
        })
        .state('app.user.loop', {
            abstract: true,
            url: '/loop',
            views: {
                'content@app.user': {
                    templateUrl: 'public/app/user/loop/looplayout.html'
                }
            }
        })
        .state('app.user.loop.newfeed', {
            url: '/newfeed',
            views: {
                'loopcontent@app.user.loop': {
                    templateUrl: 'public/app/user/loop/newfeed/newfeed.html'
                    ,controller: 'newfeedController'
                }
            }
        })
        .state('app.user.loop.media', {
            url: '/media',
            views: {
                'loopcontent@app.user.loop': {
                    templateUrl: 'public/app/user/loop/media/media.html'
                    ,controller: 'mediaController'
                }
            }
        })
        .state('app.user.loop.setting', {
            url: '/setting',
            views: {
                'loopcontent@app.user.loop': {
                    templateUrl: 'public/app/user/loop/setting/setting.html'
                    ,controller: 'settingController'
                }
            }
        })
});

loopApp.factory("authenticationSvc", function ($q, $localStorage, $state, $timeout) {
    return {
        requireLogin: function () {
            if ($localStorage['owloopAuth']) {
            // if ($localStorage['owloopAuth']) {
                return $q.when();
            } else {
                $timeout(function () {
                    $state.go('app.auth.login');
                });
                return $q.reject();
            }
        },

        getHeader: function () {
            var authenKey = '';
            var customerId = '';
            if ($localStorage.owloopAuth) {
                authenKey = $localStorage.owloopAuth.authenKey;
                customerId = $localStorage.owloopAuth.customerId;
            };
            var header = {
                'Content-type': 'application/json',
                'ApplicationKey': 'HuDNpU8EjgJJhsSV',
                'CustomerId': customerId,
                'AuthenKey': authenKey,
                'BuildNumber': '',
                'Os': 0,
                'X-Requested-With': 'XMLHttpRequest'
            };
            return header;
        }
    }
})
var loopApp = angular.module('loopApp',[
    'ui.router'
    ,'restangular'
    ,'ngStorage'

    ,'owloop.auth'
    ,'owloop.user'
    ,'owloop.landingPage'
    
]);

loopApp.config(function($httpProvider, RestangularProvider, $urlRouterProvider, $stateProvider) {
          
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    RestangularProvider.setBaseUrl('http://owloopstaging-api.azurewebsites.net');

    $urlRouterProvider.otherwise('/user/homefeed');

    $stateProvider

        .state('app',{
            abstract: true,
            url:'',
            template: '<ui-view/>'
        })
        .state('app.landing',{
            url:'/landing',
            views:{
                '':{
                    templateUrl:'public/app/landing/landingpage.html',
                    controller:'landingController'
                }
            }
        })
        .state('app.auth',{
            abstract: true,
            url:'/auth',
            template: '<ui-view/>'
        })
        .state('app.auth.signup',{
            url:'/signup',
            views:{
                '':{
                    templateUrl:'public/app/auth/signup.html',
                    controller:'authController'
                }
            }
        })
        .state('app.auth.login',{
            url:'/login',
            views:{
                '':{
                    templateUrl:'public/app/auth/login.html',
                    controller:'authController'
                }
            }
        })
        .state('app.user',{
            abstract: true,
            url:'/user',
            views:{
                '':{
                    templateUrl:'public/app/user/layout.html'
                },
                'leftbar@app.user':{
                    templateUrl:'public/app/user/leftbar.html'
                    ,controller:'leftbarController'
                },
                'content@app.user':{
                    template: '<ui-view/>'
                }
            },
            resolve: {
                authenticate: function (authenticationSvc) {
                    return authenticationSvc.requireLogin();
                },
                loopList: function(authenticate, Restangular, authenticationSvc) {
                    var header = authenticationSvc.getHeader();
                    // return Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST({"userId": 1}, '', {}, header).then(function(data){
                    //     return data;
                    // });
                    return 1
                },
            }
        })
        .state('app.user.homefeed', {
            url:'/homefeed',
            views:{
                'content@app.user':{
                    templateUrl:'public/app/user/homefeed/homefeed.html'
                    ,controller:'homefeedController'
                }
            },
            resolve: {
                newsfeed: function(authenticate, Restangular, authenticationSvc) {
                    var header = authenticationSvc.getHeader();
                    return Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST({"loopId": 1}, '', {}, header).then(function(data){
                        return data;
                    });
                    // return 1
                },
            }
        })
        .state('app.user.question',{
            url:'/question',
            views:{
                'content@app.user':{
                    templateUrl:'public/app/user/questiondetail/questiondetail.html',
                    controller:'questionController'
                }
            }
        })
        .state('app.user.post',{
            url:'/post',
            views:{
                'content@app.user':{
                    templateUrl:'public/app/user/postdetail/postdetail.html',
                    controller:'postController'
                }
            }
        })
        .state('app.user.album',{
            url:'/album',
            views:{
                'content@app.user':{
                    templateUrl:'public/app/user/albumdetail/albumdetail.html',
                    controller:'albumController'
                }
            }
        })
        .state('app.user.profile',{
            url:'/profile',
            views:{
                'content@app.user':{
                    templateUrl:'public/app/user/profile/profile.html',
                    controller:'profileController'
                }
            }
        })         
});

loopApp.factory("authenticationSvc", function($q, $localStorage, $state, $timeout) {
    return {
        requireLogin: function () {
            //if ($localStorage['owloopAuth']) {
            if (1) {
                return $q.when();
            }else {
                $timeout(function() {
                  $state.go('app.auth.signup');
                });
                return $q.reject();
            }
        },

        getHeader: function () {
            var header = {
                'Content-type': 'application/json',
                'ApplicationKey': 'HuDNpU8EjgJJhsSV',
                'CustomerId': '',
                'AuthenKey':'',
                'BuildNumber': '',
                'Os': 0,
                'X-Requested-With': 'XMLHttpRequest'              
            };
            return header;
        }
    }
})
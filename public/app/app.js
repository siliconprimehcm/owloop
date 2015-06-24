var loopApp = angular.module('loopApp',[

    'restangular'
    ,'ngStorage'

    ,'owloop.auth'
    ,'owloop.user'
    ,'owloop.landingPage'
    
]);

loopApp.config(function($httpProvider, RestangularProvider) {
          
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    RestangularProvider.setBaseUrl('http://owloopstaging-api.azurewebsites.net');
});

loopApp.factory("authenticationSvc", function($q, $localStorage, $state, $timeout) {
    return {
        requireLogin: function () {
            debugger;
            if ($localStorage['authenticate']) {
            //if (1) {
                return $q.when();
            }else {
                $timeout(function() {
                  $state.go('signup')
                });
                return $q.reject();
            }
        }
    }
})
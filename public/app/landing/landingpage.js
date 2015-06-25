var landingPageModule = angular.module('owloop.landingPage', []);

landingPageModule.controller('landingPageController', function($scope, $state) {
    
    $scope.goSignupScreen = function(){
        $state.go('signup');
    }
     
});
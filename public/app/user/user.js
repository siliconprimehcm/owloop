var userModule = angular.module('owloop.user', []);

userModule.controller('layoutController', function ($scope, loopList, $localStorage, $state) {
    $scope.userData = $localStorage['owloopAuth'];


    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };
});

userModule.controller('leftbarController', function ($scope, publicCategories) {
    $scope.publicCategories = publicCategories;
});

userModule.controller('rightbarController', function ($scope, loopPopulars) {
    debugger;
    console.log('rightbarController');
    $scope.loopPopulars = loopPopulars;
});

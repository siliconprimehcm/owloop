var userModule = angular.module('owloop.user', []);

userModule.controller('layoutController', function ($scope,  $localStorage, $state) {
    $scope.userData = $localStorage['owloopAuth'];


    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };
});

userModule.controller('leftbarController', function ($scope,  privateLoops, publicLoops) {
    debugger;
    var pubLoops = [];
    var priLoops = [];
    if (privateLoops.statusCode == 0) {
        for (var i = 0; i < privateLoops.objectValue.data.length; i++) {
            priLoops.push(privateLoops.objectValue.data[i]);
        }
    }
    if (publicLoops.statusCode == 0) {
        for (var i = 0; i < publicLoops.objectValue.data.length; i++) {
            pubLoops.push(publicLoops.objectValue.data[i]);
        }
    }
    $scope.publicLoops = pubLoops;
    $scope.privateLoops = priLoops;
});

userModule.controller('rightbarController', function ($scope, loopPopulars) {
    debugger;
    console.log('rightbarController');
    $scope.loopPopulars = loopPopulars;
});

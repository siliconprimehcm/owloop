var userModule = angular.module('owloop.user', []);

userModule.controller('layoutController', function ($scope, loopList, $localStorage, $state) {
    $scope.userData = $localStorage['owloopAuth'];


    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };
});

userModule.controller('leftbarController', function ($scope, loopList) {
    debugger;
    var pubLoops = [];
    var priLoops = [];
    if (loopList.statusCode == 0) {
        for (var i = 0; i < loopList.objectValue.data.length; i++) {
            if (loopList.objectValue.data[i].type == 0) {
                pubLoops.push(loopList.objectValue.data[i]);
            } else {
                priLoops.push(loopList.objectValue.data[i]);
            }
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

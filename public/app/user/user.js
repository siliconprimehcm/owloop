var userModule = angular.module('owloop.user', []);

userModule.controller('layoutController', function ($scope, Restangular, $localStorage, $state, authenticationSvc) {
    $scope.userData = $localStorage['owloopAuth'];

    $scope.postModel = {
        loopId: 0,
        title: '',
        content: '',
        type: 0,
        photo: [],
        isAnonymous:false
    };
    var header = authenticationSvc.getHeader();
    $scope.idAddPost = {

        submit: function (form) {
            Restangular.one('/v1/Post/CreateUpdatePost').customPOST($scope.postModel, '', {}, header).then(function (data) {
                console.log(data);
                debugger;
                if (data && data.objectValue) {
                   
                } else {
                  
                }
            });
        }
    };
    
    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };
    
    $scope.OpenModalAddPost = function (name) {
        debugger;
        
        $scope.userLoops = $localStorage.userLoops;
        $('#' + name).modal('show');
    };
});

userModule.controller('leftbarController', function ($scope, privateLoops, publicLoops, $localStorage) {
    debugger;
    var pubLoops = [];
    var priLoops = [];
    var userLoops = [];
    if (privateLoops.statusCode == 0) {
        for (var i = 0; i < privateLoops.objectValue.data.length; i++) {
            priLoops.push(privateLoops.objectValue.data[i]);
            userLoops.push(privateLoops.objectValue.data[i]);
        }
    }
    if (publicLoops.statusCode == 0) {
        for (var i = 0; i < publicLoops.objectValue.data.length; i++) {
            pubLoops.push(publicLoops.objectValue.data[i]);
            userLoops.push(publicLoops.objectValue.data[i]);
        }
    }
    $scope.publicLoops = pubLoops;
    $scope.privateLoops = priLoops;
    $localStorage.userLoops = userLoops;
});

userModule.controller('rightbarController', function ($scope, loopPopulars) {
    debugger;
    console.log('rightbarController');
    $scope.loopPopulars = loopPopulars;
});

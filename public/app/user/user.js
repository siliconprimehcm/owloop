var userModule = angular.module('owloop.user', ['owloop.user.loop', 'infinite-scroll', 'validation', 'validation.rule', 'server-validate']);
userModule.controller('leftbarController', function ($scope, privateLoops, publicLoops, $localStorage) {
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
    console.log('rightbarController');
    $scope.loopPopulars = loopPopulars;
});
userModule.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


//userModule.factory('loopInLayoutService', function($http, $log, $q, Restangular) {
//    return {
//        getPopularLoops: function(header, param) {
//            var deferred = $q.defer();
//            var popularLoops = [];

//            Restangular.one('/v1/Loop/GetPopularLoop').customPOST(param, '', {}, header).then(function(data) {
//                if (data.statusCode == 0) {
//                    for (var i = 0; i < data.objectValue.data.length; i++) {
//                        popularLoops.push(data.objectValue.data[i]);
//                    }
//                    deferred.resolve({ popularLoops: popularLoops });
//                }
//            }, function(msg, code) {
//                deferred.reject(msg);
//                $log.error(msg, code);
//            });

//            return deferred.promise;
//        }
//    };
//});

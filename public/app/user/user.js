var userModule = angular.module('owloop.user', ['owloop.user.profile', 'owloop.user.loop', 'infinite-scroll', 'validation', 'validation.rule', 'server-validate', 'ngImgCrop']);

userModule.controller('leftbarController', function ($scope, Restangular, authenticationSvc, $localStorage, $state, publicLoops, privateLoops) {
    
    $scope.privateLoops = privateLoops.objectValue.data;
    $scope.publicLoops = publicLoops.objectValue.data;
    userLoops = $scope.privateLoops.concat($scope.publicLoops);

    $localStorage.userLoops = userLoops;

    $scope.gotoThisLoop = function(loop){
        console.log(loop);
        $state.go('app.user.loop.newfeed', {'loopId': loop.loopId});
    }
});

userModule.controller('rightbarController', function ($scope, Restangular, authenticationSvc) {

    getPopularLoop();
    function getPopularLoop(){
        var header = authenticationSvc.getHeader();
        var param = {
            "pageSize": 10
        };

        Restangular.one('/v1/Loop/GetPopularLoop').customPOST(param, '', {}, header).then(function (data) {
            $scope.loopPopulars = data.objectValue.data;
            
        });
    };

});

userModule.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

userModule.directive('feedTemplate', function () {
    return {
        restrict: 'E',
        scope: {
            feed: "=feed"
        },
        templateUrl: 'public/app/user/share/templates/feed_template.html',
    }
})


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


var userModule = angular.module('owloop.user');

userModule.controller('homefeedController', function ($rootScope, $scope, authenticationSvc, Restangular, feedService) {
    console.log('homefeedController');
    $rootScope.feedHome = [];
    $rootScope.lastUpdateFeed = 0;
    $scope.hasMore = true;
    $scope.busyLoading = false;
    var header = authenticationSvc.getHeader();
    var param = {
        "pageSize": 7,
        "getComment": false,
        "commentPageSize": 3
    };

    $scope.loadMoreFeed = function () {
        if ($scope.busyLoading) return;
        $scope.busyLoading = true;
        param.lastUpdate = $rootScope.lastUpdateFeed;

        var promise = feedService.getFeed(header, param);
        if ($scope.hasMore) {
            promise.then(function (result) {
                $scope.hasMore = result.hasMore;
                $rootScope.lastUpdateFeed = result.lastUpdate;
                for (var i = 0; i < result.data.length; i++) {


                    $rootScope.feedHome.push(result.data[i]);
                }
                $scope.busyLoading = false;
            });
        } else {
            $scope.busyLoading = false;
        }
    };
});

userModule.factory('feedService', function ($q, Restangular) {
    return {
        getFeed: function (header, param) {
            var deferred = $q.defer();

            Restangular.one('/v1/Feed/GetFeeds').customPOST(param, '', {}, header).then(function (result) {
                deferred.resolve({
                    data: result.objectValue.data,
                    lastUpdate: result.objectValue.lastUpdate,
                    hasMore: result.objectValue.hasMore,
                    firstUpdate: result.objectValue.firstUpdate,
                    statusCode: result.objectValue.statusCode
                });
            });

            return deferred.promise;
        }
    }
})


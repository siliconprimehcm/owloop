var userModule = angular.module('owloop.user');

userModule.controller('homefeedController', function ($rootScope, $scope, authenticationSvc, Restangular, feedService) {
    console.log('homefeedController');
    $rootScope.questionsPosts = [];
    $rootScope.posts = [];
    $rootScope.loopPopulars = [];

    var header = authenticationSvc.getHeader();
    var param = {
        "loopId": 1
    };

    $scope.loadMoreFeed = function () {
        var promise = feedService.getFeed(header, param);
        promise.then(function (result) {
            for (var i = 0; i < result.questionsPosts.length; i++) {
                $rootScope.questionsPosts.push(result.questionsPosts[i]);
            }
            for (var i = 0; i < result.posts.length; i++) {
                $rootScope.posts.push(result.posts[i]);
            }
        });
    };
});
userModule.factory('feedService', function ($q, Restangular) {
    return {
        getFeed: function (header, param) {
            var deferred = $q.defer();

            Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST(param, '', {}, header).then(function (data) {
                deferred.resolve({
                    questionsPosts: data.objectValue.questionsPosts,
                    posts: data.objectValue.posts,
                    loopPopulars: data.objectValue.loopPopulars
                });
            });

            return deferred.promise;
        }
    }
})


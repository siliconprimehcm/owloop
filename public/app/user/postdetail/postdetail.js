var userModule = angular.module('owloop.user');

userModule.controller('postController', function ($scope, Restangular, authenticationSvc, $stateParams, likeUnlinkeService) {
    $scope.postItem = {};
    $scope.stateLike = false;

    var header = authenticationSvc.getHeader();
    var param = {
        "postId": $stateParams.postId,
        "pageSizeComment": 10,
    }
    Restangular.one('/v1/Post/GetPostById').customPOST(param, '', {}, header).then(function (result) {
        $scope.postItem = result.objectValue;
        $scope.stateLike = $scope.postItem.like;
    });
     
    $scope.LikeUnlike = function (state) {
        var param = {
            "postId": $stateParams.postId,
            "unlike": !state
        }
        $scope.stateLike = !state;
        //var promise = likeUnlinkeService.updateLikeUnilike(header, param);
        //promise.then(function (result) {
        //    $scope.stateLike = !state;
        //});
    }
});

userModule.filter('iif', function () {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

userModule.factory('likeUnlinkeService', function ($q, Restangular) {
    return {
        updateLikeUnilike: function (header, param) {
            var deferred = $q.defer();

            Restangular.one('/v1/Post/LikeUnlike').customPOST(param, '', {}, header).then(function (result) {
                deferred.resolve({
                    data: result.objectValue,
                });
            });

            return deferred.promise;
        }
    }
})

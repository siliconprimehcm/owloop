var userModule = angular.module('owloop.user');

userModule.controller('postController', function ($scope, Restangular, authenticationSvc, $stateParams) {
    $scope.postItem = {};

    var header = authenticationSvc.getHeader();
    var param = {
        "postId": $stateParams.postId,
        "pageSizeComment": 10,
    }
    Restangular.one('/v1/Post/GetPostById').customPOST(param, '', {}, header).then(function (result) {
        $scope.postItem = result.objectValue;
    });
});

userModule.filter('iif', function () {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

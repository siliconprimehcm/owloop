var userModule = angular.module('owloop.user');

userModule.controller('loopController', function ($scope, Restangular, authenticationSvc) {
    console.log('loopController');
    $scope.posts = []

    getAllPosts(1, function(err, result){
        $scope.posts = result;
    })

    $scope.createPost = function(){
        Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            $scope.posts
        });
    }

    function getAllPosts(loopId, cb){
        var header = authenticationSvc.getHeader();
        var param = {
            "loopId":loopId
        };
        Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            cb(data)
        });
    }
});

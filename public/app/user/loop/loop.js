var userModule = angular.module('owloop.user');

userModule.controller('loopController', function ($scope, Restangular, authenticationSvc) {
    var header = authenticationSvc.getHeader();

    console.log('loopController');
    $scope.posts = []

    getAllPosts(1, function(err, result){
        $scope.posts = result;
    })

    $scope.createPost = function(){
        var param = {
            "loopId":loopId
        };
        Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            $scope.posts
        });
    }

    function getAllPosts(loopId, cb){
        var param = {
            "loopId":loopId
        };
        Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            cb(data)
        });
    }
});

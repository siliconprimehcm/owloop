var loopProfileModule = angular.module('owloop.user.search');

loopProfileModule.controller('searchpeopleController', function ($scope, Restangular, $localStorage, authenticationSvc, $stateParams, $state) {
    var header = authenticationSvc.getHeader();
    $scope.timeLastUpdate = 0;
    $scope.isHasMore = false;
    var param = {
        "keyword": $stateParams.keyword,
        "lastUpdate": $scope.timeLastUpdate,
        "pageSize": 10
    };
    Restangular.one('/v1/Search/SearchPeople').customPOST(param, '', {}, header).then(function (data) {
        if (data.statusCode ==0) {
            $scope.peoples = data.objectValue.data;
            $scope.timeLastUpdate = data.objectValue.lastUpdate;
            $scope.isHasMore = data.objectValue.hasMore;
        } else {
            $scope.peoples = [];
            $scope.timeLastUpdate = 0;
            $scope.isHasMore = false;
        }
    });
    
    $scope.loadMorePeople = function () {
        param = {
            "keyword": $stateParams.keyword,
            "lastUpdate": $scope.timeLastUpdate,
            "pageSize": 10
        };

        Restangular.one('/v1/Search/SearchPeople').customPOST(param, '', {}, header).then(function (data) {
            if (data.statusCode == 0) {
                if (data.objectValue.data.length > 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        $scope.peoples.push(data.objectValue.data[i]);
                        $scope.timeLastUpdate = data.objectValue.lastUpdate;
                        $scope.isHasMore = data.objectValue.hasMore;
                    }
                } else {
                    $scope.isHasMore = false;
                }
            }
        });
    };
    
    $scope.gotoProfile= function(userId) {
        $state.go('app.user.profile.activity', { 'userId': userId });
    }
});

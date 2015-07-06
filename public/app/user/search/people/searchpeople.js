var loopProfileModule = angular.module('owloop.user.search');

loopProfileModule.controller('searchpeopleController', function ( $scope, Restangular, $localStorage, authenticationSvc, $stateParams) {
    var header = authenticationSvc.getHeader();
    $scope.timeLastUpdate = 0;
    var param = {
        "keyword": $stateParams.keyword,
        "lastUpdate": $scope.timeLastUpdate,
        "pageSize": 10
    };
    Restangular.one('/v1/Search/SearchPeople').customPOST(param, '', {}, header).then(function (data) {
        if (data.statusCode ==0) {
            $scope.peoples = data.objectValue.data;
            $scope.timeLastUpdate = data.objectValue.lastUpdate;
        } else {
            $scope.peoples = [];
            $scope.timeLastUpdate = 0;
        }
    });
    
});

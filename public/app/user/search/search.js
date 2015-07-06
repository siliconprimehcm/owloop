
var userModule = angular.module('owloop.user.search', []);
userModule.controller('searchController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService, $stateParams) {
 
    var header = authenticationSvc.getHeader();
    var param1 = {
        "lastUpdate": 0,
        "pageSize": 50,
        "keyword": "",
        "loopType": 0,
        "getNotifCount": true
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(param1, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            $scope.publicLoops = data.objectValue.data;
        } else {
            $scope.publicLoops = [];
        }
    });
    var param2 = {
        "lastUpdate": 0,
        "pageSize": 50,
        "keyword": "",
        "loopType": 1,
        "getNotifCount": true
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(param2, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            $scope.privateLoops = data.objectValue.data;
        } else {
            $scope.privateLoops = [];
        }
    });
    
    var paramPopularLoops = {
        "pageSize": 10
    };
    
    Restangular.one('/v1/Loop/GetPopularLoop').customPOST(paramPopularLoops, '', {}, header).then(function (data) {
        if (data.statusCode == 0)
            $scope.loopPopulars= data.objectValue.data;
        else
            $scope.loopPopulars= [];
    });
    
    $scope.publicLoops = function (authenticate, Restangular, authenticationSvc) {
        param.loopType = 0;
        return Restangular.one('/v1/Loop/GetMyLoop').customPOST(param, '', {}, header).then(function(data) {
            return data;
        });
    };

    $scope.privateLoops = function (authenticate, Restangular, authenticationSvc) {
        param.loopType = 1;
        return Restangular.one('/v1/Loop/GetMyLoop').customPOST(param, '', {}, header).then(function(data) {
            return data;
        });
    };
});

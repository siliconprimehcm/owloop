var userModule = angular.module('owloop.user');

userModule.controller('searchController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
 
    var header = authenticationSvc.getHeader();
 
    var categoryIdRemind = 0;

    var header = authenticationSvc.getHeader();
 
    var param = {
        "lastUpdate": 0,
        "pageSize": 10,
        "keyword": "",
        "getNotifCount": true,
        "loopType": 0
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(paramPublicLoops, '', {}, header).then(function (data) {
        $scope.publicLoops = data.objectValue.data;
    });
    
    var paramPrivateLoops = {
        "lastUpdate": 0,
        "pageSize": 10,
        "keyword": "",
        "getNotifCount": true,
        "loopType": 1
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(paramPrivateLoops, '', {}, header).then(function (data) {
        $scope.privateLoops = data.objectValue.data;
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

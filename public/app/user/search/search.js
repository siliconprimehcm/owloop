var userModule = angular.module('owloop.user');

userModule.controller('searchController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
 
    var categoryIdRemind = 0;

    var header = authenticationSvc.getHeader();
 
    var param = {
        "lastUpdate": 0,
        "pageSize": 10,
        "keyword": "",
        "getNotifCount": true,
    };


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

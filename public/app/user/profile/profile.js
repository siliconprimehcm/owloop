var userModule = angular.module('owloop.user');

userModule.controller('profileController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
    var header = authenticationSvc.getHeader();

  
    Restangular.one('/v1/Customer/GetProfile').customPOST({}, '', {}, header).then(function (data) {
        var userData = data.objectValue;
        if (userData && (!userData.avatarUrl || userData.avatarUrl == '')) {
            userData.avatarUrl = '/public/images/item/item_avatar_default.png';
        }
        $scope.userData = userData;
    });
    var paramPublicLoops = {
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
            $scope.loopPopulars = data.objectValue.data;
        else
            $scope.loopPopulars = [];
    });
});

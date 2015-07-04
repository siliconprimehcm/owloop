var loopProfileModule = angular.module('owloop.user.profile');

loopProfileModule.controller('loopProfileController', function ( $scope, Restangular, $localStorage, authenticationSvc, $stateParams) {
    var header = authenticationSvc.getHeader();
    $scope.timeLastUpdate = 0;
    var customerId = '';
    if ($stateParams.userId) {
        customerId = $stateParams.userId;
    } else {
        customerId =  $localStorage['owloopAuth'].customerId;
    }
    
    var paramProfile = {
        "customerId": customerId
    };
    Restangular.one('/v1/Customer/GetProfile').customPOST(paramProfile, '', {}, header).then(function (data) {
        var userData = data.objectValue;
        if (userData && (!userData.avatarUrl || userData.avatarUrl == '')) {
            userData.avatarUrl = '/public/images/item/item_avatar_default.png';
        }
        $scope.userData = userData;
    });
    
    var param = {
        "lastUpdate": 0,
        "pageSize": 10,
        "keyword": "",
        "friendId": customerId
    };
    Restangular.one('/v1/Loop/GetFriendLoop').customPOST(param, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            $scope.loopOfCategorys = data.objectValue.data;
            $scope.timeLastUpdate = data.objectValue.lastUpdate;
        } else {
            $scope.loopOfCategorys = [];
            $scope.timeLastUpdate = 0;
        }
    });
   
    $scope.loadMore = function () {
        param = {
            "lastUpdate": $scope.timeLastUpdate,
            "pageSize": 10,
            "keyword": "",
            "friendId": customerId
        };
        Restangular.one('/v1/Loop/GetFriendLoop').customPOST(param, '', {}, header).then(function (data) {
            if (data.statusCode == 0) {
                if (data.objectValue.data.length > 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        $scope.loopOfCategorys.push(data.objectValue.data[i]);
                    }
                    $scope.timeLastUpdate = data.objectValue.lastUpdate;
                }
            }
        });
    };
});

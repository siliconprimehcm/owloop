var activeProfileModul = angular.module('owloop.user.profile');

activeProfileModul.controller('activityprofileController', function ($rootScope, $scope, Restangular, $localStorage, authenticationSvc, $stateParams) {
    var header = authenticationSvc.getHeader();
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
    
});

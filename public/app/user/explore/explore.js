var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($scope, Restangular, authenticationSvc) {
    console.log('exploreController');
    
    var header = authenticationSvc.getHeader();
    var param = {};
    Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function(data) {
    	$scope.loopCategories = data.objectValue.data;
    })

    $scope.selectThisLoop = function(loopId){
        console.log(loopId);
    }

});

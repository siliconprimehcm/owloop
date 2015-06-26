var userModule = angular.module('owloop.user');

userModule.controller('loopController', function ($scope, Restangular, authenticationSvc) {
    console.log('loopController');
    var header = authenticationSvc.getHeader();
    var param = {};
    return Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
        debugger
        return data;
    });
    //$scope.loopCategories = loopCategories;
    //$scope.selectThisLoop = function(loopId){
    //    console.log(loopId);
    //}

});

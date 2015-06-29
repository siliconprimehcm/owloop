var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($scope, Restangular, authenticationSvc) {
    console.log('exploreController');

    var header = authenticationSvc.getHeader();
    var param = {
        getLoopData: true,
        pageSize: 10
    };
    Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function(data) {
        if (data.statusCode == 0) {
            if (data.objectValue.data.length > 0) {
                var loopCategories = [];
                for (var i = 0; i < data.objectValue.data.length; i++) {
                    loopCategories.push(data.objectValue.data[i]);
                }
                $scope.loopCategories = loopCategories;
            } else {
                $scope.loopCategories = [];
            }
            if (data.objectValue.firstLoops.data.length > 0) {
                var loopOfCategorys = [];
                for (var i = 0; i < data.objectValue.firstLoops.data.length; i++) {
                    loopOfCategorys.push(data.objectValue.firstLoops.data[i]);
                }
                $scope.loopOfCategorys = loopOfCategorys;
            } else {
                $scope.loopOfCategorys = [];
            }
        }
    });

    $scope.getLoopOfCategories = function (categoryId) {
        var param1 = {
            "categoryId": categoryId,
            "lastUpdate": 0,
            "pageSize": 10,
            "keyword": ""
        };
        $scope.loopOfCategorys = {};
        //Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param1, '', {}, header).then(function (data) {
        //    debugger;
        //    if (data.statusCode == 0) {
        //        var loopOfCategorys = [];
        //        for (var i = 0; i < data.objectValue.data.length; i++) {
        //            loopOfCategorys.push(data.objectValue.data[i]);
        //        }
        //        $scope.loopOfCategorys = loopOfCategorys; 
        //    }
        //    else {
        //        $scope.loopOfCategorys = [];
        //    }
        //});
    };
});

var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
    console.log('exploreController');
    $rootScope.loopOfCategorys = [];
    $scope.loopCategories = [];
    var categoryIdRemind = 0;
    $rootScope.timeLastUpdate = 0;

    var header = authenticationSvc.getHeader();
    var param = {
        getLoopData: true,
        pageSize: 10
    };

    Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            var loopCategories = [];

            if (data.objectValue.data.length > 0) {
                for (var i = 0; i < data.objectValue.data.length; i++) {
                    loopCategories.push(data.objectValue.data[i]);
                }
                $scope.loopCategories = loopCategories;
            }

            var loopOfCategorys = [];
            if (data.objectValue.firstLoops.data.length > 0) {

                for (var i = 0; i < data.objectValue.firstLoops.data.length; i++) {
                    loopOfCategorys.push(data.objectValue.firstLoops.data[i]);
                    categoryIdRemind = data.objectValue.firstLoops.data[0].categoryId;
                }
                $rootScope.loopOfCategorys = loopOfCategorys;
                
            }

        }
    });

    $scope.getLoopOfCategories = function (categoryId) {
        $rootScope.timeLastUpdate = 0;
        categoryIdRemind = categoryId;
        var param = {
            "categoryId": categoryId,
            "lastUpdate": 0,
            "pageSize": 5,
            "keyword": ""
        };

        var promise = loopInCategoryService.getLoopInCategoryService(header, param);
        promise.then(function (result) {
            $rootScope.loopOfCategorys = result.resultLoopOfCategorys;
            $rootScope.timeLastUpdate = result.resultLastUpdate;
        }, function (errorResult) {
            $log.error('failure load', errorResult);
        });
    };

   
    
    $scope.loadMore = function () {

        var param = {
            "categoryId": categoryIdRemind,
            "lastUpdate": $rootScope.timeLastUpdate,
            "pageSize": 5,
            "keyword": ""
        };

        Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param, '', {}, header).then(function (data) {
            if (data.statusCode == 0) {
                if (data.objectValue.data.length > 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        $rootScope.loopOfCategorys.push(data.objectValue.data[i]);
                    }
                    $rootScope.timeLastUpdate = data.objectValue.lastUpdate;
                }
            }
        });
    };
    
});

userModule.factory('loopInCategoryService', function ($http, $log, $q, Restangular) {
    return {
        getLoopInCategoryService: function (header, param) {
            var deferred = $q.defer();
            var loopOfCategorys = [];

            Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param, '', {}, header).then(function (data) {
                if (data.statusCode == 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        loopOfCategorys.push(data.objectValue.data[i]);
                    }
                    deferred.resolve({ resultLoopOfCategorys: loopOfCategorys, resultLastUpdate: data.objectValue.lastUpdate });
                    console.log(loopOfCategorys, ":::")
                }
            }, function (msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });

            return deferred.promise;
        }
    }
})

//var userModule = angular.module('owloop.user');

//userModule.controller('exploreController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
//    console.log('exploreController');
//    $rootScope.loopOfCategorys = [];
//    $scope.loopCategories = [];

//    var header = authenticationSvc.getHeader();
//    var param = {
//        getLoopData: true,
//        pageSize: 10
//    };
//    var promise = loopInCategoryService.getLoopInCategoryService(header, param);
//    promise.then(function (result) {
//        $rootScope.loopOfCategorys = result.resultLoopOfCategorys;
//        $scope.loopCategories = loopCategories;
//    });

//    $scope.getLoopOfCategories = function (categoryId) {
//        var param = {
//            "categoryId": categoryId,
//            "lastUpdate": 0,
//            "pageSize": 10,
//            "keyword": ""
//        };
//        var promise = loopInCategoryService.getLoopInCategoryService(header, param);
//        promise.then(function (result) {
//            $rootScope.loopOfCategorys = result.resultLoopOfCategorys;
//        });
//    };

//});

//userModule.factory('loopInCategoryService', function ($q, Restangular) {
//    return {
//        getLoopInCategoryService: function (header, param) {
//            var deferred = $q.defer();
//            var loopOfCategorys = [], loopCategories = [];

//            Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param, '', {}, header).then(function (data) {
//                if (data.statusCode == 0) {
//                    for (var i = 0; i < data.objectValue.data.length; i++) {
//                        loopOfCategorys.push(data.objectValue.data[i]);
//                    }
//                    for (var i = 0; i < data.objectValue.data.length; i++) {
//                        loopCategories.push(data.objectValue.data[i]);
//                    }
//                    deferred.resolve({ resultLoopOfCategorys: loopOfCategorys, resultLoopCategories: loopCategories });
//                    console.log(":::", loopOfCategorys)
//                }
//            });
//            return deferred.promise;
//        }
//    }
//})
var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
    console.log('exploreController');
    $rootScope.loopOfCategorys = [];
    $scope.loopCategories = [];
    $scope.categoryIdRemind = 0;

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
                }
                $rootScope.loopOfCategorys = loopOfCategorys;
                
            }

        }
    });

    $scope.getLoopOfCategories = function (categoryId) {
        $scope.categoryIdRemind = categoryId;
        var param = {
            "categoryId": categoryId,
            "lastUpdate": 0,
            "pageSize": 3,
            "keyword": ""
        };

        var promise = loopInCategoryService.getLoopInCategoryService(header, param);
        promise.then(function (result) {
            $rootScope.loopOfCategorys = result.resultLoopOfCategorys;
        }, function (errorResult) {
            $log.error('failure load', errorResult);
        });
    };

    var timeLastUpdate = 0;
    
    $scope.loadMore = function () {

        var param = {
            "categoryId": 1,
            "lastUpdate": timeLastUpdate,
            "pageSize": 3,
            "keyword": ""
        };

        Restangular.one('/v1/Loop/GetLoopCategory').customPOST(param, '', {}, header).then(function (data) {
            if (data.statusCode == 0) {
                var loopOfCategorys = [];
                if (data.objectValue.firstLoops.data.length > 0) {

                    for (var i = 0; i < data.objectValue.firstLoops.data.length; i++) {
                        $rootScope.loopOfCategorys.push(data.objectValue.firstLoops.data[i]);
                    }
                    timeLastUpdate = result.resultLastUpdate;
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
            var loopCategories = [];

            Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param, '', {}, header).then(function (data) {
                if (data.statusCode == 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        loopOfCategorys.push(data.objectValue.data[i]);
                    }

                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        loopCategories.push(data.objectValue.data[i]);
                    }

                    deferred.resolve({ resultLoopOfCategorys: loopOfCategorys, resultLoopCategories: loopCategories, resultLastUpdate: data.objectValue.lastUpdate });
                    console.log(loopOfCategorys, ":::", loopCategories)
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
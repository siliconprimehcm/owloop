var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService) {
    console.log('exploreController');
    $rootScope.loopOfCategorys = [];
    $scope.loopCategories = [];
    $rootScope.timeLastUpdate = 0;
    $rootScope.categoryIdRemind = 0;
    var header = authenticationSvc.getHeader();
    var  param = {
        pageSize: 10
    };
    Restangular.one('/v1/Loop/GetPopularLoop').customPOST(param, '', {}, header).then(function (data) {
        if (data.statusCode == 0)
            $scope.loopPopulars = data.objectValue.data;
        else
            $scope.loopPopulars = [];
    });
   
    param = {
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
                $rootScope.categoryIdRemind = data.objectValue.firstLoops.data[0].categoryId;
                $rootScope.loopOfCategorys = loopOfCategorys;
                
            }
        }
    });

    $scope.getLoopOfCategories = function (categoryId) {
        $rootScope.timeLastUpdate = 0;
       
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
            $rootScope.categoryIdRemind = categoryId;
        }, function (errorResult) {
            $log.error('failure load', errorResult);
            $rootScope.categoryIdRemind = categoryId;
        });
    };

    
    $scope.getPrivateLoopOfCategories = function () {
        $rootScope.timeLastUpdate = 0;
        param = {
            "lastUpdate": 0,
            "pageSize": 10,
            "keyword": ""
        };

        var promise = loopInCategoryService.getPrivateLoopInCategoryService(header, param);
        promise.then(function (result) {
            $rootScope.loopOfCategorys = result.resultLoopOfCategorys;
            $rootScope.timeLastUpdate = result.resultLastUpdate;
            $rootScope.categoryIdRemind = -1;
        }, function (errorResult) {
            $log.error('failure load', errorResult);
            $rootScope.categoryIdRemind = -1;
        });
    };
   
    
    $scope.loadMore = function () {
        if ($rootScope.categoryIdRemind == -1) {
            param = {
                "lastUpdate": $rootScope.timeLastUpdate,
                "pageSize": 10,
                "keyword": ""
            };
            Restangular.one('/v1/Loop/GetRecommendLoop').customPOST(param, '', {}, header).then(function (data) {
                if (data.statusCode == 0) {
                    if (data.objectValue.data.length > 0) {
                        for (var i = 0; i < data.objectValue.data.length; i++) {
                            $rootScope.loopOfCategorys.push(data.objectValue.data[i]);
                        }
                        $rootScope.timeLastUpdate = data.objectValue.lastUpdate;
                    }
                }
            });
        } else {
            param = {
                "categoryId": $rootScope.categoryIdRemind,
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
        }
    };

    $scope.newLoop = {
        name:'',
        description:'',
        loopId:''
    }
    $scope.createNewLoop = function(){
        var header = authenticationSvc.getHeader();
        var param = {
            "name": $scope.newLoop.name,
            "description": $scope.newLoop.description,
            "avatarFileName": '',
            "OnlyAdminCanPost": false
        };
        
        Restangular.one('/v1/Loop/CreateLoop').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            $scope.newLoop.loopId = data.objectValue.loopId;
            $scope.newLoop.name = '';
            $scope.newLoop.description = '';
            getUserFriend();
        });
    };

    $scope.inviteFriendJoinLoop = function(){
        var header = authenticationSvc.getHeader();
        var param = {
            "loopId": $scope.newLoop.loopId,
            "friendIds": listInviteIds
        };
        
        Restangular.one('/v1/Loop/InviteJoinLoop').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            $(function () {
               $('#modalInviteFriendToNewLoop').modal('toggle');
            });
        });
    };

    var listInviteIds = [];
    $scope.inviteClick = function(id){
        console.log(id);
        for(var i=0; i<listInviteIds.length; i++){
            if(id == listInviteIds[i]){
                listInviteIds.splice(i, 1);
                break;
            }else{
                if(i == listInviteIds.length - 1){
                    listInviteIds.push(id)
                }
            }
        }
    };

    function getUserFriend(){

        var param = {
            "lastUpdate": 0,
            "pageSize": 100,
            "keyword": "keyword",
            "followType": 0,
        };
        
        Restangular.one('/v1/Customer/GetMyFriend').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
            $scope.friends = data.objectValue.data;
            $(function () {
               $('#modalCreateNewLoop').modal('toggle');
               $('#modalInviteFriendToNewLoop').modal('toggle');
            });
        });
    }
    
});

userModule.factory('loopInCategoryService', function ($http, $log, $q, Restangular) {
    return {
        getLoopInCategoryService: function(header, param) {
            var deferred = $q.defer();
            var loopOfCategorys = [];

            Restangular.one('/v1/Loop/GetLoopInCategory').customPOST(param, '', {}, header).then(function(data) {
                if (data.statusCode == 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        loopOfCategorys.push(data.objectValue.data[i]);
                    }
                    deferred.resolve({ resultLoopOfCategorys: loopOfCategorys, resultLastUpdate: data.objectValue.lastUpdate });
                    console.log(loopOfCategorys, ":::")
                }
            }, function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });

            return deferred.promise;
        },
        getPrivateLoopInCategoryService: function (header, param) {
            var deferred = $q.defer();
            var loopOfCategorys = [];

            Restangular.one('/v1/Loop/GetRecommendLoop').customPOST(param, '', {}, header).then(function (data) {
                if (data.statusCode == 0) {
                    for (var i = 0; i < data.objectValue.data.length; i++) {
                        loopOfCategorys.push(data.objectValue.data[i]);
                    }
                    deferred.resolve({ resultLoopOfCategorys: loopOfCategorys, resultLastUpdate: data.objectValue.lastUpdate });
                }
            }, function (msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });

            return deferred.promise;
        }
    };
})

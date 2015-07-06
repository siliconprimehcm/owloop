var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($rootScope, $scope, Restangular, authenticationSvc, loopInCategoryService, Upload, $timeout, $state) {

    $rootScope.loopOfCategorys = [];
    $scope.loopCategories = [];

    $rootScope.timeLastUpdate = 0;
    $rootScope.categoryIdRemind = 0;
    var header = authenticationSvc.getHeader();
    var  param = {
        pageSize: 100
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
            $scope.loopCategories = data.objectValue.data;
            $rootScope.categoryIdRemind = data.objectValue.firstLoops.data[0].categoryId;
            $rootScope.loopOfCategorys = data.objectValue.firstLoops.data;
     
        }
    });

    $scope.getLoopOfCategories = function (category) {

        $state.go('app.user.explore', {'categoryName':category.name });
        $rootScope.timeLastUpdate = 0;
       
        param = {
            "categoryId": category.categoryId,
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
    };

    $scope.joinLoop = function(loopId){
        var header = authenticationSvc.getHeader();
        var param = {
            "loopId": loopId,
            "leaveLoop": false
        };
        
        Restangular.one('/v1/Loop/JoinLoop').customPOST(param, '', {}, header).then(function (data) {
            console.log(data);
        });
    };

    var loopAvatarImage = '';
    $scope.createNewLoop = function(){
        var header = authenticationSvc.getHeader();
        var param = {
            "name": $scope.newLoop.name,
            "description": $scope.newLoop.description,
            "avatarFileName": loopAvatarImage,
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
            $state.go('app.user.loop.newfeed', {loopId: $scope.newLoop.loopId})
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
    };

    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
        console.log('aaaaa')
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
                
            });
        };
        reader.readAsDataURL(file);

    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    
    
    $scope.uploadAvatar = function () {
        var header = authenticationSvc.getHeader();
        delete header['Content-type'];
        console.log($scope.myCroppedImage);
        Upload.upload({
            url: 'http://owloopstaging-api.azurewebsites.net/v1/File/UploadTempPhotos',
            headers: header,

            fields: {
                'username': 'no need'
            },
            file: thisIsMagic($scope.myCroppedImage)
        }).progress(function (evt) {
            
        }).success(function (data, status, headers, config) {
            $timeout(function() {
                loopAvatarImage = data.objectValue.data[0].fileName;
            });
        });
    };


    function thisIsMagic(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
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

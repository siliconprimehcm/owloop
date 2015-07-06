
var userModule = angular.module('owloop.user');

userModule.controller('layoutController', function ($scope, $injector, Restangular, $localStorage, $state, authenticationSvc, Upload, $timeout) {
    var userLoops = [];
    var header = authenticationSvc.getHeader();
    var param1 = {
        "lastUpdate": 0,
        "pageSize": 50,
        "keyword": "",
        "loopType": 0,
        "getNotifCount": true
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(param1, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            $scope.publicLoops = data.objectValue.data;
            for (var i = 0; i < data.objectValue.data.length; i++) {
                userLoops.push(data.objectValue.data[i]);
            }
        } else {
            $scope.publicLoops = [];
        }
    });
    var param2 = {
        "lastUpdate": 0,
        "pageSize": 50,
        "keyword": "",
        "loopType": 1,
        "getNotifCount": true
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(param2, '', {}, header).then(function (data) {
        if (data.statusCode == 0) {
            $scope.privateLoops = data.objectValue.data;
            for (var i = 0; i < data.objectValue.data.length; i++) {
                userLoops.push(data.objectValue.data[i]);
            }
        } else {
            $scope.privateLoops = [];
        }
    });

    //userLoops = $scope.privateLoops.concat($scope.publicLoops);

    $scope.privateLoops = privateLoops.objectValue.data;
    if(publicLoops.objectValue){
        $scope.publicLoops = publicLoops.objectValue.data || [];
    }

    $localStorage.userLoops = userLoops;
    $scope.userLoops = $localStorage.userLoops;
    if (typeof $scope.userLoops == undefined)
    {
        $scope.userLoops = {}
    }
    $scope.fisrtUserLoopName = typeof $scope.userLoops != "undefined" && $scope.userLoops.length>0 ? $scope.userLoops[0].name : "";
    $scope.log = '';
    $scope.photos = [];
    $scope.userData = $localStorage['owloopAuth'];

    $scope.OpenModalAddPost = function (name) {
        $('#' + name).modal('show');
    };

    var loopIdTemp = !$scope.userLoops[0] ? 0 : $scope.userLoops[0].loopId;
    $scope.postModel = {
        loopId: loopIdTemp,
        title: '',
        content: '',
        type: false,
        photos: [],
        isAnonymous: false
    };

    $scope.setLoopValue = function (index) {
        var item = $scope.userLoops[index];
        $scope.postModel.loopId = item.loopId;
        $scope.fisrtUserLoopName = item.name;
    };

    $scope.redirectProfile = function () {
        window.location.href = '#/user/profile/' + $localStorage['owloopAuth'].customerId;
    };

    $scope.submitPostForm = function () {
        if ($scope.postForm.$valid) {
            header = authenticationSvc.getHeader();
            if ($scope.photos.length > 0) {
                for (var i = 0; i < $scope.photos.length; i++) {
                    $scope.postModel.photos.push({
                        fileName: $scope.photos[i].fileName,
                        displayOrder: i,
                        description: ''
                    });
                }
            }

            var param = {
                loopId: $scope.postModel.loopId,
                title: $scope.postModel.title,
                content: $scope.postModel.content,
                photos: $scope.postModel.photos,
                isAnonymous: $scope.postModel.isAnonymous,
                type: $scope.postModel.type == 0 ? false : true
            };

            Restangular.one('/v1/Post/CreateUpdatePost').customPOST(param, '', {}, header).then(function (data) {
                console.log(data);
                if (data && data.objectValue) {
                    var item = {
                        actionType: 10,
                        loop: {
                            "loopId": data.objectValue.loopId,
                            "name": data.objectValue.loopName,
                            "description": data.objectValue.loopDescription,
                            "avatarUrl": data.objectValue.loopAvatarUrl
                        },
                        customer: {
                            "customerId": data.objectValue.customerId,
                            "avatarUrl": data.objectValue.customerAvatarUrl,
                            "fullName": data.objectValue.customerFullname,
                            "username": data.objectValue.customerUsername
                        },
                        post: {
                            "postId": data.objectValue.postId,
                            "title": data.objectValue.title,
                            "content": data.objectValue.content,
                            "isAnonymous": data.objectValue.isAnonymous,
                            "photos": data.objectValue.photos,
                            "totalComment": data.objectValue.totalComment,
                            "totalLike": data.objectValue.totalLike,
                        }
                    }
                    var defaultForm = {
                        loopId: $scope.userLoops[0].loopId,
                        title: '',
                        content: '',
                        type: false,
                        photos: [],
                        isAnonymous: false
                    };

                    $scope.photos = [];
                    $scope.postForm.$setPristine();
                    $scope.postModel = defaultForm;

                    $scope.feedHome.unshift(item);
                    console.log($scope.feedHome)
                }

                $('#modalPostSomething').modal('hide');
            });
        }

    };

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        delete header['Content-type'];
        console.log(files);
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'http://owloopstaging-api.azurewebsites.net/v1/File/UploadTempPhotos',
                    headers: header,
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                }).success(function (data, status, headers, config) {
                    $timeout(function () {
                        $scope.photos.push(data.objectValue.data[0]);
                    });
                });
            }
        }
    };

    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };
});


var userModule = angular.module('owloop.user');

userModule.controller('layoutController', function ($scope, $injector, Restangular, $localStorage, $state, authenticationSvc, Upload, $timeout, privateLoops, publicLoops) {
    var header = authenticationSvc.getHeader();
    $scope.privateLoops = privateLoops.objectValue.data;
    $scope.publicLoops = publicLoops.objectValue.data;
    userLoops = $scope.privateLoops.concat($scope.publicLoops);

    $localStorage.userLoops = userLoops;
    $scope.userLoops = $localStorage.userLoops;
    if (typeof $scope.userLoops == undefined)
    {
        $scope.userLoops = {}
    }
    $scope.fisrtUserLoopName = typeof $scope.userLoops != "undefined" ? $scope.userLoops[0].name : "";
    $scope.log = '';
    $scope.photos = [];
    $scope.userData = $localStorage['owloopAuth'];
    if ($scope.userData && (!$scope.userData.avatarUrl || $scope.userData.avatarUrl == '')) {
        $scope.userData.avatarUrl = '/public/images/item/item_avatar_default.png';
    }



    $scope.OpenModalAddPost = function (name) {
        $('#' + name).modal('show');
    };

    $scope.postModel = {
        loopId: $scope.userLoops[0].loopId,
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

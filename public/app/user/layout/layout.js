
var userModule = angular.module('owloop.user');

userModule.controller('layoutController', function ($scope, $injector, Restangular, $localStorage, $state, authenticationSvc, Upload, $timeout, privateLoops, publicLoops) {
    $scope.fisrtUserLoopName = "";
    $scope.userLoops = $localStorage.userLoops;

    var $validationProvider = $injector.get('$validation');
    var userData = $localStorage['owloopAuth'];
    if (userData && (!userData.avatarUrl || userData.avatarUrl == '')) {
        userData.avatarUrl = '/public/images/item/item_avatar_default.png';
    }
    $scope.userData = userData;
    $scope.postModel = {
        loopId: publicLoops.objectValue.data.length > 0 ? publicLoops.objectValue.data[0].loopId : 0,
        title: '',
        content: '',
        type: 0,
        photo: [],
        isAnonymous: false
    };
    var header = authenticationSvc.getHeader();
    $scope.setLoopValue = function (index) {
        var item = $scope.userLoops[index];
        $scope.postModel.loopId = item.loopId;
        $scope.fisrtUserLoopName = item.name;
    };

    $scope.idAddPost = {
        submit: function (form) {
            var isValid = $validationProvider.checkValid(form);
            if (!isValid) {
                $validationProvider.validate(form);
                return;
            }
            var isAnonymous = false;
            var idx = $scope.selection.indexOf(1);
            if (idx > -1) {
                isAnonymous = true;
            }
            var type = 0;
            idx = $scope.selection.indexOf(0);
            if (idx > -1) {
                type = 1;
            }
            var photo = [];
            if ($scope.photos.length > 0) {
                for (var i = 0; i < $scope.photos.length; i++) {
                    photo.push({
                        fileName: $scope.photos[0].fileName,
                        displayOrder: i,
                        description: ''
                    });
                }
            }
            var model = {
                loopId: $scope.postModel.loopId,
                title: $scope.postModel.title,
                content: $scope.postModel.content,
                photo: photo,
                isAnonymous: isAnonymous,
                type: type
            };
            header = authenticationSvc.getHeader();
            Restangular.one('/v1/Post/CreateUpdatePost').customPOST(model, '', {}, header).then(function (data) {
                console.log(data);
                if (data && data.objectValue) {
                    $scope.feedHome.unshift(data.objectValue);
                    console.log($scope.feedHome)
                } else {

                }

                $('#modalPostSomething').modal('hide');
            });
        }
    };

    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };

    $scope.OpenModalAddPost = function (name) {
        var userLoops = [];
        if (privateLoops.statusCode == 0) {
            for (var i = 0; i < privateLoops.objectValue.data.length; i++) {
                userLoops.push(privateLoops.objectValue.data[i]);
            }
        }
        if (publicLoops.statusCode == 0) {
            for (var i = 0; i < publicLoops.objectValue.data.length; i++) {
                userLoops.push(publicLoops.objectValue.data[i]);
            }
        }
        $scope.userLoops = userLoops;
        $scope.fisrtUserLoopName = $scope.userLoops[0].name;

        var userDataMoal = $localStorage['owloopAuth'];
        if (userDataMoal && (!userDataMoal.avatarUrl || userDataMoal.avatarUrl == '')) {
            userDataMoal.avatarUrl = '/public/images/item/item_avatar_default.png';
        }
        $scope.userDataMoal = userDataMoal;
        $('#' + name).modal('show');
    };
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(postTypeName) {
        var idx = $scope.selection.indexOf(postTypeName);
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        else {
            $scope.selection.push(postTypeName);
        }
    };
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.log = '';

    $scope.multiple = 1;

    $scope.photos = [];
    $scope.upload = function (files) {
        header = authenticationSvc.getHeader();
        delete header['Content-type'];
        console.log(files);
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'http://owloopstaging-api.azurewebsites.net/v1/File/UploadTempPhotos',
                    headers: header,

                    fields: {
                        'username': $scope.username
                    },
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' +
                                evt.config.file.name + '\n' + $scope.log;
                }).success(function (data, status, headers, config) {
                    $timeout(function () {
                        console.log(data.objectValue.data[0].fileName);
                        data.objectValue.data[0]['description'] = '';
                        $scope.photos.push(data.objectValue.data[0]);
                    });
                });
            }
        }
    };

});

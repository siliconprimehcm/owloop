var userModule = angular.module('owloop.user');
userModule.controller('layoutController', function ($scope, Restangular, $localStorage, $state, authenticationSvc, Upload, $timeout) {

    var userData = $localStorage['owloopAuth'];
    if (userData && (!userData.avatarUrl || userData.avatarUrl == '')) {
        userData.avatarUrl = '/public/images/item/item_avatar_default.png';
    }
    $scope.userData = userData;
    $scope.postModel = {
        loopId: 0,
        title: '',
        content: '',
        type: 0,
        photo: [],
        isAnonymous: false
    };
    var header = authenticationSvc.getHeader();
    $scope.idAddPost = {

        submit: function (form) {
            Restangular.one('/v1/Post/CreateUpdatePost').customPOST($scope.postModel, '', {}, header).then(function (data) {
                console.log(data);
                debugger;
                if (data && data.objectValue) {

                } else {

                }
            });
        }
    };

    $scope.logout = function () {
        $localStorage['owloopAuth'] = null;
        $state.go('app.auth.login');
    };

    $scope.OpenModalAddPost = function (name) {
        $scope.userLoops = $localStorage.userLoops;
        var userDataMoal = $localStorage['owloopAuth'];
        if (userDataMoal && (!userDataMoal.avatarUrl || userDataMoal.avatarUrl == '')) {
            userDataMoal.avatarUrl = '/public/images/item/item_avatar_default.png';
        }
        $scope.userDataMoal = userDataMoal;
        $('#' + name).modal('show');
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

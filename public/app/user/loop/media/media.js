var loopModule = angular.module('owloop.user.loop');

loopModule.controller('mediaController', function ($scope, Restangular, authenticationSvc, Upload, $timeout) {
    var header = authenticationSvc.getHeader();
    var param = {
        "loopId": 860,
		"lastUpdate": 0,
		"pageSize": 10
    };

    Restangular.one('/v1/Loop/GetLoopAlbum').customPOST(param, '', {}, header).then(function (data) {
    	console.log(data);
    });

    $scope.createAlbum = function(){
    	var param = {
	        "loopId": 860,
			"lastUpdate": 0,
			"pageSize": 10
	    };
	    
    	Restangular.one('/v1/Loop/GetLoopAlbum').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data);
	    });
    }

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.log = '';

    $scope.multiple = 1;

    $scope.upload = function (files) {
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
                    $timeout(function() {
                        console.log(data.objectValue.data[0].fileName)
                    });
                });
            }
        }
    };
});
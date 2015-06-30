var loopModule = angular.module('owloop.user.loop');

loopModule.controller('mediaController', function ($scope, Restangular, authenticationSvc, Upload, $timeout) {
    
    getAlbum();
    function getAlbum(){
    	var header = authenticationSvc.getHeader();
	    var param = {
	        "loopId": 860,
			"lastUpdate": 0,
			"pageSize": 10
	    };
	    Restangular.one('/v1/Loop/GetLoopAlbum').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data.objectValue.data);
	    	$scope.albums = data.objectValue.data;
	    });
    }
    

    $scope.newAlbum = {
    	title:'',
    	description:''
    };
    $scope.createAlbum = function(){
    	var header = authenticationSvc.getHeader();
    	var param = {
	        "loopId": 860,
			"title": $scope.newAlbum.title,
			"description": $scope.newAlbum.description,
			"photos": $scope.photos
	    };
	    
    	Restangular.one('/v1/Album/CreateUpdateAlbum').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data);
	    	getAlbum();
	    	$scope.newAlbum.title = null;
	    	$scope.newAlbum.description = null;
	    	$scope.photos = [];
	    	$(function () {
			   $('#modalCreateAlbumSecond').modal('toggle');
			});
	    });
	};

	$scope.createAlbumDone = function(){
		var header = authenticationSvc.getHeader();
		var param = {
	        "loopId": 860,
			"title": $scope.newAlbum.title,
			"description": $scope.newAlbum.description
	    };
	    
    	Restangular.one('/v1/Album/CreateUpdateAlbum').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data);
	    	getAlbum();
	    	$(function () {
			   $('#modalCreateAlbum').modal('toggle');
			});
	    });
	};

	$scope.gotoUpload = function(){
		if($scope.newAlbum.title === ''){
			return
		}

		$(function () {
		   $('#modalCreateAlbum').modal('toggle');
		   $('#modalCreateAlbumSecond').modal('toggle');
		});
	}


    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.log = '';

    $scope.multiple = 1;

    $scope.photos = [];
    $scope.upload = function (files) {
    	var header = authenticationSvc.getHeader();
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
                        console.log(data.objectValue.data[0].fileName);
                        data.objectValue.data[0]['description'] = '';
                        $scope.photos.push(data.objectValue.data[0]);
                    });
                });
            }
        }
    };
});

loopModule.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
var loopModule = angular.module('owloop.user.loop');

loopModule.controller('albumController', function ($scope, Restangular, authenticationSvc, Upload, $timeout, $state, $stateParams) {

	console.log($stateParams.albumId);

	function gotoAlbumDetail(){
		var header = authenticationSvc.getHeader();
		var param = {
	        "albumId": $stateParams.albumId,
			"pageSizePhoto": 50
	    };
	    
    	Restangular.one('/v1/Album/GetAlbumById').customPOST(param, '', {}, header).then(function (data) {
    		$scope.photoOfAlbum = data.objectValue.photos.data;
	    });
	}

    
});


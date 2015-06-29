var userModule = angular.module('owloop.user', [
	'owloop.user.loop'
]);

userModule.controller('leftbarController', function($scope, Restangular, authenticationSvc) {
	console.log('leftbarController');
	var header = authenticationSvc.getHeader();
    var param = {
        "lastUpdate": 1234.5678,
        "pageSize": 10,
        "keyword": "keyword",
        "loopType": null,
    };
    Restangular.one('/v1/Loop/GetMyLoop').customPOST(param, '', {}, header).then(function (data) {
    	$scope.privateLoops = data.objectValue.privateLoops;
		$scope.publicLoops = data.objectValue.publicLoops;
    })
});



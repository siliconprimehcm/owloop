var userModule = angular.module('owloop.user');

userModule.controller('homefeedController', function($scope, authenticationSvc, Restangular) {
	console.log('homefeedController');

	var header = authenticationSvc.getHeader();
    var param = {
        "loopId": 1
   	};
	Restangular.one('/v1/Customer/GetHomeFeedInfo').customPOST(param, '', {}, header).then(function (data) {
		$scope.questionsPosts = data.objectValue.questionsPosts;
	    $scope.posts = data.objectValue.posts;
	    $scope.loopPopulars = data.objectValue.loopPopulars;
	})
});


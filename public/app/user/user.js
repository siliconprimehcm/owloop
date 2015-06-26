var userModule = angular.module('owloop.user', []);



userModule.controller('leftbarController', function($scope, loopList) {
	console.log('leftbarController');
	// $scope.privateLoops = data.objectValue.privateLoops;
	// $scope.publicLoops = data.objectValue.publicLoops;
    console.log(loopList);	
});



userModule.controller('questionController', function($scope) {

    console.log('questionController');
});

userModule.controller('albumController', function($scope) {

    console.log('albumController');
});

var userModule = angular.module('owloop.user', []);



userModule.controller('leftbarController', function($scope, loopList) {
	console.log('leftbarController');
	// $scope.privateLoops = data.objectValue.privateLoops;
	// $scope.publicLoops = data.objectValue.publicLoops;
    console.log(loopList);	
});

userModule.controller('homefeedController', function($scope, newsfeed) {
	console.log('homefeedController');
    $scope.questionsPosts = newsfeed.objectValue.questionsPosts;
    $scope.posts = newsfeed.objectValue.posts;
    $scope.loopPopulars = newsfeed.objectValue.loopPopulars;
});

userModule.controller('postController', function($scope) {

    console.log('postController');
});

userModule.controller('profileController', function($scope) {

    console.log('profileController');
});

userModule.controller('questionController', function($scope) {

    console.log('questionController');
});

userModule.controller('albumController', function($scope) {

    console.log('albumController');
});

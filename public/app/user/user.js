var userModule = angular.module('owloop.user',[]);

userModule.controller('leftbarController', function($scope, loopList) {
	console.log('leftbarController');
	// $scope.privateLoops = data.objectValue.privateLoops;
	// $scope.publicLoops = data.objectValue.publicLoops;
 //    $scope.questionsPosts = data.objectValue.questionsPosts;
 //    $scope.posts = data.objectValue.posts;
 //    $scope.loopPopulars = data.objectValue.loopPopulars;
    
    // Restangular.one('/v1/Post/GetPostById').customPOST({"userId": 1}, '', {}, header).then(function(data){
    // 	console.log('xxxxxxxxxxx');
    // 	console.log(data);
    // })
	
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
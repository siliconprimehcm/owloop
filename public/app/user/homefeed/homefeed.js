var userModule = angular.module('owloop.user');

userModule.controller('homefeedController', function($scope, newsfeed) {
	console.log('homefeedController');
    $scope.questionsPosts = newsfeed.objectValue.questionsPosts;
    $scope.posts = newsfeed.objectValue.posts;
    $scope.loopPopulars = newsfeed.objectValue.loopPopulars;
});

var userModule = angular.module('owloop.user',[]);

userModule.controller('userController', function($scope, data) {
	$scope.privateLoops = data.objectValue.privateLoops;
	$scope.publicLoops = data.objectValue.publicLoops;
    $scope.questionsPosts = data.objectValue.questionsPosts;
    $scope.posts = data.objectValue.posts;
    $scope.loopPopulars = data.objectValue.loopPopulars;
});
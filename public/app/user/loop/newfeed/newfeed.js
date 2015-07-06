var loopModule = angular.module('owloop.user.loop');

loopModule.controller('newfeedController', function ($scope, Restangular, authenticationSvc, $stateParams) {

    getAllFeed();
    function getAllFeed(){
    	var header = authenticationSvc.getHeader();
	    var param = {
	        "loopId": $stateParams.loopId,
			"lastUpdate": 0,
			"firstUpdate": 10,
            "pageSize": 50,
            "pageSizeComment": 50
	    };
	    Restangular.one('/v1/Feed/GetFeeds').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data.objectValue.data);
	    });
    };

    
    $scope.enterToPost = function(){
    	console.log("enter");
    	var header = authenticationSvc.getHeader();
	    var param = {
	        "loopId": $stateParams.loopId,
			"lastUpdate": 0,
			"pageSize": 10
	    };
    	Restangular.one('/v1/Post/CreateUpdatePost').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data.objectValue.data);
	    	$scope.albums = data.objectValue.data;
	    });
    };

    $scope.like = function(post, comment){
    	console.log("like");
        var header = authenticationSvc.getHeader();
        var param = {
            "postId": post.postId,
            "commentId":comment.commentId,
            "unlike":false
        };
        Restangular.one('/v1/Post/LikeUnlike').customPOST(param, '', {}, header).then(function (data) {
            console.log(data.objectValue.data);

        });
    };

    $scope.reply = function(){
    	console.log("reply");
    };

    $scope.showMore = function(){
    	console.log("show more");
    };

    function checkLoopPrivate(){

    };

    

});

loopModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
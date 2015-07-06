var loopModule = angular.module('owloop.user.loop', [

	
]);


loopModule.controller('loopController', function ($scope, Restangular, authenticationSvc, $stateParams, $state) {
    
	getLoopById();
	$scope.loopProfile = {};
    function getLoopById(){
    	var header = authenticationSvc.getHeader();
	    var param = {
	        "loopId": $stateParams.loopId
	    };
	    Restangular.one('/v1/Loop/GetLoopById').customPOST(param, '', {}, header).then(function (data) {
	    	$scope.loopProfile['avatarUrl'] = data.objectValue.avatarUrl;
	    	$scope.loopProfile['name'] = data.objectValue.name;
	    	$scope.loopProfile['description'] = data.objectValue.description;
	    });
    }


    $scope.joinLoop = function(id){
    	var header = authenticationSvc.getHeader();
    	var param = {
	        "loopId": 860,
			"leaveLoop": false,
	    };
   
    	Restangular.one('/v1/Loop/JoinLoop').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data);

	    });
	};

	$scope.gotoLoopNewfeed = function(){
		console.log($stateParams.loopId);
		$state.go('app.user.loop.newfeed', {'loopId':$stateParams.loopId});
	};

	$scope.gotoLoopMedia = function(){
        $state.go('app.user.loop.media');
    };

    $scope.gotoLoopSetting = function(){
        $state.go('app.user.loop.setting');
    };
});
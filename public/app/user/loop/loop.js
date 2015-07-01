var loopModule = angular.module('owloop.user.loop', [

	'ngFileUpload'
]);


loopModule.controller('loopController', function ($scope, Restangular, authenticationSvc) {
    
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
});
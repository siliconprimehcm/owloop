var userModule = angular.module('owloop.user');

userModule.controller('questionController', function ($scope, Restangular, authenticationSvc) {
    
    getQuestionDetail();
    function getQuestionDetail(){
    	var header = authenticationSvc.getHeader();
	    var param = {
	        "postId": 860,
			"pageSize": 10
	    };
	    Restangular.one('/v1/Post/GetPostById').customPOST(param, '', {}, header).then(function (data) {
	    	console.log(data.objectValue.data);
	    	
	    });
    }
   
});

var loopModule = angular.module('owloop.user.loop');

loopModule.controller('mediaController', function ($scope, Restangular, authenticationSvc) {
    var header = authenticationSvc.getHeader();
    var param = {
        "loopId": 12345,
		"lastUpdate": 0,
		"pageSize": 10
    };

    Restangular.one('/v1/Loop/GetLoopAlbum').customPOST(param, '', {}, header).then(function (data) {
    	console.log(data);
    })
});
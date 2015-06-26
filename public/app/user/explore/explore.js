var userModule = angular.module('owloop.user');

userModule.controller('exploreController', function ($scope, loopCategories, Restangular) {
    console.log('exploreController');

    $scope.loopCategories = loopCategories.objectValue.data;
    $scope.selectThisLoop = function(loopId){
        console.log(loopId);
    }

});


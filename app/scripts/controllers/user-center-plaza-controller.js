'use strict';

angular.module('webappApp')
  .controller('UserCenterPlazaController', function ($scope,$routeParams,$window,UserService) {
  	UserService.getExperts().then(function(response){
  		$scope.experts = response.data
  	});
  	$scope.goToUserCenter = function(alias){
      $window.location.href = '#user-center/'+alias;
    };
  });
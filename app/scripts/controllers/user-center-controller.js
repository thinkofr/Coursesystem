'use strict';

angular.module('webappApp')
  .controller('UserCenterController', function ($scope,$routeParams,$window,UserService) {

   UserService.getUser($routeParams.alias).then(function(response){
      $scope.user = response.data;
      // $scope.user.GIN = ginFilter(scope.user.GIN);
   });

   $scope.$on('trainingSummary',function(event,data){
        $scope.trainingDays = data.trainingDays;
        $scope.trainingTimes = data.trainingTimes;
   });

  });
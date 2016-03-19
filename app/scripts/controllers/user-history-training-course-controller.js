'use strict';

angular.module('webappApp').controller('UserHistoryTrainingCourseController', function ($scope,$routeParams,$window,UserService,UserKpiService) {

	UserService.getUserHistoryTrainingCourse($routeParams.alias).then(function(response){
		$scope.trainingCourses = response.data;
		var trainingDays = UserKpiService.getTrainingDays($scope.trainingCourses);
		$scope.$emit('trainingSummary',{
			trainingDays:trainingDays,
			trainingTimes:!$scope.trainingCourses? 0: $scope.trainingCourses.length
		});

	});

	
	$scope.goToTrainingCourse = function(id){
        $window.location.href = '#/training-course/'+id;
    };
});
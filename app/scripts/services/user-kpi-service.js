'use strict';

angular.module('webappApp')
.service('UserKpiService',function($http){
	return {
		getTrainingDays:function(trainingCourses){
			if(!trainingCourses){
				return 0;
			}
			return _.reduce(trainingCourses,function(memo,course){
					var end = new Date(course.EndDate);
					var start = new Date(course.StartDate);
					var trainingDays = (end - start) / (1000*60*60*24)+ 1;
					return memo + trainingDays;
			},0);
		}
	}
});
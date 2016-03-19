'use strict';

angular.module('webappApp')
.service('UserService',function($http){
	return {
		getCurrentUser:function(){
			return $http.get('/api/current-user');
		},
		getUserHistoryTrainingCourse:function(alias){
			return $http.get('/api/history-training-course/'+alias);
		},
        getUser:function(gin){
            return $http.get('/api/user/'+gin);
		},
		getExperts:function(){
			return $http.get('/api/user/experts');
		}

	};
});
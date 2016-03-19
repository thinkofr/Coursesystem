'use strict';

angular.module('webappApp')
.service('SkillService',function($http){
	return {
		getSkills:function(){
			return $http.get('/api/skills');
		}
	};
});
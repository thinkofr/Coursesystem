'use strict';

angular.module('webappApp')
.service('TrainingCourseService',function($http){

        return {
            getTrainingCourses:function(){
              return $http.get('/api/training-courses');
            },
            searchTrainingCourses:function(keyWords){
              return $http.get('/api/search-training-courses/'+keyWords);
            },
            getTrainingCourse:function(courseGuid){
                return $http.get('/api/training-courses/'+courseGuid);
            },
            getKeySkills:function(courseGuid){
                return $http.get('/api/training-courses/'+courseGuid+'/key-skills');
            },
           postFeedback:function(anonymous,feedback){
                return $http.post('/api/training-course/rating/'+anonymous,{
                    Rating: feedback.rating,
                    Comments:feedback.comments,
                    CourseGuid:feedback.courseGuid
                });
           },
           getRoster: function(courseGuid){
                return $http.get('/api/training-courses/'+courseGuid+'/roster');
           },
           getFeedbacks:function(courseGuid){
                return $http.get('/api/training-courses/'+courseGuid+'/rating');
           },
           register:function(userGin,courseGuid){
                return $http.post('/api/training-courses/register',{
                    CourseGuid:courseGuid,
                    UserGin:userGin
                });
           },
           deleteRoster: function(userGin,courseGuid){
                return $http.post('/api/training-courses/'+courseGuid+'/roster/'+userGin);
           },
           postTrainingCourse:function(course){
                return $http.post('/api/create-training-course',course);
           },
           getSkillCourseRelations:function(){
                return $http.get('/api/get-training-course-relations');
           },
           getTrainingCoursesBySkill:function(skillGuid){
                return $http.get('/api/training-courses-by-skill/'+skillGuid);
           },
           getUserinfos:function(){
              return $http.get('/api/userinfos');
           }
        };
});
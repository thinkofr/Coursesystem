'use strict';


angular.module('webappApp')
  .controller('TrainingHomeController', function ($scope,$rootScope,$window,$http,$filter,TrainingCourseService,UserService) {
      
     UserService.getCurrentUser().then(function(response){
        if(response.data.Role === 'admin'){
            $scope.isAdmin = true;
          }else{
            $scope.isAdmin = false;
          }
     });

    $scope.searchKeyWords = '';

    

    $scope.getTrainingCourses = function(){
        TrainingCourseService.getTrainingCourses().then(function(response){
        $scope.trainingCourses = response.data;
        $scope.totalTrainingCoursesCount = response.data.length;
        $scope.coursesSummary = "all";
        $scope.order('StartDate',true);
      },function(){
        console.log('load training courses failed');
      });
    }

    $scope.getTrainingCourses();
    TrainingCourseService.getSkillCourseRelations().then(function(response){
      $scope.skills = response.data;
    });


  $scope.order = function(predicate, reverse) {
    $scope.trainingCourses = $filter('orderBy')($scope.trainingCourses, predicate, reverse);
  };

    $scope.goToCreateTrainingCourse = function(){
        $window.location.href = '#/create-training-course';
    };

    $scope.goToTrainingCourse = function(id){
            $window.location.href = '#/training-course/'+id;
    };

    $scope.searchCourseBySkill = function(skillGuid,skill){
        TrainingCourseService.getTrainingCoursesBySkill(skillGuid).then(function(response){
            $scope.trainingCourses = response.data;
            $scope.coursesSummary = skill;

        });
    };

    $scope.searchTrainingCourses = function(){
      var promise;
      var coursesSummary;
      if(!$scope.searchKeyWords){
           promise = TrainingCourseService.getTrainingCourses();
           coursesSummary = "all";
      }else{
        coursesSummary = $scope.searchKeyWords;
        promise = TrainingCourseService.searchTrainingCourses($scope.searchKeyWords.replace( /\s+/g,","));

      }
      
      promise.then(function(response){
        $scope.trainingCourses = response.data;
        $scope.coursesSummary = coursesSummary;
        $scope.order('Title',false);
      },function(){
        console.log('failed');
      });
    };

  });

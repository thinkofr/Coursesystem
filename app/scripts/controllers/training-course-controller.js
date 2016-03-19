'use strict';

angular.module('webappApp')
  .controller('TrainingCourseController', function ($compile,$rootScope,$scope,$routeParams,$window,
    TrainingCourseService,FeedbackService,CourseAttachmentService,UserService) {
    $scope.isAdmin = false;
    $scope.noAttachment = true;
    $scope.range = function(n) {
      return new Array(n);
    };
     
     TrainingCourseService.getTrainingCourse($routeParams.courseId).then(function(response){
        $scope.course = response.data;
        $scope.noAttachment = !$scope.course.Attachment;
     });

     TrainingCourseService.getKeySkills($routeParams.courseId).then(function(response){
        $scope.keySkills = response.data;
     });

     UserService.getCurrentUser().then(function(response){
        $scope.feedback.anonymous = false;
        $scope.isAdmin = response.data.Role === 'admin';
     },function(){
        $scope.feedback.anonymous = true;
     });

     $scope.$on('clickRating',function(event,data){
        $scope.feedback.score = data.rating;
     });

     $scope.downloadCourseAttachment = function(){
        CourseAttachmentService.downloadAttachment($routeParams.courseId,$scope.appPath);
     };

     $scope.uploadCourseAttachments = function(){
          var files = angular.element("#course-attachments").get(0).files;

          if(files.length < 1){
            return;
          }
          var data = new FormData();
          data.append("CourseAttachments", files[0]);
          CourseAttachmentService.uploadAttachment($routeParams.courseId,data).done(function (xhr, textStatus) {
            $scope.noAttachment = false;
          });
     };

    var getFeedbacks = function(){
          TrainingCourseService.getFeedbacks($routeParams.courseId).then(function(response){
              $scope.feedbackItems = response.data;
              var distributes = FeedbackService.getRatingDistribute(response.data);
              $scope.feedbackStats ={
                'scoresCatalag' :[
                  { 'score':10,'percentage':distributes['10']},
                  { 'score':8,'percentage':distributes['8']},
                  { 'score':6,'percentage':distributes['6']},
                  { 'score':4,'percentage':distributes['4']},
                  { 'score':2,'percentage':distributes['2']}
                ],
                'averageScore':FeedbackService.getAverageRating(response.data)
              };
          });
     };

     var setFeedbackStats = function(){
          $scope.feedbackStats ={
                'scoresCatalag' :[
                  { 'score':10,'percentage':'0%'},
                  { 'score':8,'percentage':'0%'},
                  { 'score':6,'percentage':'0%'},
                  { 'score':4,'percentage':'0%'},
                  { 'score':2,'percentage':'0%'}
                ],
                'averageScore':0
              };
     };

     var initFeedback = function(){
         $scope.feedback = {
              score:0,
              comments:''
          };

          $rootScope.$broadcast('clearFeedbackScore');
     };

    initFeedback();
    setFeedbackStats();
    getFeedbacks();

    $scope.goToUserCenter = function(alias){
      $window.location.href = '#user-center/'+alias;
    };

    $scope.submitFeedback = function(){
        var feedback = {
            rating: $scope.feedback.score,
            comments:$scope.feedback.comments,
            courseGuid:$routeParams.courseId
        };
        TrainingCourseService.postFeedback($scope.feedback.anonymous || false, feedback).then(function(){
             initFeedback();
             getFeedbacks();
        });
    };

    $scope.registerRoster = function(){
       TrainingCourseService.register($scope.modelObj.GIN,$routeParams.courseId).then(function(response){
            $scope.rosters = response.data;
            $scope.modelObj.label="";
            $scope.modelObj.value="";

       });
    }

    $scope.deleteRoster = function(userGin){
       TrainingCourseService.deleteRoster(userGin,$routeParams.courseId).then(function(response){
            $scope.rosters = response.data;
       });
    }
    $scope.resetFeedback = function(){
        initFeedback();
    };

    TrainingCourseService.getRoster($routeParams.courseId).then(function(response){
       $scope.rosters = response.data;
    });

    var users;
    TrainingCourseService.getUserinfos().then(function(response){
        users = response.data;
    });


      $scope.modelObj = {
        label:"",
        value:"",
        GIN:""
      };

      $scope.myOption = {
        options: {
            html: true,
            focusOpen: false,
            onlySelectValid: true,
            appendTo:".roster-selector",
            source: function (request, response) {

                var datas = [];
                 _.each(users,function(element,index){
                    datas.push({
                      label:element.UserInfo,
                      value:element.UserInfo,
                      GIN: element.GIN,
                    });
                });

                var data = $scope.myOption.methods.filter(datas, request.term);
                if (!data.length) {
                    data.push({
                        label: 'not found',
                        value: ''
                    });
                }
                response(data);
            }
        }
    };

  });

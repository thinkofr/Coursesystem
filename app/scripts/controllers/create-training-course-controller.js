'use strict';

angular.module('webappApp')
  .controller('CreateTrainingCourseController', function ($rootScope,$scope,TrainingCourseService,SkillService) {
      $scope.course = {
        Title:'',
        StartDate:'',
        EndDate:'',
        Location:'',
        Instructor:'',
        InstructorIntroduction:'',
        MaximumEnroll:'',
        Language:'English',
        KeySkills:[],
        Cost:'',
        CourseIntroduction:'',
        Curriculum:''
      };

    $scope.keySkillPool = [];
    $scope.keySkillModel = {
        label:"",
        value:"",
        keySkill:""
    };

    var keySkills = [];

    SkillService.getSkills().then(function(response){
        keySkills = response.data;
    });


  $scope.addKeySkills = function(){
    if($scope.keySkillModel.label && $scope.keySkillModel.value){
        $scope.keySkillPool.push($scope.keySkillModel.keySkill);
        $scope.keySkillModel.label="";
        $scope.keySkillModel.value="";
    }
  };
  $scope.deleteKeySkill = function(skill){
        var index = _.indexOf($scope.keySkillPool, skill);
        if(index !== -1){
            $scope.keySkillPool.splice(index,1);
        }
  }

  $scope.myOption = {
    options: {
        html: true,
        focusOpen: true,
        onlySelectValid: true,
        appendTo:".key-skills",
        source: function (request, response) {

                var datas = [];

                 _.each(keySkills,function(element,index){
                    datas.push({
                      label:element.Element,
                      value:element.Element,
                      keySkill: {Guid:element.KeyGUID,Element:element.Element}
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


    $scope.createTrainingCourse = function(){
        $scope.course.KeySkills = _.pluck($scope.keySkillPool,'Guid');
        TrainingCourseService.postTrainingCourse($scope.course).then(function(){
            alert("create successfully");
            $scope.course.KeySkills = [];
        });
    };

    
  });
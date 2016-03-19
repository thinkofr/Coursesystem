'use strict';

/**
 * @ngdoc overview
 * @name webappApp
 * @description
 * # webappApp
 *
 * Main module of the application.
 */
angular
  .module('webappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'smart-table',
    'ui.autocomplete',
    'ui.bootstrap',
    'angular-timeline',
    'angular-scroll-animate'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/training-home', {
        templateUrl: 'views/training-home.html',
        controller: 'TrainingHomeController'
      })
      .when('/user-center/:alias',{
        templateUrl:'views/user-center.html',
        controller:'UserCenterController'
      })
      .when('/user-center-plaza',{
        templateUrl:'views/user-center-plaza.html',
        controller:'UserCenterPlazaController'
      })
      .when('/training-course/:courseId',{
        templateUrl:'views/training-course.html',
        controller:'TrainingCourseController'
      })
      .when('/create-training-course',{
        templateUrl:'views/create-training-course.html',
        controller:'CreateTrainingCourseController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('MainController', ["$scope", "$http", "$window", function ($scope,$http,$window) {
  	var getCurrentUser = function(){
        return $http.get('/api/current-user');
     };

     getCurrentUser().then(function(response){
        $scope.currentUser = response.data;
     });

     $scope.signOff = function() {
         $http.post('/api/logoff').then(function() {
             $scope.currentUser = null;
             $window.location.href = '/training';
         });
     }

  }]);

'use strict';

angular.module('webappApp')
  .controller('TrainingCourseController', ["$compile", "$rootScope", "$scope", "$routeParams", "$window", "TrainingCourseService", "FeedbackService", "CourseAttachmentService", "UserService", function ($compile,$rootScope,$scope,$routeParams,$window,
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

  }]);

'use strict';

angular.module('webappApp')
  .controller('CreateTrainingCourseController', ["$rootScope", "$scope", "TrainingCourseService", "SkillService", function ($rootScope,$scope,TrainingCourseService,SkillService) {
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

    
  }]);
'use strict';


angular.module('webappApp')
  .controller('TrainingHomeController', ["$scope", "$rootScope", "$window", "$http", "$filter", "TrainingCourseService", "UserService", function ($scope,$rootScope,$window,$http,$filter,TrainingCourseService,UserService) {
      
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

  }]);

'use strict';

angular.module('webappApp').controller('UserHistoryTrainingCourseController', ["$scope", "$routeParams", "$window", "UserService", "UserKpiService", function ($scope,$routeParams,$window,UserService,UserKpiService) {

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
}]);
'use strict';

angular.module('webappApp')
  .controller('UserCenterController', ["$scope", "$routeParams", "$window", "UserService", function ($scope,$routeParams,$window,UserService) {

   UserService.getUser($routeParams.alias).then(function(response){
      $scope.user = response.data;
      // $scope.user.GIN = ginFilter(scope.user.GIN);
   });

   $scope.$on('trainingSummary',function(event,data){
        $scope.trainingDays = data.trainingDays;
        $scope.trainingTimes = data.trainingTimes;
   });

  }]);
'use strict';

angular.module('webappApp')
  .controller('UserCenterPlazaController', ["$scope", "$routeParams", "$window", "UserService", function ($scope,$routeParams,$window,UserService) {
  	UserService.getExperts().then(function(response){
  		$scope.experts = response.data
  	});
  	$scope.goToUserCenter = function(alias){
      $window.location.href = '#user-center/'+alias;
    };
  }]);
'use strict';

angular.module('webappApp')
  .controller('SkillMapHomeController', ["$scope", "$http", function ($scope,$http) {
    $http.get('/api/projects?Scope=ProductLine').then(function(response){
      console.log(response);
    });
    $scope.productlines = [
      {'name': 'Drilling', 'id': '54455e14-6323-4879-8823-8a1a1a8febfc'},
      {'name': 'IA', 'id': '086166b5-bfb7-4939-a2af-745f2ab3525c'},
      {'name': 'IE', 'id': 'cc0d9002-e781-4045-8525-b109db00237d'},
      {'name': 'IT', 'id': 'f7a999ac-375e-415e-9ff3-4e60cdb0e738'},
      {'name': 'Maxwell', 'id': '2b323beb-123e-4792-9d4c-b0573fc096cf'},
      {'name': 'Maxwell Apps', 'id': '2262898b-e2e5-47da-ad05-bd36c239c74b'},
      {'name': 'Métier','id': 'b209ad1b-ce32-4fd0-a8dd-2ff48b64bb02'},
      {'name': 'QA', 'id': '5da2ddde-f01d-45fe-8683-1294fcf7cc70'}];

  }]);

'use strict';

angular.module('webappApp')
.service('TrainingCourseService',["$http", function($http){

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
}]);
'use strict';

angular.module('webappApp')
.service('FeedbackService',["$filter", function($filter){

		var getRatingPercentage = function(aDistribuate,feedbacks){
			if(feedbacks.length === 0 || !aDistribuate){
				return "0%";
			}

			var length = aDistribuate.length;
			return $filter('number')(length / feedbacks.length * 100,0)+"%";
		};


		return {
			getAverageRating:function(feedbacks){
				if(!feedbacks || feedbacks.length === 0){
					return 0;
				}

        var sum = 0;
        var validLen = 0;
				_.each(feedbacks, function(element, index) {
          if (element.Rating !== 0) {
            sum += element.Rating;
            validLen++;
          }
        });
        if(validLen === 0){
          return 0;
        }
				return sum/validLen;
			},
			getRatingDistribute:function(feedbacks){
				if(!feedbacks){
					return 0;
				}

        var validFeedbacks = _.filter(feedbacks, function(feedback){ return feedback.Rating > 0; });
				var distribute = _.groupBy(validFeedbacks,function(feedback){
					return feedback.Rating;
				});

				return {
					'2':getRatingPercentage(distribute['2'],validFeedbacks),
					'4':getRatingPercentage(distribute['4'],validFeedbacks),
					'6':getRatingPercentage(distribute['6'],validFeedbacks),
					'8':getRatingPercentage(distribute['8'],validFeedbacks),
					'10':getRatingPercentage(distribute['10'],validFeedbacks)
				};
			}
		};
}]);

'use strict';

angular.module('webappApp')
.service('SkillService',["$http", function($http){
	return {
		getSkills:function(){
			return $http.get('/api/skills');
		}
	};
}]);
'use strict';

angular.module('webappApp')
.service('UserService',["$http", function($http){
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
}]);
'use strict';

angular.module('webappApp')
.service('UserKpiService',["$http", function($http){
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
}]);
'use strict';

angular.module('webappApp')
.service('CourseAttachmentService',["$http", function($http){
	return {
		uploadAttachment:function(courseGuid,data){
			return $.ajax({
           				type: "POST",
			           url: "/api/course-attachment/"+courseGuid,
			           contentType: false,
			           processData: false,
			           data: data
			        });

		},
		downloadAttachment:function(courseGuid,appPath,failureCallBack){
			$http.get('/api/course-attachment/'+courseGuid, {responseType: "arraybuffer"})
			.success(function(data, status, headers) {
	      		var octetStreamMime = "application/octet-stream";

	            headers = headers();
	            var filenameValue = headers["content-disposition"].split(";")[1].split("=")[1];

	            var filename = filenameValue;
	            if(filename.indexOf('\"')>-1){
	            	filename = filenameValue.substring(1,filenameValue.length-1);
	            }
	            var contentType = headers["content-type"] || octetStreamMime;

	            var saveBlob = navigator.msSaveBlob || navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;

	            if(saveBlob)
	            {
	                var blob = new Blob([data], { type: contentType });
	                saveBlob(blob, filename);
	                console.log("SaveBlob Success");
	            }
	            else
	            {
	                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
	                if(urlCreator)
	                {
	                    var link = document.createElement("a");
	                    if("download" in link)
	                    {
	                        var blob = new Blob([data], { type: contentType });
	                        var url = urlCreator.createObjectURL(blob);
	                        link.setAttribute("href", url);
	                        link.setAttribute("download", filename);

	                        var event = document.createEvent('MouseEvents');
	                        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	                        link.dispatchEvent(event);
	                    } else {
	                        var blob = new Blob([data], { type: octetStreamMime });
	                        var url = urlCreator.createObjectURL(blob);
	                        window.location = url;
	                    }

	                } else {
	                    window.open(appPath + 'CourseRegConfirm/getfile','_blank','');
	                }
	            }

	        })
	        .error(function(data, status) {
	            if(failureCallBack){
	            	failureCallBack();
	            }
	        });
		}
	};
}]);
'use strict';

angular.module('webappApp')
    .directive('starRating',function(){
        var starsSpan,stars,shortComment,feedback;
        var getStarHtml = function(starType,count){
            var starHtml='';
            for(var i=0;i<count;i++){
                starHtml += '<i class="fa '+starType+'"></i>';
            }
            return starHtml;
        };

        var shortComments = {
            0:'Terrible',
            1:'Not good',
            2:'Normal',
            3:'Very good',
            4:'Excellent'
        };

        var setFeedbackStars = function(index){
            for(var i=0;i<=index;i++){
                $(stars[i]).removeClass('fa-star-o').addClass('fa-star');
            }
            for(var j=index+1;j<5;j++){
                $(stars[j]).removeClass('fa-star').addClass('fa-star-o');
            }
            shortComment.html(shortComments[index]);
        };

        var resetStars = function(){
            for(var i=0;i<5;i++){
                $(stars[i]).removeClass('fa-star').addClass('fa-star-o');
            }
            shortComment.html('Select the rating.');

        };

        var initListeners = function(scope){
            stars.bind({
                mouseenter: function(){
                    var index = $(this).index();
                    setFeedbackStars(index);
                },
                mouseleave: function(){
                    resetStars();
                }
            });

            stars.on('click',function(event,obj){
                var index = $(this).index();
                stars.unbind();

                scope.$emit('clickRating', {rating:(index + 1) * 2});

            });
        };

        var getFeedbackStarHtml = function(score,clickable){
            var full = parseInt(score / 2),
                half = score % 2 > 0.5 ? 1 : 0,
                empty = 5 - full - half;

             var enableFeedback = clickable==="true" ? "enable-feedback-star" : "";
                var template = '<span class="feedback-star '+enableFeedback+'">';
                template += getStarHtml('fa-star',full);
                template += getStarHtml('fa-star-half-o',half);
                template += getStarHtml('fa-star-o',empty);
                template += '</span>';

                return template;
            };

        return {
            restrict:'E',
            scope:{
                ratingScore: '=score'
            },
            link:function(scope,element,attrs){
                var clickable = attrs.clickable || false;
                var score = scope.ratingScore || 0;
                var parentClass = attrs.parentclass || "";

                var template = getFeedbackStarHtml(score,clickable, element);
                element.replaceWith(template);

                if(clickable){
                    starsSpan = angular.element('.enable-feedback-star');
                    stars = starsSpan.find('i');
                    starsSpan.append('<span class="star-short-comments" ng-bind="feedback.comments"></span>');
                    shortComment = starsSpan.find('.star-short-comments');
                    shortComment.html('Select the rating.');

                    initListeners(scope);
                }

                scope.$on('clearFeedbackScore',function(){
                    resetStars();
                    initListeners(scope);

                });

                scope.$watch("ratingScore",function(newValue, oldValue){
                    var template = getFeedbackStarHtml(newValue,clickable);

                    if(parentClass){
                        var newEle = angular.element("."+parentClass+ " .feedback-star");
                        newEle.replaceWith(template);
                    }
                });

            }
        };
    });

'use strict';

angular.module('webappApp')
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
'use strict';

angular.module('webappApp')
    .filter('localDateFilter',["$filter", function($filter){
    	return function(input){
    		if(!input){
    			return "";
    		}
    		var inputDate = new Date(input+'Z');
    		var localDate = inputDate.toLocaleString();
    		return inputDate;
    	}
    }]);
'use strict';

angular.module('webappApp')
    .filter('ginFilter',["$filter", function($filter){
        var getAdjustGin = function(gin){
            gin = gin.trim();
            var length = gin.length;


            if(length === 7){
                return "0" + gin;
            }          
            if(length === 6){
                return "00" + gin;
            }      
            if(length === 5){
                return "000" + gin;
            }
            
            return gin;

        };

    	return function(input){
    		if(!input){
    			return "";
    		}
            return getAdjustGin(input);
    	};
    }]);
/**
 * Created by LMa11 on 7/9/2015.
 */
'use strict';

angular.module('webappApp')
    .filter('oncePerMonth', function(){
        return function (data) {
//        var filtered = [], months = [];



            var uniq = _.uniq(data, true, function (item) {
                return item.StartDate.substr(2, 5);
            });



            return   uniq;
//        data.forEach(function(item){
//
//            var month = item.StartDate.substr(2,5);
//
//            if ((months.indexOf(month)) === -1){
//                months.push(month);
//                filtered.push(item);
//            }
//            alert(months.indexOf(month)+months);
//
//        });
//            alert("ok");
//        return filtered;

        }  });



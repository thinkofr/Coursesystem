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
  .config(function ($routeProvider) {
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
  });

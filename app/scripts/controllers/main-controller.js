'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('MainController', function ($scope,$http,$window) {
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

  });

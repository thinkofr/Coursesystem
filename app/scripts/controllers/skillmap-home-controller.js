'use strict';

angular.module('webappApp')
  .controller('SkillMapHomeController', function ($scope,$http) {
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

  });

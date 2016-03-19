'use strict';

angular.module('webappApp')
    .filter('localDateFilter',function($filter){
    	return function(input){
    		if(!input){
    			return "";
    		}
    		var inputDate = new Date(input+'Z');
    		var localDate = inputDate.toLocaleString();
    		return inputDate;
    	}
    });
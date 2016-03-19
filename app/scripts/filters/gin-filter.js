'use strict';

angular.module('webappApp')
    .filter('ginFilter',function($filter){
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
    });
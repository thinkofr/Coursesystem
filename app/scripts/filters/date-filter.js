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



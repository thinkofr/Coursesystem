'use strict';

angular.module('webappApp')
.service('FeedbackService',function($filter){

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
});

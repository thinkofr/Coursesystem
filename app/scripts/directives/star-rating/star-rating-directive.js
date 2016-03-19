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

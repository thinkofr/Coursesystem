'use strict';

describe('FeedbackService', function () {

  beforeEach(module('webappApp'));


  it('should distribute feedbacks groupby rating', function () {
    var feedbacks = [{Rating:2},{Rating:4},{Rating:6},{Rating:8},{Rating:2},
                    {Rating:4},{Rating:4},{Rating:6},{Rating:6},{Rating:10}];

    var expectDistributes = {
      2:[{Rating:2},{Rating:2}],
      4:[{Rating:4},{Rating:4}],
      6:[{Rating:6},{Rating:6}],
      8:[{Rating:8}],
      10:[{Rating:10}]
    };

    var actualDistributes = FeedbackService.getRatingDistribute(feedbacks);


  });
});

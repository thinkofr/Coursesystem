'use strict';

angular.module('webappApp')
.service('CourseAttachmentService',function($http){
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
});
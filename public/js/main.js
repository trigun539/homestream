$(document).ready(function(){
  // Gets files for current path
  function getFiles(path, callback){
    url = '/api/files';

    if(path){
      url += '?path=' + path;
    }

    $.ajax({
      url: url,
      type: 'GET',
      success: function(files){
        callback(files);
      },
      error: function(err){
        $.bootstrapGrowl('Unable to get files.', {
          type: 'danger',
          align: 'center',
          width: 'auto',
          allow_dismiss: false
        });
      }
    });
  }

  // Show file List
  function showList(files){
    var html    = '',
    currentPath = window.location.hash.replace('#', '');

    _.each(files, function(file){
			var mp4 = '<a href="'+currentPath.substring(currentPath.indexOf('/'), currentPath.length)+ '/'+ encodeURIComponent(file) + '">';
			mp4 += '<span class="badge"><i class="fa fa-play fa-3x"></i></span>';
			mp4 += '</a>';
			
			var video = '<a href="/video?videoURL='+currentPath.substring(currentPath.indexOf('/'), currentPath.length)+ '/'+ encodeURIComponent(file) + '">';
			video += '<span class="badge"><i class="fa fa-globe fa-3x"></i></span>';
			video += '</a>';
			
			var mp3 = '<a href="/audio?audioPath='+currentPath.substring(currentPath.indexOf('/'), currentPath.length)+ '/'+ encodeURIComponent(file) + '">';
			mp3 += '<span class="badge"><i class="fa fa-headphones fa-3x"></i></span>';
			mp3 += '</a>';
			
      if(/^.*\.(mp4|avi|flv|mp3|mkv|m4v)$/i.test(file)){
        html += '<li class="list-group-item">';
        html += '<span class="file-text">'+file+'</span>';
				
				if(/^.*\.(mp4|m4v)$/i.test(file)){
					html += mp4;
					html += video;
				}

				if(/^.*\.(mp3)$/i.test(file)){
					html += mp3;
				}

        html += '</li>';
      }else{
        html += '<a href="#" class="list-group-item folder">';
        html += file;
        html += '<i class="fa fa-angle-right pull-right"></i></a>';
      }
    });

    $('#fileList').html(html);
  }

  /**
   * Events
   */

  $(window).on('hashchange', function() {
    var hash = window.location.hash.substring(1,window.location.hash.length);
    // Get inner of that
    getFiles(hash, function(files){
      showList(files);
    });
  });

  $('#fileList').on('click', 'a.folder', function(e){
    e.preventDefault();
    var currentPath = window.location.hash;

    if(currentPath.length !== 0){
      currentPath += '/' + encodeURIComponent($(e.currentTarget).text());
    }else{
      currentPath += encodeURIComponent($(e.currentTarget).text());
    }

    window.location.hash = currentPath;
  });

  getFiles(window.location.hash.substring(1,window.location.hash.length), function(files){
    showList(files);
  });
});

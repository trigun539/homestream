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
    currentPath = window.location.hash;

    _.each(files, function(file){
      if(/^.*\.(mp4|m4v|avi|flv|mp3|mkv)$/i.test(file)){
        html += '<a href="'+currentPath.substring(currentPath.indexOf('/'), currentPath.length)+ '/'+ encodeURIComponent(file) + '" class="list-group-item video">';
        html += file;
        html += '</a>';
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
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
    var html = '';
    _.each(files, function(file){
      if(/^.*\.(mp4|avi|flv|mp3|mkv)$/i.test(file)){
        console.log(currentPath.indexOf('/'), currentPath);
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

  // Current Selected path
  var currentPath = '';

  /**
   * Events
   */

  $('#fileList').on('click', 'a.folder', function(e){
    e.preventDefault();

    if(currentPath.length !== 0){
      currentPath += '/' + encodeURIComponent($(e.currentTarget).text());
    }else{
      currentPath += encodeURIComponent($(e.currentTarget).text());
    }

    // Get inner of that
    getFiles(currentPath, function(files){
      showList(files);
    });
  });

  getFiles('', function(files){
    showList(files);
  });
});
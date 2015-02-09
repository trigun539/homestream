$(document).ready(function(){
  
  // Get Locations
  $.ajax({
    url: '/api/locations',
    type: 'GET',
    success: function(locations){
      var html = '';
      _.each(locations, function(loc){
        html += '<li class="list-group-item">';
        html += loc;
        html += '<a href="#" class="btn btn-danger pull-right settings-del-btn">';
        html += '<i class="fa fa-times"></i>';
        html += '</a>';
        html += '</li>';
      });

      $('#list').html(html);
    },
    error: function(err){
      $.bootstrapGrowl('Unable to get locations.', {
        type: 'danger',
        align: 'center',
        width: 'auto',
        allow_dismiss: false
      });
    }
  });

  // Add new location
  $('#saveBtn').click(function(){
    var location = {
      name: $('#nameInput').val().trim(),
      path: $('#pathInput').val().trim()
    };

    $.ajax({
      url: '/api/locations',
      type: 'POST',
      data: location,
      success: function(res){
        window.location.reload();
      },
      error: function(res){
        $.bootstrapGrowl('Could not save location.', {
          type: 'danger',
          align: 'center',
          width: 'auto',
          allow_dismiss: false
        });
      }
    });
  });

  // Delete location
  $('#list').on('click', 'a', function(e){
    $.ajax({
      url: '/api/locations/' + encodeURIComponent($(e.currentTarget).parent().text()),
      type: 'DELETE',
      success: function(res){
        window.location.reload();
      },
      error: function(err){
        $.bootstrapGrowl('Could not remove location.', {
          type: 'danger',
          align: 'center',
          width: 'auto',
          allow_dismiss: false
        });
      }
    });
  });
});
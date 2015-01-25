$(document).ready(function(){
  var ulWidth = $('.btn-group').width();
  $('.leftBtn').width(ulWidth - 67);

  // Set right width to list items
  $(window).resize(function(){
    var ulWidth = $('.btn-group').width();
    $('.leftBtn').width(ulWidth - 67);
  });

});

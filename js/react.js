$(function() {
  $(window).scroll(function() {
    $('#back,#up').css('bottom', 8 - $(window).scrollTop());
    $('#nav').css('top', $(window).scrollTop());
    $('#footer').css('bottom', -56 - $(window).scrollTop());
  });
  setTimeout(function(){
  	$('#cover').remove();
  },5000);
});
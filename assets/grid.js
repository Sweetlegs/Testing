
var $grid = $('.MasonGrid').isotope({
// options...
});
// layout Isotope after each image loads

$(function(){


    $('img.lazyload').on('appear',function(){
        $grid.isotope('layout');
    });
});

$(window).load(function(){
    $grid.isotope('layout');
});
$(window).resize(function(){
    $grid.isotope('layout');
});
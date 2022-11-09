jQuery(function($) {
   var redirect_ca = localStorage.getItem('redirect_ca');

    var url = window.location.href,
      status = url.split('?')[1];
    if (status == 'no-redirect') {
      localStorage.setItem('redirect_ca', 'no');  
    }

    if ( status == 'redirected_us') {
      setTimeout(function () {
          $('#redirect-bar').slideDown('slow');  
        }, 600);
    }
    else if (redirect_ca == 'no') {
        return false; 
    } 

    // onclick close redirect bar
    $('.redirect-btn.no').click(function(e) {
      e.preventDefault();
      $('#redirect-bar').slideUp('slow'); 
      
      localStorage.setItem('redirect_ca', 'no');  
      
    });


  if(!localStorage.getItem("country")){
      jQuery.ajax({
      url: 'https://ip2c.org/self',
      type: 'GET',
        success: function(location) {
        $country_name = location.split(';').pop();
       localStorage.setItem("country", $country_name);
        $('#redirect-bar .redirect-bar-text .country').text($country_name);
        var url = window.location.href,
            status = url.split('?')[1];

        var url_account = window.location.pathname;


        if($country_name != 'Canada') {

          if (status == 'no-redirect' || redirect_ca == 'no' || url_account == '/account/login') {}
          else {
           window.top.location.href = 'https://sweetlegs.com'+window.location.pathname+'?redirected_us'; 
          }

        }   
      },
        error: function(error) {
          console.log(error);
        }
    });
  } else {
        $('#redirect-bar .redirect-bar-text .country').text(localStorage.getItem("country"));
        var url = window.location.href,
            status = url.split('?')[1];

        var url_account = window.location.pathname;


        if(localStorage.getItem("country") != 'Canada') {

          if (status == 'no-redirect' || redirect_ca == 'no' || url_account == '/account/login') {}
          else {
           window.top.location.href = 'https://sweetlegs.com'+window.location.pathname+'?redirected_us'; 
          }

        }       
  }
  
  

});
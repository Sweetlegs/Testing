jQuery(function($) {
   var redirect_us = localStorage.getItem('redirect_us');;
    var url = window.location.href,
      status = url.split('?')[1];
      
    if (status == 'no-redirect' ) { 
      localStorage.setItem('redirect_us', 'no'); 
    }

    if ( status == 'redirected_us') {
      setTimeout(function () {
          $('#redirect-bar').slideDown('slow');  
        }, 600);
    }
    else if (redirect_us == 'no') {
        return false;
    } 

    // onclick close redirect bar
    $('.redirect-btn.no').click(function(e) {
      e.preventDefault();
      $('#redirect-bar').slideUp('slow'); 
      localStorage.setItem('redirect_us', 'no'); 
    });

//$('.redirect-btn:not(.no)').hide();
 if(!localStorage.getItem("country")) {
  jQuery.ajax({
    url: 'https://ip2c.org/self',
    type: 'GET',
    success: function(location) {
      $country_name = location.split(';').pop();
      localStorage.setItem("country", $country_name);
      $('#redirect-bar .redirect-bar-text .country').text($country_name);
      if($country_name == 'United States' || $country_name == 'Canada') {
        $('.cookie-banner').css('display', 'none');  
      } else  if (CryptoJS.AES.decrypt(document.cookie.replace(/(?:(?:^|.*;\s*)pivacyPolicyAccept\s*\=\s*([^;]*).*$)|^.*$/, "$1"), "Secret Passphrase").toString(CryptoJS.enc.Utf8) !== "true") {
           $('.cookie-banner').css('display', 'block');    
        }
      var url = window.location.href,
          status = url.split('?')[1];

      var url_account = window.location.pathname;
     
      
      if($country_name === 'Canada') {

        if (status == 'no-redirect' || redirect_us == 'no' || url_account == '/account/login') {
 
        }
        else {
         window.top.location.href = 'https://sweetlegs.ca'+window.location.pathname+'?redirected_us'; 
        }

      }   
    }
  });
 } else {   
      $('#redirect-bar .redirect-bar-text .country').text(localStorage.getItem("country"));
      if(localStorage.getItem("country") == 'United States' || localStorage.getItem("country") == 'Canada') {
        $('.cookie-banner').css('display', 'none');  
      } else  if (CryptoJS.AES.decrypt(document.cookie.replace(/(?:(?:^|.*;\s*)pivacyPolicyAccept\s*\=\s*([^;]*).*$)|^.*$/, "$1"), "Secret Passphrase").toString(CryptoJS.enc.Utf8) !== "true") {
           $('.cookie-banner').css('display', 'block');    
        }
      var url = window.location.href,
          status = url.split('?')[1];

      var url_account = window.location.pathname;
     
      
      if(localStorage.getItem("country") === 'Canada') {

        if (status == 'no-redirect' || redirect_us == 'no' || url_account == '/account/login') {}
        else {
         window.top.location.href = 'https://sweetlegs.ca'+window.location.pathname+'?redirected_us'; 
        }

      }   
 }

});
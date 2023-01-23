if(navigator.cookieEnabled == true) {
  var usersSetCurrency = getCookie('users_currency')
  if(usersSetCurrency == ""){
    getCountry(function (users_country) {
      if(users_country != 'CA'){
        users_currency_code = 'USD';
      } else {
        users_currency_code = 'CAD';
      }
      setCookie('users_currency', users_currency_code, 365);
      setCurrency(users_currency_code.substring(0, 2));
    });

  } else if(usersSetCurrency == "US"){
      usersSetCurrency = "USD";
      setCookie('users_currency', "USD", 365);
  } else if(usersSetCurrency == "CA"){
      usersSetCurrency = "CAD";
      setCookie('users_currency', "CAD", 365);
  } else {
    //var currentCurrency = document.querySelector('#currency_form select').value;
    var currentCurrency = document.querySelector('#localization_form select').value;
    console.log("currency = " + currentCurrency + "D");
    if(usersSetCurrency != currentCurrency + "D"){
      console.log("set country to " + usersSetCurrency.substring(0, 2));
      setCurrency(usersSetCurrency.substring(0, 2));
    }
  }

  //currency_selector_element = document.querySelector('#currency_form select')
  currency_selector_element = document.querySelector('#localization_form select');
  console.log("change event on " + currency_selector_element.value + "D");
  currency_selector_element.addEventListener('change', (event) => {
    setCookie('users_currency', currency_selector_element.value + "D", 365);
    document.getElementById("localization_form").submit();
  });
};

// Get users Country code
function getCountry(callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        callback(httpRequest.responseText.split(";")[1]); 
      }
    }
  };
  httpRequest.open('GET', "https://ip2c.org/self");
  httpRequest.send();
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      console.log("cookie = " + c.substring(name.length, c.length));
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=strict;Secure";
}

function setCurrency(currency_code){
  //var selector = document.querySelector('#currency_form select');
  var selector = document.querySelector('#localization_form select');
  var options = selector.options;
  for (var opt, c=0; opt = options[c]; c++){
    if(opt.value==currency_code){
      selector.selectedIndex = c;
      break;
    }
  };
  //document.getElementById("currency_form").submit();
  document.getElementById("localization_form").submit();
}